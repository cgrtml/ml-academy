/* ML Academy · ilerleme senkronizasyonu
   ─────────────────────────────────────────────────────────────────────
   Kayıt penceresi, kilit ekranı ve doğrulama e-postaları "ilerlemen
   cihazlar arasında saklanır" diyordu. Kod bunu yapmıyordu: ilerleme
   yalnızca localStorage'a yazılıyor, `progress` tablosuna hiç
   dokunulmuyordu. Bu dosya o sözü tutuyor.

   ── TASARIM KARARI · yerel her zaman birincil ──
   localStorage yazması anında ve her koşulda çalışır; sunucu yazması
   ağa bağlıdır ve başarısız olabilir. Bu yüzden ders akışı hiçbir
   noktada sunucuyu BEKLEMEZ. Yerel kayıt yapılır, sunucuya gönderim
   arka planda olur, hatası yutulur. İnternet giderse ders kesintisiz
   devam eder, ilerleme kaybolmaz, bir sonraki fırsatta yükselir.

   ── BİRLEŞTİRME · kayıp yerine fazlalık ──
   İki cihazda farklı ilerleme varsa hangisi doğru? İkisi de.
   Tamamlanan adımlar BİRLEŞTİRİLİR (birleşim kümesi), XP'de BÜYÜK olan
   alınır. Böylece hiçbir cihazda ilerleme geri gitmez. Ters yaklaşım
   ("son yazan kazanır") telefonda bitirilen dersi bilgisayarda silerdi.

   ── KULLANIM ──
     ILERLEME.kur(sb)                     oturum açılınca çağrılır
     await ILERLEME.indir()               sunucudakini yerelle birleştirir
     ILERLEME.yaz(dersId, {done, xp})     tek dersi arka planda gönderir
     ILERLEME.temizle()                   çıkışta yerel kaydı bırakır      */

const ILERLEME = (() => {
  'use strict';

  const PKEY = 'mlacad_v2';
  let sb = null;
  let kullanici = null;

  const oku = () => { try { return JSON.parse(localStorage.getItem(PKEY)) || {}; } catch(e){ return {}; } };
  const yazYerel = p => { try { localStorage.setItem(PKEY, JSON.stringify(p)); } catch(e){} };

  /* Ders kaydını normale çevir: done her zaman artan sıralı benzersiz
     tamsayı dizisi, xp her zaman negatif olmayan tamsayı. Bozuk veri
     tarayıcıdan gelebilir; sunucuya bozuk satır yazmak istemiyoruz. */
  function duzelt(k){
    const done = Array.isArray(k && k.done) ? k.done : [];
    const temiz = [...new Set(done.map(Number).filter(n => Number.isInteger(n) && n >= 0))]
                    .sort((a,b) => a - b);
    const xp = Math.max(0, Math.floor(Number(k && k.xp) || 0));
    return { done: temiz, xp };
  }

  const birlesim = (a, b) => [...new Set([...a, ...b])].sort((x,y) => x - y);

  function kur(istemci){
    sb = istemci || null;
  }

  function oturum(u){
    kullanici = u || null;
  }

  /* ── sunucudakini indir ve yerelle birleştir ──
     Dönen değer birleştirilmiş ilerlemedir; çağıran onu ekrana
     yansıtabilir. Hata olursa yerel kayıt olduğu gibi döner: senkron
     çalışmadı diye kimse ilerlemesini kaybetmemeli. */
  async function indir(){
    const yerel = oku();
    if (!sb || !kullanici) return yerel;

    let satirlar = null;
    try {
      const { data, error } = await sb.from('progress')
        .select('lesson, done, xp, completed').eq('user_id', kullanici.id);
      if (error) throw error;
      satirlar = data || [];
    } catch (e){
      console.warn('ilerleme indirilemedi', e);
      return yerel;
    }

    const birlesik = {};
    Object.keys(yerel).forEach(id => { birlesik[id] = duzelt(yerel[id]); });

    satirlar.forEach(r => {
      const uzak = duzelt({ done: r.done, xp: r.xp });
      const y = birlesik[r.lesson];
      birlesik[r.lesson] = y
        ? { done: birlesim(y.done, uzak.done), xp: Math.max(y.xp, uzak.xp) }
        : uzak;
    });

    yazYerel(birlesik);

    /* Yerelde olup sunucuda olmayan ya da sunucudakinden ileri olan
       dersleri geri gönder. Böylece hesap açmadan önce yapılan ilerleme
       giriş yapınca hesaba taşınır. */
    const uzakHarita = {};
    satirlar.forEach(r => { uzakHarita[r.lesson] = duzelt({ done: r.done, xp: r.xp }); });
    Object.keys(birlesik).forEach(id => {
      const u = uzakHarita[id];
      const b = birlesik[id];
      const ayni = u && u.xp === b.xp && u.done.length === b.done.length
                     && u.done.every((v,i) => v === b.done[i]);
      if (!ayni) yaz(id, b);
    });

    return birlesik;
  }

  /* ── tek dersi gönder ──
     BEKLENMEZ. Çağıran ders akışını sürdürür; bu istek arka planda
     gider ve başarısız olursa sessizce düşer. Bir sonraki indir()
     çağrısında yerel kayıt zaten sunucuya taşınacak. */
  function yaz(dersId, kayit, toplamAdim){
    if (!sb || !kullanici || !dersId) return;
    const k = duzelt(kayit);
    const bitti = Number.isInteger(toplamAdim) && toplamAdim > 0
                ? k.done.length >= toplamAdim
                : undefined;

    const satir = {
      user_id: kullanici.id,
      lesson:  String(dersId),
      done:    k.done,
      xp:      k.xp,
    };
    if (bitti !== undefined) satir.completed = bitti;

    try {
      Promise.resolve(
        sb.from('progress').upsert(satir, { onConflict: 'user_id,lesson' })
      ).catch(e => console.warn('ilerleme yazılamadı', e));
    } catch (e){ console.warn('ilerleme yazılamadı', e); }
  }

  /* Çıkışta yerel ilerleme SİLİNMEZ. Kullanıcı hesabı olmadan da
     çalışmaya devam edebilmeli; zaten sunucuda bir kopyası var. */
  function temizle(){ kullanici = null; }

  return { kur, oturum, indir, yaz, temizle, oku, PKEY };
})();

if (typeof module !== 'undefined') module.exports = ILERLEME;
