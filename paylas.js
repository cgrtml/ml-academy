/* ML Academy · paylaş düğmesi
   ─────────────────────────────────────────────────────────────────────
   İki yol var ve hangisinin açılacağına tarayıcı karar verir:

     1) navigator.share varsa  → CİHAZIN KENDİ paylaş menüsü açılır.
        Telefonda asıl istenen bu: kullanıcıda ne yüklüyse hepsi orada
        çıkar, Instagram ve WhatsApp dâhil. Bizim liste tutmamıza gerek
        yok, işletim sistemi kendi listesini gösterir.

     2) yoksa (çoğunlukla masaüstü Firefox) → kendi menümüz açılır.

   Instagram neden kendi menümüzde yok: Instagram'ın webden link
   paylaşmaya yarayan bir adresi HİÇ olmadı, twitter.com/intent gibi bir
   karşılığı yok. Telefonda çıkması işletim sisteminin marifeti. Olmayan
   bir düğme koymak yerine "bağlantıyı kopyala" var.

   Kullanım:
     PAYLAS.kur(document.getElementById('paylasDug'), {
       baslik: 'ML Academy',
       metin:  'Tarayıcıda çalışan interaktif makine öğrenmesi kursu.',
       url:    'https://mltraining.org/',
       en:     false,
     });
   ───────────────────────────────────────────────────────────────────── */
var PAYLAS = (function(){

  const SVG = {
    x:'<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.96 6.82H1.67l7.73-8.84L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z"/></svg>',
    wa:'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.15h-.01a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.19 8.19 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.25-8.24a8.2 8.2 0 0 1 8.24 8.25c0 4.54-3.7 8.23-8.24 8.23Zm4.52-6.16c-.25-.13-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.38-1.99-1.23-.74-.65-1.24-1.46-1.38-1.71-.15-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.21.89 2.39 1.01 2.55.12.17 1.74 2.66 4.22 3.73.59.25 1.05.4 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.68-1.18.2-.58.2-1.08.15-1.18-.06-.11-.23-.17-.48-.29Z"/></svg>',
    li:'<svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z"/></svg>',
    tg:'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.64 6.86-1.55 7.32c-.12.52-.42.65-.86.4l-2.37-1.75-1.14 1.1c-.13.13-.24.24-.48.24l.17-2.42 4.4-3.98c.19-.17-.04-.26-.3-.09l-5.44 3.42-2.34-.73c-.51-.16-.52-.51.11-.76l9.15-3.53c.42-.15.79.1.65.78Z"/></svg>',
    rd:'<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm5.8 10.2a1.4 1.4 0 0 0-2.37-1 6.9 6.9 0 0 0-3.6-1.14l.61-2.88 2 .43a1 1 0 1 0 .11-.66l-2.37-.5a.34.34 0 0 0-.4.26l-.7 3.32a6.9 6.9 0 0 0-3.65 1.15 1.4 1.4 0 1 0-1.54 2.28 2.75 2.75 0 0 0-.03.43c0 2.2 2.56 3.98 5.72 3.98s5.72-1.78 5.72-3.98c0-.14 0-.29-.03-.43a1.4 1.4 0 0 0 .53-1.26Zm-8.5 1a1 1 0 1 1 2 0 1 1 0 0 1-2 0Zm5.6 2.65c-.7.7-2.03.75-2.42.75-.39 0-1.73-.05-2.42-.75a.26.26 0 0 1 .37-.37c.44.44 1.38.6 2.05.6.67 0 1.61-.16 2.05-.6a.26.26 0 0 1 .37.37Zm-.18-1.62a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"/></svg>',
    lnk:'<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>',
    pay:'<svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M12 16V3"/><path d="m8 7 4-4 4 4"/></svg>',
  };

  const SOZ = {
    dugme:   ['Paylaş','Share'],
    baslik:  ['Bu sayfayı paylaş','Share this page'],
    kopyala: ['Bağlantıyı kopyala','Copy link'],
    kopyandi:['Kopyalandı','Copied'],
    kapat:   ['Kapat','Close'],
  };

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
      '.pyMenu{position:absolute;top:calc(100% + 8px);right:0;z-index:9000;min-width:232px;',
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
      '.pyAyrac{height:1px;background:var(--line);margin:7px 8px}',
      '.pyOk{color:var(--green)}',
      '@media(max-width:520px){ .pyMenu{right:auto;left:50%;transform:translateX(-50%)} }',
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

  function menuAc(sar, o, T){
    kapat();
    const u = encodeURIComponent(o.url);
    const m = encodeURIComponent(o.metin);
    const satir = (ad, ik, href) =>
      '<a href="' + href + '" target="_blank" rel="noopener noreferrer">' +
      '<span class="pyIk">' + ik + '</span>' + ad + '</a>';

    const el = document.createElement('div');
    el.className = 'pyMenu';
    el.innerHTML =
      '<h4>' + T('baslik') + '</h4>' +
      satir('X',        SVG.x,  'https://twitter.com/intent/tweet?text=' + m + '&url=' + u) +
      satir('WhatsApp', SVG.wa, 'https://api.whatsapp.com/send?text=' + m + '%20' + u) +
      satir('LinkedIn', SVG.li, 'https://www.linkedin.com/sharing/share-offsite/?url=' + u) +
      satir('Telegram', SVG.tg, 'https://t.me/share/url?url=' + u + '&text=' + m) +
      satir('Reddit',   SVG.rd, 'https://www.reddit.com/submit?url=' + u + '&title=' + m) +
      '<div class="pyAyrac"></div>' +
      '<button class="pySec" id="pyKopya"><span class="pyIk">' + SVG.lnk + '</span>' +
        T('kopyala') + '</button>';
    sar.appendChild(el);
    acikMenu = el;

    el.querySelector('#pyKopya').onclick = async () => {
      const b = el.querySelector('#pyKopya');
      let ok = false;
      try { await navigator.clipboard.writeText(o.url); ok = true; }
      catch(e){
        /* clipboard API'si yoksa ya da izin verilmediyse: gizli alan üzerinden */
        try {
          const t = document.createElement('textarea');
          t.value = o.url; t.setAttribute('readonly','');
          t.style.cssText = 'position:fixed;top:-9999px';
          document.body.appendChild(t); t.select();
          ok = document.execCommand('copy');
          document.body.removeChild(t);
        } catch(e2){ ok = false; }
      }
      if (ok){
        b.innerHTML = '<span class="pyIk pyOk">✓</span>' + T('kopyandi');
        setTimeout(kapat, 900);
      }
    };
    /* açılış tıklamasının kendisi menüyü hemen kapatmasın */
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

    if (dug.tagName !== 'BUTTON'){
      const b = document.createElement('button');
      b.type = 'button';
      dug.appendChild(b);
      dug = b;
    }
    dug.className = dug.className || 'pyDug';
    if (!dug.className.includes('pyDug')) dug.className += ' pyDug';
    dug.type = 'button';
    dug.setAttribute('aria-label', T('dugme'));
    dug.innerHTML = SVG.pay + '<span>' + T('dugme') + '</span>';

    /* Dil değiştirilince kur() yeniden çağrılıyor. Sarmalayıcı her seferinde
       yeniden takılırsa iç içe geçer, o yüzden zaten varsa tekrar kurulmaz. */
    let sar = dug.parentNode;
    if (!sar || !sar.classList || !sar.classList.contains('pySar')){
      sar = document.createElement('span');
      sar.className = 'pySar';
      dug.parentNode.insertBefore(sar, dug);
      sar.appendChild(dug);
    }
    kapat();

    dug.onclick = async e => {
      e.preventDefault(); e.stopPropagation();
      if (acikMenu){ kapat(); return; }
      /* Cihazın kendi menüsü varsa onu aç: kullanıcıda ne yüklüyse orada
         çıkar, bizim listemizin kapsayamayacağı uygulamalar dâhil. */
      if (navigator.share){
        try { await navigator.share({ title:o.baslik, text:o.metin, url:o.url }); return; }
        catch(err){
          /* AbortError = kullanıcı vazgeçti, menü açmaya gerek yok.
             Başka bir hata ise kendi menümüze düşülür. */
          if (err && err.name === 'AbortError') return;
        }
      }
      menuAc(sar, o, T);
    };
    return dug;
  }

  return { kur };
})();
