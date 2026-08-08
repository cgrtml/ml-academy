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
      alt:'Sayılar canlı, yorumlar okunduktan sonra yayımlanıyor.',
      kullanici:'kayıtlı kullanıcı', bitiren:'ders bitiren',
      yorum:'yorum', puan:'ortalama puan',
      yorumBas:'Ne diyorlar',
      yokBas:'Henüz yorum yok',
      yokAlt:'İlk yorumu sen yazabilirsin.',
      yaz:'Yorum yaz',
      azBilgi:'Ortalama puan, en az 5 yorum toplanınca gösterilir.',
      bekliyor:'Yorumun alındı, okunduktan sonra yayımlanacak.',
    },
    en: {
      bas:'Community',
      alt:'The numbers are live; reviews are published after being read.',
      kullanici:'registered users', bitiren:'finished a lesson',
      yorum:'reviews', puan:'average rating',
      yorumBas:'What people say',
      yokBas:'No reviews yet',
      yokAlt:'You could write the first one.',
      yaz:'Write a review',
      azBilgi:'The average rating appears once at least 5 reviews are in.',
      bekliyor:'Your review was received and will be published after review.',
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
      .toplulukB > .alt{color:var(--mut,#8494a8);font-size:14.5px;margin:0 0 22px}
      .tSayac{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:12px}
      .tKart{background:var(--panel,#0f151e);border:1px solid var(--line,#1e2a3a);
        border-radius:14px;padding:18px 16px;text-align:center}
      .tKart .n{font-size:29px;font-weight:850;letter-spacing:-.03em;line-height:1.1}
      .tKart .e{font-family:var(--mono,monospace);font-size:10.5px;letter-spacing:.16em;
        text-transform:uppercase;color:var(--mut,#8494a8);margin-top:7px}
      .tKart .yld{color:var(--yellow,#facc15);font-size:15px;letter-spacing:.14em;margin-top:5px}
      .tNot{color:var(--mut,#8494a8);font-size:12.5px;margin-top:10px;text-align:center}
      .tYorumBas{font-family:var(--mono,monospace);font-size:10.5px;letter-spacing:.2em;
        text-transform:uppercase;color:var(--mut,#8494a8);margin:30px 0 12px}
      .tYorumlar{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:12px}
      .tYorum{background:var(--panel,#0f151e);border:1px solid var(--line,#1e2a3a);
        border-radius:14px;padding:16px 17px}
      .tYorum .ust{display:flex;justify-content:space-between;align-items:center;gap:10px}
      .tYorum .ad{font-weight:700;font-size:14.5px}
      .tYorum .p{color:var(--yellow,#facc15);font-size:13.5px;letter-spacing:.12em;flex:none}
      .tYorum p{margin:9px 0 0;color:var(--mut,#8494a8);font-size:14px;line-height:1.65}
      .tBos{text-align:center;padding:26px 16px;border:1px dashed var(--line,#1e2a3a);
        border-radius:14px;color:var(--mut,#8494a8)}
      .tBos b{display:block;color:var(--txt,#e6edf3);font-size:15px;margin-bottom:4px}
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
      <div class="tYorumBas">${t.yorumBas}</div>
      ${yorumHTML}`;
    hedef.style.display = '';
  }

  /* ── giriş noktası ── */

  async function kur(o){
    o = o || {};
    t = M[o.dil === 'en' ? 'en' : 'tr'];
    const hedef = document.getElementById(o.hedef || 'topluluk');
    if (!hedef) return;
    hedef.style.display = 'none';           // arka uç yoksa görünmez kalır

    if (!o.url || !o.anonKey || typeof window.supabase === 'undefined'){
      console.info('topluluk: supabase yapılandırılmadı, bölüm gizli');
      return;
    }
    sb = window.supabase.createClient(o.url, o.anonKey);
    try {
      const [s, y] = await Promise.all([sayaclar(), yorumlar(o.limit)]);
      ciz(hedef, s || {}, y);
    } catch (e) {
      console.warn('topluluk verisi alınamadı', e);   // hata olursa bölüm gizli kalır
    }
  }

  return { kur, yildiz, M };
})();

if (typeof module !== 'undefined') module.exports = TOPLULUK;
