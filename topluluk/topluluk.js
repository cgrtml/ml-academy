/* ML Academy · ana sayfa topluluk bölümü
   Sayaçlar + onaylı yorumlar. Supabase yapılandırılmamışsa bölüm KENDİNİ GİZLER,
   yani bugün siteye eklense hiçbir şey bozulmaz, arka uç hazır olunca açılır.

   Kullanım (index.html içinde, </body> öncesi):
     <script src="topluluk/topluluk.js"></script>
     <script>TOPLULUK.kur({ url:'...', anonKey:'...', dil:DIL });</script>

   Yapılandırma verilmezse hiçbir istek atılmaz.                              */

const TOPLULUK = (() => {

  const M = {
    tr: {
      bas:'Topluluk',
      alt:'Sayılar canlı. Geri bildiriminiz bu kursu şekillendiriyor.',
      kullanici:'kayıtlı kullanıcı', bitiren:'ders bitiren',
      yorum:'yorum', puan:'ortalama puan',
      yorumBas:'Ne diyorlar',
      yokBas:'Henüz yorum yok',
      yokAlt:'İlk yorumu sen yazabilirsin.',
      yaz:'Yorum yaz',
      azBilgi:'Ortalama puan, en az 5 yorum toplanınca gösterilir.',
      bekliyor:'Yorumun alındı, okunduktan sonra yayımlanacak.',
      dagilim:'Puan dağılımı', kisi:'kişi',
      cagriBas:'Burayı canlı tutan şey senin yorumun',
      cagriAlt:'Bir dakikanı alır ve geri dönüşünüz bizim için çok değerli.',
    },
    en: {
      bas:'Community',
      alt:'The numbers are live. Your feedback shapes this course.',
      kullanici:'registered users', bitiren:'finished a lesson',
      yorum:'reviews', puan:'average rating',
      yorumBas:'What people say',
      yokBas:'No reviews yet',
      yokAlt:'You could write the first one.',
      yaz:'Write a review',
      azBilgi:'The average rating appears once at least 5 reviews are in.',
      bekliyor:'Your review was received and will be published after review.',
      dagilim:'Rating breakdown', kisi:'people',
      cagriBas:'Your review is what keeps this alive',
      cagriAlt:'It takes a minute, and your feedback means a great deal to us.',
    },
  };

  let sb = null, t = M.tr;

  /* ── biçimlendirme ── */
  const say = n => (n === null || n === undefined) ? '–' : Number(n).toLocaleString('tr');
  const yildiz = p => '★★★★★'.slice(0, p) + '☆☆☆☆☆'.slice(0, 5 - p);
  const kacir = s => String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

  function stil(){
    if (document.getElementById('toplulukStil')) return;
    const s = document.createElement('style');
    s.id = 'toplulukStil';
    s.textContent = `
      .toplulukB{margin-top:56px}
      .toplulukB > h2{font-size:26px;font-weight:800;letter-spacing:-.02em;margin:0 0 6px}
      .toplulukB > .alt{color:var(--mut,#586a80);font-size:14.5px;margin:0 0 22px}
      .tSayac{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
      .tKart{background:var(--panel,#ffffff);border:1px solid var(--line,#dde5ef);
        border-radius:14px;padding:18px 16px;text-align:center}
      .tKart .n{font-size:29px;font-weight:850;letter-spacing:-.03em;line-height:1.1}
      .tKart .e{font-family:var(--mono,monospace);font-size:10.5px;letter-spacing:.16em;
        text-transform:uppercase;color:var(--mut,#586a80);margin-top:7px}
      .tKart .yld{color:var(--star,#e0930b);font-size:15px;letter-spacing:.14em;margin-top:5px}
      .tNot{color:var(--mut,#586a80);font-size:12.5px;margin-top:10px;text-align:center}
      /* yıldız dağılımı */
      .tDagilim{background:var(--panel,#ffffff);border:1px solid var(--line,#dde5ef);
        border-radius:14px;padding:18px 20px;margin-top:14px}
      .tDagBas{font-family:var(--mono,monospace);font-size:10.5px;letter-spacing:.2em;
        text-transform:uppercase;color:var(--mut,#586a80);margin-bottom:12px}
      .tSatir{display:flex;align-items:center;gap:12px;margin-top:7px}
      .tSatir .p{font-family:var(--mono,monospace);font-size:12px;color:var(--star,#e0930b);
        width:26px;flex:none}
      .tSatir .cubuk{flex:1;height:9px;background:var(--bg,#f6f8fc);border-radius:99px;
        overflow:hidden;border:1px solid var(--line,#dde5ef)}
      .tSatir .cubuk i{display:block;height:100%;background:var(--star,#e0930b);
        border-radius:99px;transition:width .3s}
      .tSatir .n{font-family:var(--mono,monospace);font-size:12px;color:var(--mut,#586a80);
        width:34px;text-align:right;flex:none}
      .tDagAlt{font-family:var(--mono,monospace);font-size:10.5px;color:var(--mut,#586a80);
        text-align:right;margin-top:11px}
      /* yorum yazmaya çağrı */
      .tCagri{display:flex;align-items:center;justify-content:space-between;gap:18px;
        flex-wrap:wrap;margin-top:20px;padding:20px 22px;border-radius:16px;
        background:rgba(34,211,160,.07);border:1px solid rgba(34,211,160,.32)}
      .tCagri b{display:block;font-size:16px;margin-bottom:3px}
      .tCagri span{color:var(--mut,#586a80);font-size:13.5px}
      .tCagri button{padding:12px 22px;border-radius:12px;font-size:14.5px;font-weight:800;
        cursor:pointer;border:0;background:var(--green,#0a8b68);color:var(--anaTxt);
        font-family:inherit;flex:none}
      .tCagri button:hover{filter:brightness(1.08)}
      .tYorumBas{font-family:var(--mono,monospace);font-size:10.5px;letter-spacing:.2em;
        text-transform:uppercase;color:var(--mut,#586a80);margin:30px 0 12px}
      .tYorumlar{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}
      .tYorum{background:var(--panel,#ffffff);border:1px solid var(--line,#dde5ef);
        border-radius:14px;padding:16px 17px}
      .tYorum .ust{display:flex;justify-content:space-between;align-items:center;gap:10px}
      .tYorum .ad{font-weight:700;font-size:14.5px}
      .tYorum .p{color:var(--star,#e0930b);font-size:13.5px;letter-spacing:.12em;flex:none}
      .tYorum p{margin:9px 0 0;color:var(--mut,#586a80);font-size:14px;line-height:1.65}
      .tBos{text-align:center;padding:26px 16px;border:1px dashed var(--line,#dde5ef);
        border-radius:14px;color:var(--mut,#586a80)}
      .tBos b{display:block;color:var(--txt,#0f1b2d);font-size:15px;margin-bottom:4px}
    `;
    document.head.appendChild(s);
  }

  /* ── veri ── */

  async function sayaclar(){
    const { data, error } = await sb.rpc('community_stats');
    if (error) throw error;
    return data;
  }

  async function yorumlar(limit){
    const { data, error } = await sb
      .from('review_public').select('id, display_name, rating, body, approved_at')
      .limit(limit || 6);
    if (error) throw error;
    return data || [];
  }

  /* ── çizim ── */

  /* Yıldız dağılımı. community_stats() bunu zaten döndürüyordu ama hiç
     çizilmiyordu; oysa "kaç kişi 5 yıldız verdi" en çok bakılan sayı. */
  function dagilimHTML(s){
    const h = s.rating_histogram || {};
    const top = [1,2,3,4,5].reduce((a,p) => a + (Number(h[p]) || 0), 0);
    if (!top) return '';
    return `<div class="tDagilim"><div class="tDagBas">${t.dagilim}</div>` +
      [5,4,3,2,1].map(p => {
        const n = Number(h[p]) || 0, y = top ? (100*n/top) : 0;
        return `<div class="tSatir">
          <span class="p">${p}★</span>
          <span class="cubuk"><i style="width:${y.toFixed(1)}%"></i></span>
          <span class="n">${n}</span></div>`;
      }).join('') +
      `<div class="tDagAlt">${top} ${t.kisi}</div></div>`;
  }

  function ciz(hedef, s, y){
    stil();
    const kartlar = [
      { n: say(s.users),            e: t.kullanici },
      { n: say(s.lesson_finishers), e: t.bitiren },
      { n: say(s.reviews),          e: t.yorum },
      { n: s.avg_rating ? Number(s.avg_rating).toFixed(1) : '–',
        e: t.puan,
        yld: s.avg_rating ? yildiz(Math.round(s.avg_rating)) : '' },
    ];

    const yorumHTML = y.length
      ? `<div class="tYorumlar">${y.map(r => `<div class="tYorum">
           <div class="ust"><span class="ad">${kacir(r.display_name)}</span>
             <span class="p">${yildiz(r.rating)}</span></div>
           ${r.body ? `<p>${kacir(r.body)}</p>` : ''}
         </div>`).join('')}</div>`
      : `<div class="tBos"><b>${t.yokBas}</b>${t.yokAlt}</div>`;

    hedef.innerHTML = `
      <h2>${t.bas}</h2>
      <p class="alt">${t.alt}</p>
      <div class="tSayac">${kartlar.map(k => `<div class="tKart">
        <div class="n">${k.n}</div>${k.yld ? `<div class="yld">${k.yld}</div>` : ''}
        <div class="e">${k.e}</div></div>`).join('')}</div>
      ${(s.reviews || 0) < 5 ? `<div class="tNot">${t.azBilgi}</div>` : ''}
      ${dagilimHTML(s)}
      <div class="tYorumBas">${t.yorumBas}</div>
      ${yorumHTML}
      <div class="tCagri">
        <div><b>${t.cagriBas}</b><span>${t.cagriAlt}</span></div>
        <button id="tYaz">${t.yaz}</button>
      </div>`;
    /* Düğme: giriş varsa yorum ekranı, yoksa önce giriş. */
    const dug = hedef.querySelector('#tYaz');
    if (dug) dug.onclick = () => {
      if (typeof HESAP === 'undefined') return;
      if (HESAP.girisli) HESAP.yorumEkrani(); else HESAP.girisEkrani(true);
    };
    hedef.style.display = '';
  }

  /* ── giriş noktası ── */

  async function kur(o){
    o = o || {};
    t = M[o.dil === 'en' ? 'en' : 'tr'];
    const hedef = document.getElementById(o.hedef || 'topluluk');
    if (!hedef) return;

    /* Bölüm YALNIZCA ilk kurulumda gizleniyor. Eskiden her tazelemede
       önce display:none yapılıp veri beklendiği için bölüm gözle görülür
       biçimde kırpışıyordu. Bir kez çizildikten sonra eski içerik yerinde
       kalıyor, yenisi gelince sessizce değişiyor. */
    if (!hedef.dataset.kuruldu) hedef.style.display = 'none';

    if (!o.url || !o.anonKey || typeof window.supabase === 'undefined'){
      console.info('topluluk: supabase yapılandırılmadı, bölüm gizli');
      return;
    }

    /* Kendi istemcisini yaratmıyor: sayfada tek istemci olmalı, yoksa iki
       istemci birbirine kimlik olayı yayıp sonsuz tazeleme döngüsü kuruyor.
       Ayrıntı yapilandirma.js içindeki SUPA.istemci notunda. */
    sb = (typeof SUPA !== 'undefined' && SUPA.istemci)
       ? SUPA.istemci()
       : window.supabase.createClient(o.url, o.anonKey);
    if (!sb) return;
    try {
      const [s, y] = await Promise.all([sayaclar(), yorumlar(o.limit)]);
      ciz(hedef, s || {}, y);
      hedef.dataset.kuruldu = '1';
    } catch (e) {
      console.warn('topluluk verisi alınamadı', e);   // hata olursa bölüm gizli kalır
    }
  }

  return { kur, yildiz, M };
})();

if (typeof module !== 'undefined') module.exports = TOPLULUK;
