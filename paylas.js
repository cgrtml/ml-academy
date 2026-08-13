/* ML Academy · paylaş düğmesi
   ─────────────────────────────────────────────────────────────────────
   Düğmeye basınca uygulama listesi açılır: Instagram, X, WhatsApp,
   LinkedIn, bağlantıyı kopyala. Cihazın kendi paylaş menüsü varsa
   listenin altına "diğer uygulamalar" olarak eklenir.

   X, WhatsApp ve LinkedIn'in "şu adresi paylaş" adresleri var, tıklayınca
   hazır gönderi açılıyor. Önizleme kartını og:image'dan kendileri çekiyor.

   INSTAGRAM FARKLI. Instagram'ın webden link paylaşmaya yarayan bir
   adresi hiç olmadı; twitter.com/intent gibi bir karşılığı yok ve
   gönderiye tıklanabilir link de koyulamıyor. Instagram'da iş gören tek
   yol story: görsel + link etiketi. O yüzden burada Instagram'a basınca
     1) 1080x1920 story görseli TARAYICIDA çiziliyor,
     2) navigator.share dosya kabul ediyorsa (telefon) cihazın paylaş
        menüsü görselle birlikte açılıyor, kullanıcı Instagram'ı seçip
        story'ye koyuyor, adres de metinde gidiyor,
     3) kabul etmiyorsa (masaüstü) görsel indiriliyor ve adres panoya
        kopyalanıyor, kullanıcı telefonundan yüklüyor.

   Görsel gorsel/kart.html ile aynı tasarım, ama burada canvas'a çiziliyor
   çünkü paylaşılabilir bir dosya gerekiyor. İkisi değişirse ikisi de
   değişmeli.
   ───────────────────────────────────────────────────────────────────── */
var PAYLAS = (function(){

  const SVG = {
    ig:'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" fill-rule="evenodd" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.72 3.72 0 0 1-1.38-.9c-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41 1.27-.06 1.65-.07 4.85-.07ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.9 5.9 0 0 0 .63 4.14c-.3.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84a6.16 6.16 0 1 0 0 12.32 6.16 6.16 0 0 0 0-12.32ZM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z"/></svg>',
    x:'<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.96 6.82H1.67l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z"/></svg>',
    wa:'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.38-1.99-1.23-.74-.65-1.24-1.46-1.38-1.71-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.21.89 2.39 1.01 2.55.12.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z"/></svg>',
    li:'<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z"/></svg>',
    lnk:'<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
    art:'<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
    pay:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M12 16V3"/><path d="m8 7 4-4 4 4"/></svg>',
  };

  const SOZ = {
    dugme:    ['Paylaş','Share'],
    baslik:   ['Nerede paylaşalım','Share to'],
    hikaye:   ['story görseli + link','story image + link'],
    kopyala:  ['Bağlantıyı kopyala','Copy link'],
    kopyandi: ['Kopyalandı','Copied'],
    diger:    ['Diğer uygulamalar','Other apps'],
    hazirla:  ['Görsel hazırlanıyor…','Preparing image…'],
    indi:     ['Görsel indi, bağlantı kopyalandı','Image saved, link copied'],
    indiNot:  ['Instagram uygulamasından story olarak yükle, link etiketini ekle.',
               'Upload it as a story from the Instagram app and add the link sticker.'],
    olmadi:   ['Görsel hazırlanamadı','Could not prepare the image'],
  };

  /* ═══════════ story görseli ═══════════
     gorsel/kart.html'deki "hikaye" kartının canvas karşılığı. Oradaki
     tasarım değişirse burası da değişmeli. */
  const K = { zemin:'#070a0f', yesil:'#22d3a0', beyaz:'#ffffff',
              gri:'#8fa1b6', silik:'#5d7089', kutu:'rgba(34,211,160,.07)' };
  const SANS = '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif';
  const MONO = '"SF Mono",Menlo,Consolas,ui-monospace,monospace';

  /* Metni verilen genişliğe böler. *yıldız arası* vurgu rengiyle çizilir,
     o yüzden sarma kelime kelime ve renk bayrağıyla yapılıyor. */
  function parcala(metin){
    const p = []; let vurgu = false;
    String(metin).split('*').forEach((k, i) => {
      if (i) vurgu = !vurgu;
      k.split(/\s+/).filter(Boolean).forEach(w => p.push({ w, vurgu }));
    });
    return p;
  }
  function sar(cx, parcalar, enGenis){
    const satir = [[]]; let g = 0;
    const bosluk = cx.measureText(' ').width;
    parcalar.forEach(p => {
      const w = cx.measureText(p.w).width;
      const ek = satir[satir.length-1].length ? bosluk + w : w;
      if (g + ek > enGenis && satir[satir.length-1].length){ satir.push([p]); g = w; }
      else { satir[satir.length-1].push(p); g += ek; }
    });
    return satir;
  }
  function satirCiz(cx, satir, x, y, renk, vurguRenk){
    const bosluk = cx.measureText(' ').width;
    let cx0 = x;
    satir.forEach((p, i) => {
      if (i) cx0 += bosluk;
      cx.fillStyle = p.vurgu ? vurguRenk : renk;
      cx.fillText(p.w, cx0, y);
      cx0 += cx.measureText(p.w).width;
    });
  }

  function hikayeCiz(h){
    const W = 1080, H = 1920, M = 84, IC = W - M*2;
    const c = document.createElement('canvas');
    c.width = W; c.height = H;
    const cx = c.getContext('2d');
    cx.fillStyle = K.zemin; cx.fillRect(0,0,W,H);
    cx.textBaseline = 'alphabetic';

    /* Instagram üstte profil çubuğunu, altta yanıt çubuğunu bindiriyor;
       güvenli bant kabaca 300 ile 1670 arası, ortası 985. İçerik buradan
       başlayınca yığının ortası o bandın ortasına denk geliyor. İlk
       denemede 430'dan başlıyordu ve altta 600 piksel boşluk kalıyordu. */
    let y = 520;

    cx.font = '700 24px ' + MONO;
    cx.fillStyle = K.yesil;
    cx.letterSpacing = '7px';
    cx.fillText('ML ACADEMY', M, y);
    cx.letterSpacing = '0px';
    y += 112;

    cx.font = '850 94px ' + SANS;
    sar(cx, parcala(h.bas), IC).forEach(s => { satirCiz(cx, s, M, y, K.beyaz, K.yesil); y += 104; });

    y += 30;
    cx.font = '400 35px ' + SANS;
    sar(cx, parcala(h.alt), IC).forEach(s => { satirCiz(cx, s, M, y, K.gri, K.gri); y += 52; });

    if (h.sayilar && h.sayilar.length){
      y += 76;
      let x = M;
      h.sayilar.forEach(([n, l]) => {
        cx.font = '800 64px ' + SANS;
        const gn = cx.measureText(n).width;
        cx.font = '700 18px ' + MONO;
        cx.letterSpacing = '3px';
        const gl = cx.measureText(l.toUpperCase()).width;
        cx.letterSpacing = '0px';
        const g = Math.max(gn, gl);
        if (x + g > W - M){ x = M; y += 128; }
        cx.font = '800 64px ' + SANS; cx.fillStyle = K.beyaz;
        cx.fillText(n, x, y);
        cx.font = '700 18px ' + MONO; cx.fillStyle = K.silik;
        cx.letterSpacing = '3px';
        cx.fillText(l.toUpperCase(), x, y + 30);
        cx.letterSpacing = '0px';
        x += g + 72;
      });
      y += 30;
    }

    if (h.kural){
      y += 96;
      cx.font = '400 31px ' + SANS;
      const sat = sar(cx, parcala(h.kural), IC - 76);
      const yuk = sat.length*46 + 60;
      cx.fillStyle = K.kutu; cx.fillRect(M, y - 46, IC, yuk);
      cx.fillStyle = K.yesil; cx.fillRect(M, y - 46, 5, yuk);
      let yy = y + 4;
      sat.forEach(s => { satirCiz(cx, s, M + 38, yy, '#c9d6e4', K.beyaz); yy += 46; });
      y = y - 46 + yuk;
    }

    y += 92;
    cx.font = '400 34px ' + MONO; cx.fillStyle = K.gri;
    cx.fillText('mltraining.org', M, y);

    ['#22d3a0','#4cc4ff','#fb923c','#a78bfa','#f472b6'].forEach((r,i) => {
      cx.fillStyle = r; cx.fillRect(i*(W/5), H-16, W/5+1, 16);
    });

    return new Promise(res => c.toBlob(res, 'image/png'));
  }

  /* ═══════════ menü ═══════════ */
  let acikMenu = null;

  function stil(){
    if (document.getElementById('paylasStil')) return;
    const s = document.createElement('style');
    s.id = 'paylasStil';
    s.textContent = [
      '.pyDug{display:inline-flex;align-items:center;gap:7px;height:30px;padding:0 11px;',
        'border-radius:9px;border:1px solid var(--line);background:var(--panel);',
        'color:var(--mut);font:inherit;font-size:13px;cursor:pointer;line-height:1}',
      '.pyDug:hover{color:var(--txt);border-color:var(--mut)}',
      '.pySar{position:relative;display:inline-flex}',
      '.pyMenu{position:absolute;top:calc(100% + 8px);right:0;z-index:9000;min-width:264px;',
        'background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:8px;',
        'box-shadow:0 18px 44px rgba(0,0,0,.28)}',
      '.pyMenu h4{margin:6px 8px 8px;font-size:11px;letter-spacing:.16em;text-transform:uppercase;',
        'color:var(--mut);font-weight:700;font-family:var(--mono,ui-monospace,monospace)}',
      '.pyMenu a,.pyMenu button.pySec{display:flex;align-items:center;gap:11px;width:100%;',
        'padding:9px 10px;border-radius:9px;border:0;background:none;color:var(--txt);',
        'font:inherit;font-size:14px;text-align:left;cursor:pointer;text-decoration:none}',
      '.pyMenu a:hover,.pyMenu button.pySec:hover{background:var(--panel2)}',
      '.pyMenu .pyIk{display:flex;width:20px;justify-content:center;color:var(--mut);flex:0 0 20px}',
      '.pyMenu a:hover .pyIk,.pyMenu button.pySec:hover .pyIk{color:var(--txt)}',
      '.pyAlt{display:block;font-size:11.5px;color:var(--mut);margin-top:1px}',
      '.pyAyrac{height:1px;background:var(--line);margin:7px 8px}',
      '.pyOk{color:var(--green)}',
      '.pyNot{margin:6px 10px 4px;font-size:12px;line-height:1.5;color:var(--mut)}',
      /* Dar ekran kuralı BURADA DEĞİL: medya sorgusuyla konumlandırınca
         menü kendi kendini ekran dışına itiyordu ve JS'teki düzeltmeyi de
         transform ile eziyordu. Konum tamamen menuAc() içinde ölçülerek
         belirleniyor, tek yerden. */
    ].join('');
    document.head.appendChild(s);
  }

  function kapat(){
    if (!acikMenu) return;
    acikMenu.remove(); acikMenu = null;
    document.removeEventListener('click', disariTikla, true);
    document.removeEventListener('keydown', escBas, true);
  }
  function disariTikla(e){ if (acikMenu && !acikMenu.parentNode.contains(e.target)) kapat(); }
  function escBas(e){ if (e.key === 'Escape') kapat(); }

  async function panoyaYaz(metin){
    try { await navigator.clipboard.writeText(metin); return true; }
    catch(e){
      try {
        const t = document.createElement('textarea');
        t.value = metin; t.setAttribute('readonly','');
        t.style.cssText = 'position:fixed;top:-9999px';
        document.body.appendChild(t); t.select();
        const ok = document.execCommand('copy');
        document.body.removeChild(t);
        return ok;
      } catch(e2){ return false; }
    }
  }

  async function instagramAkisi(dug, o, T){
    const eski = dug.innerHTML;
    dug.innerHTML = '<span class="pyIk">' + SVG.ig + '</span>' + T('hazirla');
    let blob;
    try { blob = await hikayeCiz(o.hikaye); } catch(e){ blob = null; }
    if (!blob){ dug.innerHTML = '<span class="pyIk">' + SVG.ig + '</span>' + T('olmadi'); return; }

    const dosya = new File([blob], 'ml-academy-story.png', { type:'image/png' });
    /* Telefon: paylaş menüsü dosya kabul ediyorsa Instagram orada çıkar
       ve görsel doğrudan story'ye gider. */
    if (navigator.canShare && navigator.canShare({ files:[dosya] })){
      try {
        await navigator.share({ files:[dosya], text:o.metin + ' ' + o.url });
        kapat(); return;
      } catch(err){
        if (err && err.name === 'AbortError'){ dug.innerHTML = eski; return; }
      }
    }
    /* Masaüstü: indir + adresi panoya koy. */
    const u = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = u; a.download = 'ml-academy-story.png';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(u), 4000);
    await panoyaYaz(o.url);
    dug.innerHTML = '<span class="pyIk pyOk">✓</span>' + T('indi');
    const not = document.createElement('p');
    not.className = 'pyNot';
    not.textContent = T('indiNot');
    dug.parentNode.insertBefore(not, dug.nextSibling);
  }

  function menuAc(sar, o, T){
    kapat();
    const u = encodeURIComponent(o.url);
    const m = encodeURIComponent(o.metin);
    const satir = (ad, ik, href, alt) =>
      '<a href="' + href + '" target="_blank" rel="noopener noreferrer">' +
      '<span class="pyIk">' + ik + '</span><span>' + ad +
      (alt ? '<span class="pyAlt">' + alt + '</span>' : '') + '</span></a>';

    const el = document.createElement('div');
    el.className = 'pyMenu';
    el.innerHTML =
      '<h4>' + T('baslik') + '</h4>' +
      '<button class="pySec" id="pyIg"><span class="pyIk">' + SVG.ig + '</span>' +
        '<span>Instagram<span class="pyAlt">' + T('hikaye') + '</span></span></button>' +
      satir('X',        SVG.x,  'https://twitter.com/intent/tweet?text=' + m + '&url=' + u) +
      satir('WhatsApp', SVG.wa, 'https://api.whatsapp.com/send?text=' + m + '%20' + u) +
      satir('LinkedIn', SVG.li, 'https://www.linkedin.com/sharing/share-offsite/?url=' + u) +
      '<div class="pyAyrac"></div>' +
      '<button class="pySec" id="pyKopya"><span class="pyIk">' + SVG.lnk + '</span>' +
        T('kopyala') + '</button>' +
      (navigator.share
        ? '<button class="pySec" id="pyDiger"><span class="pyIk">' + SVG.art + '</span>' +
          T('diger') + '</button>'
        : '');
    sar.appendChild(el);
    acikMenu = el;

    el.querySelector('#pyIg').onclick = e => {
      e.preventDefault(); e.stopPropagation();
      instagramAkisi(e.currentTarget, o, T);
    };
    el.querySelector('#pyKopya').onclick = async e => {
      const b = e.currentTarget;
      if (await panoyaYaz(o.url)){
        b.innerHTML = '<span class="pyIk pyOk">✓</span>' + T('kopyandi');
        setTimeout(kapat, 900);
      }
    };
    const dg = el.querySelector('#pyDiger');
    if (dg) dg.onclick = async () => {
      try { await navigator.share({ title:o.baslik, text:o.metin, url:o.url }); kapat(); }
      catch(err){ /* vazgeçildiyse menü açık kalsın */ }
    };

    /* Menü düğmenin sağ kenarına hizalı açılır. Düğme sayfanın solundaysa
       bu menüyü ekran dışına atıyor ve içerik görünmez oluyor. Konum
       ölçülerek düzeltiliyor: önce sola hizala, hâlâ sığmıyorsa ekran
       kenarına yasla ve genişliği kırp. */
    const dar = sar.getBoundingClientRect();
    let k = el.getBoundingClientRect();
    if (k.left < 8){
      el.style.right = 'auto';
      el.style.left = '0';
      k = el.getBoundingClientRect();
    }
    if (k.left < 8 || k.right > window.innerWidth - 8){
      el.style.right = 'auto';
      el.style.left = (8 - dar.left) + 'px';
      el.style.maxWidth = (window.innerWidth - 16) + 'px';
    }

    setTimeout(() => {
      document.addEventListener('click', disariTikla, true);
      document.addEventListener('keydown', escBas, true);
    }, 0);
  }

  /* dug: mevcut bir <button>, ya da içine düğme koyulacak bir kap */
  function kur(dug, o){
    if (!dug) return;
    stil();
    const T = k => SOZ[k][o.en ? 1 : 0];
    o.hikaye = o.hikaye || {};
    o.hikaye.bas = o.hikaye.bas || o.baslik;
    o.hikaye.alt = o.hikaye.alt || o.metin;

    if (dug.tagName !== 'BUTTON'){
      let b = dug.querySelector('button.pyDug');
      if (!b){ b = document.createElement('button'); b.type = 'button'; dug.appendChild(b); }
      dug = b;
    }
    if (!/\bpyDug\b/.test(dug.className)) dug.className = (dug.className + ' pyDug').trim();
    dug.type = 'button';
    dug.setAttribute('aria-label', T('dugme'));
    dug.innerHTML = SVG.pay + '<span>' + T('dugme') + '</span>';

    /* Dil değişince kur() yeniden çağrılıyor; sarmalayıcı zaten varsa
       tekrar takılmaz, yoksa iç içe geçer. */
    let sar = dug.parentNode;
    if (!sar || !sar.classList || !sar.classList.contains('pySar')){
      sar = document.createElement('span');
      sar.className = 'pySar';
      dug.parentNode.insertBefore(sar, dug);
      sar.appendChild(dug);
    }
    kapat();

    dug.onclick = e => {
      e.preventDefault(); e.stopPropagation();
      if (acikMenu) kapat(); else menuAc(sar, o, T);
    };
    return dug;
  }

  return { kur, hikayeCiz };
})();
