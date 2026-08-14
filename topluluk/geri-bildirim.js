/* ML Academy · adım sonu geri bildirimi
   ─────────────────────────────────────────────────────────────────────
   Her adımın altında tek satırlık sessiz bir bağlantı: "Bu adım kafanı
   karıştırdı mı?". Tıklayınca küçük bir kutu açılıyor, yazıp gönderiyor.

   NEDEN DERS SONU DEĞİL DE HER ADIM. Kafası karışan kişi dersi
   bitirmiyor; üçüncü adımda takılıp sekmeyi kapatıyor. Geri bildirim
   ders sonunda toplanırsa yalnız bitirenlere, yani hiç kaybolmamış
   olanlara ulaşır. Aranan sinyal tam olarak ayrılan kişide ve o kişi
   sona hiç varmıyor. Kayıt hangi adımdan geldiğini de tutuyor, çünkü
   "rag dersi karışık" ile "rag dersi 4. adımda kaybediyor" arasında
   dağlar var.

   SESSİZ DURMASI ÖNEMLİ. 401 adımın her birinde çıkıyor; göze batan bir
   kutu olsaydı gürültüye dönüşür ve kimse görmez olurdu. O yüzden
   küçük, soluk, çerçevesiz; ancak arayan bulur.

   Supabase yoksa ya da tablo kurulmamışsa hiçbir şey çizilmiyor.
   Tablo: topluluk/geri-bildirim.sql

   Kullanım:
     GERIBILDIRIM.kur(kapEl, { dersId:'rag', adim:4, dil:'tr' });
   ───────────────────────────────────────────────────────────────────── */
var GERIBILDIRIM = (() => {

  const M = {
    tr: {
      ac:      'Bu adım kafanı karıştırdı mı?',
      baslik:  'Nerede takıldın?',
      yerTut:  'Hangi cümle ya da hangi sayı anlaşılmadı? Bir iki satır yeter.',
      gonder:  'Gönder',
      vazgec:  'Vazgeç',
      tesekkur:'Teşekkürler, bunu bir hata olarak not aldım.',
      hata:    'Gönderilemedi. Biraz sonra tekrar dener misin?',
      kisa:    'Birkaç kelime daha yaz.',
    },
    en: {
      ac:      'Did this step confuse you?',
      baslik:  'Where did you get stuck?',
      yerTut:  'Which sentence or which number did not land? A line or two is enough.',
      gonder:  'Send',
      vazgec:  'Cancel',
      tesekkur:'Thank you. I have logged this as a defect.',
      hata:    'Could not send. Would you try again in a moment?',
      kisa:    'Write a few more words.',
    },
  };

  let sb = null;

  function stil(){
    if (document.getElementById('gbStil')) return;
    const s = document.createElement('style');
    s.id = 'gbStil';
    s.textContent = [
      '.gbSar{margin-top:14px}',
      '.gbAc{background:none;border:0;padding:0;cursor:pointer;font:inherit;font-size:12.5px;',
        'color:var(--mut);text-decoration:underline;text-underline-offset:3px;',
        'text-decoration-color:var(--line)}',
      '.gbAc:hover{color:var(--txt);text-decoration-color:var(--mut)}',
      '.gbKutu{margin-top:11px;padding:14px 15px;border:1px solid var(--line);',
        'border-radius:12px;background:var(--panel2);max-width:560px}',
      '.gbKutu b{display:block;font-size:13.5px;margin-bottom:8px}',
      '.gbKutu textarea{width:100%;min-height:74px;resize:vertical;padding:9px 11px;',
        'border:1px solid var(--line);border-radius:9px;background:var(--panel);',
        'color:var(--txt);font:inherit;font-size:13.5px;line-height:1.6}',
      '.gbKutu textarea:focus{outline:none;border-color:var(--mut)}',
      '.gbDug{display:flex;gap:8px;align-items:center;margin-top:9px}',
      '.gbDug button{font:inherit;font-size:13px;padding:8px 15px;border-radius:9px;cursor:pointer}',
      '.gbDug .ana{border:0;background:var(--green);color:var(--anaTxt);font-weight:700}',
      '.gbDug .yan{border:1px solid var(--line);background:var(--panel);color:var(--mut)}',
      '.gbNot{font-size:12.5px;color:var(--mut);margin-left:2px}',
      '.gbNot.ok{color:var(--green)}',
    ].join('');
    document.head.appendChild(s);
  }

  /* Ders sayfası Supabase istemcisini zaten kurmuş oluyor; ikinci bir
     bağlantı açmamak için aynı örnek paylaşılıyor. */
  function istemci(){
    if (sb) return sb;
    if (typeof SUPA === 'undefined' || !SUPA.hazir) return null;
    if (window.__mlSb) return (sb = window.__mlSb);
    if (typeof window.supabase === 'undefined') return null;
    sb = window.supabase.createClient(SUPA.url, SUPA.anonKey);
    window.__mlSb = sb;
    return sb;
  }

  function kur(kap, o){
    if (!kap) return;
    if (!istemci()) return;                 // arka uç yoksa hiç çizme
    stil();
    const t = M[o.dil === 'en' ? 'en' : 'tr'];

    kap.innerHTML = '';
    kap.className = 'gbSar';
    const ac = document.createElement('button');
    ac.type = 'button'; ac.className = 'gbAc'; ac.textContent = t.ac;
    kap.appendChild(ac);

    ac.onclick = () => {
      ac.remove();
      const kutu = document.createElement('div');
      kutu.className = 'gbKutu';
      kutu.innerHTML =
        '<b>' + t.baslik + '</b>' +
        '<textarea maxlength="1200" placeholder="' + t.yerTut.replace(/"/g,'&quot;') + '"></textarea>' +
        '<div class="gbDug"><button class="ana">' + t.gonder + '</button>' +
        '<button class="yan">' + t.vazgec + '</button><span class="gbNot"></span></div>';
      kap.appendChild(kutu);
      const alan = kutu.querySelector('textarea');
      const not  = kutu.querySelector('.gbNot');
      alan.focus();

      kutu.querySelector('.yan').onclick = () => kur(kap, o);

      kutu.querySelector('.ana').onclick = async e => {
        const metin = alan.value.trim();
        if (metin.length < 3){ not.className = 'gbNot'; not.textContent = t.kisa; return; }
        const dug = e.currentTarget;
        dug.disabled = true; not.className = 'gbNot'; not.textContent = '…';
        /* Oturum açıksa kaydı ona bağla; açık değilse user_id null kalıyor
           ve kural bunu açıkça kabul ediyor. */
        let uid = null;
        try {
          const { data } = await sb.auth.getUser();
          uid = (data && data.user && data.user.id) || null;
        } catch(err){ uid = null; }
        const { error } = await sb.from('feedback').insert({
          lesson_id: o.dersId, step_no: o.adim, lang: o.dil === 'en' ? 'en' : 'tr',
          body: metin, user_id: uid,
        });
        if (error){
          dug.disabled = false;
          not.className = 'gbNot'; not.textContent = t.hata;
          return;
        }
        kap.innerHTML = '<span class="gbNot ok">✓ ' + t.tesekkur + '</span>';
      };
    };
  }

  return { kur };
})();
