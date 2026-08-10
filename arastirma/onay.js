/* ML Academy · araştırma rızası ekranı
   Kayıt tamamlandıktan sonra bir kez gösterilir. Kapatılabilir ve site
   hiçbir şey kaybetmeden çalışmaya devam eder.

   Kullanım:
     ONAY.gerekli(sb, kullaniciId)      -> Promise<boolean>  (gösterilmeli mi)
     ONAY.goster(sb, kullaniciId, dil)  -> Promise<void>
     ONAY.durum(sb, kullaniciId)        -> Promise<{telemetry, learning_profile, contact}>

   sb: supabase istemcisi. Bağımlılık dışarıdan verilir ki bu dosya
   tek başına test edilebilsin.                                            */

const ONAY = (() => {

  const SURUM = '2026-08-09.1';
  const AMACLAR = ['telemetry', 'learning_profile', 'contact'];

  /* ── metinler ── */
  const M = {
    tr: {
      bas:'Bir isteğimiz var',
      giris:'ML Academy\'yi insanların makine öğrenmesini nasıl öğrendiğini anlamak için de '+
            'kullanıyoruz. Bu bir araştırma çalışması ve katılman tamamen sana bağlı.',
      vurgu:'Katılmazsan hiçbir şey değişmez. Bütün dersler, bütün widget\'lar ve ilerleme '+
            'kaydın aynı şekilde çalışır. Üç anahtarı da kapalı bırakabilirsin.',
      kalem:{
        telemetry:{
          ad:'Ders davranışımı kaydedin',
          ne:'Hangi şıkkı işaretlediğin, bir adımda ne kadar kaldığın, kaç kez denediğin, '+
             'kaydırıcıları oynatıp oynatmadığın, konu anlatımını açıp açmadığın.',
          nicin:'Hangi soruların bozuk olduğunu bulmak ve dersleri düzeltmek için.',
        },
        learning_profile:{
          ad:'Bir öğrenme davranışı profili çıkarın',
          ne:'Yukarıdaki kayıtlardan davranış örüntülerin tahmin edilir: widget\'ı oynatmadan '+
             'cevaplama eğilimi, yanlıştan sonra tekrar deneme sıklığı, hangi kavramlarda takıldığın.',
          nicin:'Sana kendi öğrenme raporunu göstermek ve sıradaki dersi önerebilmek için.',
          uyari:'Bunların hepsi çıkarımdır, ölçüm değil. Yanılabilir. Kişilik, karakter, zekâ '+
                'ya da duygu değerlendirmesi yapılmaz.',
        },
        contact:{
          ad:'Sonuçlar için benimle iletişime geçin',
          ne:'Çalışmanın sonucunu ya da kısa bir anketi e-postayla göndeririz.',
          nicin:'Reklam gönderilmez.',
        },
      },
      bilgiBas:'Bilmen gerekenler',
      bilgi:[
        'Veriler takma adla saklanır; analizde adın ve e-postan görünmez.',
        'Yayınlanan sonuçlarda tek bir kişi tanınamaz, yalnızca toplu sayılar paylaşılır.',
        'Anahtarı kapattığın anda kayıtların silinir.',
        'Saklama süresi en fazla 24 ay.',
        'Bu ayarları hesap ayarlarından her zaman değiştirebilirsin.',
      ],
      sonra:'Şimdi değil',
      kaydet:'Seçimimi kaydet',
      detay:'ayrıntılı metni oku',
    },
    en: {
      bas:'One request',
      giris:'We also use ML Academy to understand how people learn machine learning. '+
            'This is a research study and taking part is entirely up to you.',
      vurgu:'Nothing changes if you decline. Every lesson, every widget and your progress '+
            'work exactly the same. You can leave all three switches off.',
      kalem:{
        telemetry:{
          ad:'Record my lesson behaviour',
          ne:'Which option you select, how long you stay on a step, how many attempts you '+
             'make, whether you move the sliders, whether you open the explanation.',
          nicin:'To find which questions are broken and fix the lessons.',
        },
        learning_profile:{
          ad:'Build a learning-behaviour profile',
          ne:'Your behaviour patterns are estimated from the records above: a tendency to '+
             'answer before playing with the widget, how often you retry, where you get stuck.',
          nicin:'To show you your own learning report and suggest the next lesson.',
          uyari:'All of these are inferences, not measurements. They can be wrong. No assessment '+
                'of personality, character, intelligence or emotion is made.',
        },
        contact:{
          ad:'Contact me about the results',
          ne:'We email you the outcome of the study or a short survey.',
          nicin:'No marketing.',
        },
      },
      bilgiBas:'What you should know',
      bilgi:[
        'Data is stored under a pseudonym; your name and email are not visible during analysis.',
        'No published result can identify a single person, only aggregate numbers are shared.',
        'Turning a switch off deletes your records.',
        'Retention is at most 24 months.',
        'You can change these settings at any time in your account settings.',
      ],
      sonra:'Not now',
      kaydet:'Save my choices',
      detay:'read the full text',
    },
  };

  /* ── rıza durumu ── */

  async function durum(sb, uid){
    const bos = { telemetry:false, learning_profile:false, contact:false };
    if (!sb || !uid) return bos;
    const { data, error } = await sb
      .from('consent_current').select('purpose, granted, text_version').eq('user_id', uid);
    if (error || !data) return bos;
    const o = { ...bos };
    data.forEach(r => {
      /* metin değiştiyse eski rıza geçerli değildir */
      if (r.text_version === SURUM) o[r.purpose] = !!r.granted;
    });
    return o;
  }

  /* ══ AB / EEA AYRIMI ══
     Karar: AB'deki kullanıcılar siteye girer ve tüm dersleri tamamlar, ama
     onlardan ARAŞTIRMA VERİSİ TOPLANMAZ. Bunu yalnızca rıza metnine yazmak
     yetmez; burada koda bağlanıyor. Bölge AB ise:
       · rıza ekranı hiç gösterilmez
       · `event` tablosuna tek satır yazılmaz
     Hesap ve ilerleme verisi işlenmeye devam eder ve o veri için GDPR
     yükümlülükleri geçerlidir. Ayrıntı: arastirma/onay-metni.md

     Tespit saat dilimine bakar ve KESİN DEĞİLDİR: VPN ya da yanlış ayarlanmış
     bir cihaz yanıltabilir. Bu yüzden yanlış taraf hangisiyse ona düşülür:
     şüphede kalırsak AB varsayıp veri toplamayız. */
  const AB_BOLGE = [
    'Europe/', 'Atlantic/Azores', 'Atlantic/Madeira', 'Atlantic/Canary',
    'Atlantic/Reykjavik',
  ];
  /* AB/EEA dışında kalan Avrupa saat dilimleri: bunlar AB sayılmaz */
  const AB_DISI = [
    'Europe/Istanbul', 'Europe/Moscow', 'Europe/Kaliningrad', 'Europe/Samara',
    'Europe/Volgograd', 'Europe/Saratov', 'Europe/Ulyanovsk', 'Europe/Astrakhan',
    'Europe/Kirov', 'Europe/Minsk', 'Europe/Kiev', 'Europe/Kyiv',
    'Europe/Uzhgorod', 'Europe/Zaporozhye', 'Europe/Simferopol',
    'Europe/London', 'Europe/Belfast', 'Europe/Jersey', 'Europe/Guernsey',
    'Europe/Isle_of_Man', 'Europe/Gibraltar', 'Europe/Zurich', 'Europe/Vaduz',
    'Europe/Belgrade', 'Europe/Sarajevo', 'Europe/Skopje', 'Europe/Podgorica',
    'Europe/Tirane', 'Europe/Chisinau', 'Europe/Andorra', 'Europe/Monaco',
    'Europe/San_Marino', 'Europe/Vatican',
  ];
  function abBolgesinde(){
    let tz = '';
    try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || ''; }
    catch (e) { return false; }        // tespit edemiyorsak AB saymayız
    if (!tz) return false;
    if (AB_DISI.indexOf(tz) >= 0) return false;
    return AB_BOLGE.some(p => tz.indexOf(p) === 0);
  }
  /* Araştırma verisi toplanabilir mi. Telemetri yazan her yer bunu sormalı. */
  function bolgeUygun(){ return !abBolgesinde(); }

  /* Ekran yalnızca hiç cevap verilmemişse gösterilir. "Şimdi değil" de bir
     cevaptır: üç amaç için de false yazılır, böylece tekrar tekrar sorulmaz. */
  async function gerekli(sb, uid){
    if (!sb || !uid) return false;
    if (!bolgeUygun()) return false;          // AB: ekran hiç gösterilmez
    const { data, error } = await sb
      .from('consent').select('id').eq('user_id', uid).eq('text_version', SURUM).limit(1);
    if (error) return false;
    return !data || data.length === 0;
  }

  async function yaz(sb, uid, secim, kaynak){
    /* AB'de rıza ekranı zaten gösterilmiyor; bu bir güvenlik ağı. */
    if (!bolgeUygun()) return;
    const satirlar = AMACLAR.map(a => ({
      user_id: uid, purpose: a, granted: !!secim[a],
      text_version: SURUM, source: kaynak || 'after_signup',
    }));
    const { error } = await sb.from('consent').insert(satirlar);
    if (error) throw error;
  }

  /* ── ekran ── */

  function stil(){
    if (document.getElementById('onayStil')) return;
    const s = document.createElement('style');
    s.id = 'onayStil';
    s.textContent = `
      .onayArka{position:fixed;inset:0;background:rgba(4,7,12,.86);z-index:9000;
        display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto}
      .onayKart{background:var(--panel,#0f151e);border:1px solid var(--line,#1e2a3a);
        border-radius:18px;max-width:640px;width:100%;padding:30px 30px 24px;
        font-size:15px;line-height:1.68;color:var(--txt,#e6edf3);margin:auto}
      .onayKart h2{margin:0 0 14px;font-size:23px;font-weight:800;letter-spacing:-.02em}
      .onayKart .giris{color:var(--mut,#8494a8);margin:0 0 14px}
      .onayKart .vurgu{background:rgba(34,211,160,.08);border-left:3px solid var(--green,#22d3a0);
        padding:11px 14px;border-radius:0 9px 9px 0;color:var(--txt,#e6edf3);
        font-size:14px;margin:0 0 22px}
      .onayKalem{border:1px solid var(--line,#1e2a3a);border-radius:13px;
        padding:14px 16px;margin-bottom:12px;background:rgba(255,255,255,.02)}
      .onayKalem.acik{border-color:var(--green,#22d3a0);background:rgba(34,211,160,.06)}
      .onayUst{display:flex;align-items:flex-start;gap:12px;cursor:pointer}
      .onayUst input{margin-top:4px;width:17px;height:17px;accent-color:var(--green,#22d3a0);
        flex:none;cursor:pointer}
      .onayAd{font-weight:700;font-size:15px}
      .onayNe{color:var(--mut,#8494a8);font-size:13.5px;margin:7px 0 0}
      .onayNicin{color:var(--mut,#8494a8);font-size:13.5px;margin:5px 0 0;font-style:italic}
      .onayUyari{color:var(--yellow,#facc15);font-size:13px;margin:9px 0 0;
        border-top:1px solid rgba(250,204,21,.22);padding-top:8px}
      .onayBilgi{margin:20px 0 0;padding:14px 16px;border-radius:12px;
        background:rgba(255,255,255,.02);border:1px solid var(--line,#1e2a3a)}
      .onayBilgi b{font-family:var(--mono,monospace);font-size:10.5px;letter-spacing:.2em;
        text-transform:uppercase;color:var(--mut,#8494a8);display:block;margin-bottom:9px}
      .onayBilgi ul{margin:0;padding-left:19px;color:var(--mut,#8494a8);font-size:13px;line-height:1.85}
      .onayDug{display:flex;gap:12px;margin-top:22px}
      /* İki düğme aynı ağırlıkta. Reddetmeyi zorlaştıran tasarım kullanılmıyor. */
      .onayDug button{flex:1;padding:13px 18px;border-radius:11px;font-size:14.5px;
        font-weight:700;cursor:pointer;border:1px solid var(--line,#1e2a3a);
        background:var(--panel2,#141c28);color:var(--txt,#e6edf3);font-family:inherit}
      .onayDug button:hover{border-color:var(--mut,#8494a8)}
      .onayDug button.ana{background:var(--green,#22d3a0);border-color:var(--green,#22d3a0);color:#04120d}
      .onayDetay{display:block;text-align:center;margin-top:13px;font-size:12.5px;
        color:var(--blue,#4cc4ff);text-decoration:none}
    `;
    document.head.appendChild(s);
  }

  function goster(sb, uid, dil){
    stil();
    const t = M[dil === 'en' ? 'en' : 'tr'];
    return new Promise(cozum => {
      const arka = document.createElement('div');
      arka.className = 'onayArka';
      arka.setAttribute('role','dialog');
      arka.setAttribute('aria-modal','true');

      const kalemHTML = AMACLAR.map(a => {
        const k = t.kalem[a];
        return `<div class="onayKalem" data-k="${a}">
          <label class="onayUst">
            <input type="checkbox" data-amac="${a}">
            <span class="onayAd">${k.ad}</span>
          </label>
          <p class="onayNe">${k.ne}</p>
          <p class="onayNicin">${k.nicin}</p>
          ${k.uyari ? `<p class="onayUyari">${k.uyari}</p>` : ''}
        </div>`;
      }).join('');

      arka.innerHTML = `<div class="onayKart">
        <h2>${t.bas}</h2>
        <p class="giris">${t.giris}</p>
        <p class="vurgu">${t.vurgu}</p>
        ${kalemHTML}
        <div class="onayBilgi"><b>${t.bilgiBas}</b><ul>${
          t.bilgi.map(x => '<li>'+x+'</li>').join('')}</ul></div>
        <div class="onayDug">
          <button id="onaySonra">${t.sonra}</button>
          <button id="onayKaydet" class="ana">${t.kaydet}</button>
        </div>
        <a class="onayDetay" href="arastirma/onay-metni.md" target="_blank" rel="noopener">${t.detay}</a>
      </div>`;

      document.body.appendChild(arka);

      arka.querySelectorAll('input[data-amac]').forEach(g => {
        g.addEventListener('change', () =>
          g.closest('.onayKalem').classList.toggle('acik', g.checked));
      });

      const bitir = async secim => {
        try { await yaz(sb, uid, secim, 'after_signup'); }
        catch (e) { console.warn('rıza yazılamadı', e); }
        arka.remove();
        cozum(secim);
      };

      /* "Şimdi değil" de kayda geçer: üçü de reddedilmiş sayılır. */
      arka.querySelector('#onaySonra').onclick = () =>
        bitir({ telemetry:false, learning_profile:false, contact:false });

      arka.querySelector('#onayKaydet').onclick = () => {
        const s = {};
        AMACLAR.forEach(a => { s[a] = arka.querySelector('[data-amac="'+a+'"]').checked; });
        bitir(s);
      };
    });
  }

  return { SURUM, AMACLAR, durum, gerekli, goster, yaz, bolgeUygun, abBolgesinde };
})();

if (typeof module !== 'undefined') module.exports = ONAY;
