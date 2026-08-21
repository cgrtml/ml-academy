/* ML Academy · hesap katmanı: giriş, kayıt, yorum, moderasyon
   Supabase Auth üzerine ince bir sarmalayıcı. Yapılandırma yoksa hiçbir istek
   atmaz ve arayüzde hiçbir şey göstermez, yani site eskisi gibi çalışır.

   Kullanım (index.html içinde):
     <script src="topluluk/hesap.js"></script>
     <script>HESAP.kur({ url:SUPA.url, anonKey:SUPA.anonKey, dil:DIL });</script>   */

/* Ders sayısı elle yazılırsa eskiyor: 113 yazılmıştı, gerçek sayı çoktan
   değişmişti. Artık ROTALAR'dan çalışma anında sayılıyor. */
const DERS_SAYISI = (typeof ROTALAR !== 'undefined')
  ? ROTALAR.reduce((a,r) => a + r.dersler.length, 0)
  : 120;

const HESAP = (() => {

  const M = {
    tr: {
      giris:'Giriş yap', kayit:'Hesap oluştur', kayitKisa:'Kayıt ol', cikis:'Çıkış',
      adSoyad:'Ad Soyad', unvan:'Ünvan', kurum:'Kurum / Okul',
      opsiyonel:'isteğe bağlı',
      zorunluAd:'Ad ve soyadını yaz.',
      zorunluUnvan:'Kendini nasıl tanımladığını seç.',
      zorunluEposta:'E-posta adresini yaz.',
      zorunluSifre:'Şifre en az 8 karakter olmalı.',
      sifreTekrar:'Şifre (tekrar)', sifreUyum:'Şifreler aynı değil.',
      unvanSec:'—',
      unvanlar:['Öğrenci','Akademisyen / Araştırmacı','Yazılım Geliştirici',
                'Veri Bilimci / ML Mühendisi','Öğretmen / Eğitmen',
                'Meraklı / Diğer'],
      rotaBas:'Bir rotayı bitirdin', rotaAlt:'# ders · # XP',
      rotaSor:'Bu rota hakkında ne düşünüyorsun?',
      rotaSonra:'Şimdi değil', rotaGiris:'Değerlendirmek için giriş yap',
      sifremiUnuttum:'Şifremi unuttum', sifirlaGonder:'Sıfırlama bağlantısı gönder',
      sifirlaBilgi:'E-postana bir sıfırlama bağlantısı gönderdik.',
      marka:'ML Academy', markaAlt:'Yapay zekâyı sıfırdan öğren',
      eposta:'E-posta', sifre:'Şifre', sifreAz:'En az 8 karakter',
      girisBas:'Tekrar hoş geldin', girisAlt:'Kaldığın yerden devam et.',
      kayitBas:'Ücretsiz hesap aç', kayitAlt:DERS_SAYISI+' dersin tamamı açılır. Kart istenmez.',
      gecis1:'Hesabın yok mu?  Kayıt ol', gecis2:'Zaten hesabın var mı?  Giriş yap',
      goster:'göster', gizle:'gizle',
      artiBas:'Hesapla birlikte',
      arti:[DERS_SAYISI+' dersin tamamı', 'İlerlemen cihazlar arası saklanır',
            'Hesabını istediğin zaman silebilirsin'],
      dogrula:'E-postana bir doğrulama bağlantısı gönderdik. Onayladıktan sonra giriş yapabilirsin.',
      hata:'Bir şey ters gitti',
      hataGiris:'E-posta ya da şifre hatalı.',
      hataKayitli:'Bu e-posta zaten kayıtlı. Giriş yap sekmesinden devam edebilirsin. Doğrulama mailini hiç almadıysan yenisini isteyebilirsin.',
      hataOnaysiz:'Önce e-postandaki doğrulama bağlantısına tıkla.',
      hataEposta:'Bu e-posta adresi geçerli görünmüyor.',
      hataSifreKisa:'Şifre en az 8 karakter olmalı.',
      hataBekle:'Çok sık denendi. # saniye sonra tekrar dene.',
      hataAg:'Bağlantı kurulamadı. İnterneti kontrol edip tekrar dene.',
      gonderiliyor:'Gönderiliyor…',
      tekrarGonder:'Maili tekrar gönder',
      tekrarGonderildi:'Yeni bir doğrulama maili yola çıktı.',
      basariBas:'Hesabın açıldı',
      basariAlt:'# adresine bir doğrulama bağlantısı gönderdik. Bağlantıya tıkladıktan sonra giriş yapabilirsin.',
      basariNot:'Birkaç dakika içinde gelmezse spam klasörüne bak.',
      basariKapat:'Tamam',
      yorumBas:'Deneyimini yaz',
      yorumAlt:'Geri dönüşün bizim için çok değerli. İstediğin zaman değiştirebilirsin.',
      ad:'Görünecek ad', puanEt:'Puanın', yorumMetin:'Yorumun (isteğe bağlı)',
      gonder:'Gönder', guncelle:'Güncelle', sil:'Sil',
      durumBekliyor:'Yorumun sırada, henüz yayımlanmadı.',
      durumOnayli:'Yorumun yayımda.',
      durumRed:'Yorumun yayımlanmadı.',
      kapat:'Kapat', iptal:'İptal',
      ya:'ya da',
      ileGoogle:'Google ile devam et', ileGithub:'GitHub ile devam et',
      kilitBas:'Devam etmek için giriş yap',
      kilitAlt:'Her rotanın ilk üç dersi herkese açık. Gerisi için ücretsiz bir hesap yeterli.',
      kilitNe:'Hesap açmak neden gerekiyor:',
      kilitMad:['İlerlemen cihazlar arasında saklanır.',
                'Hesap açmak ücretsiz, kart istenmez.',
                'Hesabını istediğin zaman silebilirsin.'],
      hesabim:'Hesabım',
      hesapEposta:'E-posta',
      hesapUyeBas:'Üyelik başlangıcı',
      tehlike:'Hesabı sil',
      tehlikeAlt:'Hesabın ve ona bağlı her şey kalıcı olarak silinir: profilin, ilerlemen ve varsa yorumun. Bu işlem geri alınamaz.',
      tehlikeOnay:'Onaylamak için e-posta adresini yaz:',
      tehlikeDug:'Hesabımı kalıcı olarak sil',
      tehlikeYanlis:'Yazdığın adres hesabınla aynı değil.',
      siliniyor:'Siliniyor…',
      silindi:'Hesabın silindi.',
      modBas:'Onay bekleyen yorumlar', modYok:'Bekleyen yorum yok.',
      modSayi:'# yorum onay bekliyor', modYukleniyor:'Yükleniyor…',
      onayla:'Onayla', reddet:'Reddet',
    },
    en: {
      giris:'Sign in', kayit:'Create account', kayitKisa:'Sign up', cikis:'Sign out',
      adSoyad:'Full Name', unvan:'Role', kurum:'Organisation / School',
      opsiyonel:'optional',
      zorunluAd:'Please enter your full name.',
      zorunluUnvan:'Please choose how you would describe yourself.',
      zorunluEposta:'Please enter your email address.',
      zorunluSifre:'The password must be at least 8 characters.',
      sifreTekrar:'Password (again)', sifreUyum:'The passwords do not match.',
      unvanSec:'—',
      unvanlar:['Student','Academic / Researcher','Software Developer',
                'Data Scientist / ML Engineer','Teacher / Instructor',
                'Enthusiast / Other'],
      rotaBas:'You finished a route', rotaAlt:'# lessons · # XP',
      rotaSor:'What did you think of this route?',
      rotaSonra:'Not now', rotaGiris:'Sign in to leave a review',
      sifremiUnuttum:'Forgot password', sifirlaGonder:'Send reset link',
      sifirlaBilgi:'We sent a reset link to your email.',
      marka:'ML Academy', markaAlt:'Learn AI from zero',
      eposta:'Email', sifre:'Password', sifreAz:'At least 8 characters',
      girisBas:'Welcome back', girisAlt:'Pick up where you left off.',
      kayitBas:'Create a free account', kayitAlt:'All '+DERS_SAYISI+' lessons unlock. No card needed.',
      gecis1:'No account yet?  Sign up', gecis2:'Already have an account?  Sign in',
      goster:'show', gizle:'hide',
      artiBas:'With an account',
      arti:['All '+DERS_SAYISI+' lessons', 'Progress kept across devices',
            'Delete your account whenever you want'],
      dogrula:'We sent a confirmation link to your email. You can sign in once you confirm it.',
      hata:'Something went wrong',
      hataGiris:'Email or password is wrong.',
      hataKayitli:'This email is already registered. Use the Sign in tab. If the confirmation email never arrived, you can request a new one.',
      hataOnaysiz:'Please click the confirmation link in your email first.',
      hataEposta:'That email address does not look valid.',
      hataSifreKisa:'Password must be at least 8 characters.',
      hataBekle:'Too many attempts. Try again in # seconds.',
      hataAg:'Could not connect. Check your internet and try again.',
      gonderiliyor:'Sending…',
      tekrarGonder:'Send the email again',
      tekrarGonderildi:'A new confirmation email is on its way.',
      basariBas:'Your account is ready',
      basariAlt:'We sent a confirmation link to #. Click it and you can sign in.',
      basariNot:'If it does not arrive within a few minutes, check your spam folder.',
      basariKapat:'Done',
      yorumBas:'Write about your experience',
      yorumAlt:'Your feedback means a great deal to us. You can change it any time.',
      ad:'Display name', puanEt:'Your rating', yorumMetin:'Your review (optional)',
      gonder:'Submit', guncelle:'Update', sil:'Delete',
      durumBekliyor:'Your review is queued, not published yet.',
      durumOnayli:'Your review is live.',
      durumRed:'Your review was not published.',
      kapat:'Close', iptal:'Cancel',
      ya:'or',
      ileGoogle:'Continue with Google', ileGithub:'Continue with GitHub',
      kilitBas:'Sign in to continue',
      kilitAlt:'The first three lessons of every route are open to everyone. A free account covers the rest.',
      kilitNe:'Why an account:',
      kilitMad:['Your progress is kept across devices.',
                'Creating an account is free, no card needed.',
                'You can delete your account whenever you want.'],
      hesabim:'Your account',
      hesapEposta:'Email',
      hesapUyeBas:'Member since',
      tehlike:'Delete account',
      tehlikeAlt:'Your account and everything attached to it is permanently deleted: your profile, your progress and your review. This cannot be undone.',
      tehlikeOnay:'Type your email address to confirm:',
      tehlikeDug:'Permanently delete my account',
      tehlikeYanlis:'That address does not match your account.',
      siliniyor:'Deleting…',
      silindi:'Your account has been deleted.',
      modBas:'Reviews awaiting approval', modYok:'Nothing pending.',
      modSayi:'# reviews awaiting approval', modYukleniyor:'Loading…',
      onayla:'Approve', reddet:'Reject',
    },
  };

  let sb = null, t = M.tr, kullanici = null, moderator = false, bekleyen = 0;
  let saglayicilar = ['email'];
  const dinleyiciler = [];

  const kacir = s => String(s == null ? '' : s)
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;').replace(/'/g,'&#39;');

  /* ── stil ── */
  function stil(){
    if (document.getElementById('hesapStil')) return;
    const s = document.createElement('style');
    s.id = 'hesapStil';
    s.textContent = `
      .hArka{position:fixed;inset:0;background:rgba(15,27,45,.44);z-index:9100;
        display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto}
      .hKart{background:var(--panel,#ffffff);border:1px solid var(--line,#dde5ef);
        border-radius:20px;max-width:428px;width:100%;padding:34px 32px 28px;margin:auto;
        color:var(--txt,#0f1b2d);font-size:15px;
        box-shadow:0 20px 50px rgba(15,27,45,.16)}
      .hKart .marka{font-family:var(--mono,monospace);font-size:10px;letter-spacing:.26em;
        text-transform:uppercase;color:var(--mut,#586a80);text-align:center;margin-bottom:18px}
      .hArti{margin:20px 0 0;padding:18px 0 0;list-style:none;
        border-top:1px solid var(--line,#dde5ef)}
      .hArti li{display:flex;gap:10px;align-items:flex-start;color:var(--mut,#586a80);
        font-size:13.5px;line-height:1.6;margin-top:8px}
      .hArti li::before{content:'✓';color:var(--green,#0a8b68);font-weight:800;flex:none}
      .hSifreSar{position:relative}
      .hSifreSar button{position:absolute;right:10px;top:50%;transform:translateY(-50%);
        background:none;border:0;color:var(--mut,#586a80);font-family:var(--mono,monospace);
        font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;padding:4px 6px}
      .hKart.genis{max-width:620px}
      .hKart{position:relative}
      .hKapat{position:absolute;top:14px;right:16px;width:30px;height:30px;line-height:1;
        border-radius:9px;border:1px solid var(--line,#dde5ef);background:var(--panel2,#eef2f8);
        color:var(--mut,#586a80);font-size:19px;cursor:pointer;padding:0}
      .hKapat:hover{color:var(--txt,#0f1b2d);border-color:var(--mut,#586a80)}

      /* marka bloğu */
      .hBas{text-align:center;margin-bottom:22px}
      .hMarka{font-size:24px;font-weight:850;letter-spacing:-.03em;color:var(--blue,#1668c9)}
      .hMarkaAlt{color:var(--mut,#586a80);font-size:14px;margin-top:4px}

      /* giriş / kayıt sekmesi */
      .hSekme{display:flex;gap:4px;background:var(--panel2,#eef2f8);
        border-radius:12px;padding:4px;margin:0 0 22px}
      .hSekme button{flex:1;padding:10px 12px;border:0;border-radius:9px;background:none;
        color:var(--mut,#586a80);font-family:inherit;font-size:14px;font-weight:700;cursor:pointer}
      .hSekme button.on{background:var(--panel,#fff);color:var(--txt,#0f1b2d);
        box-shadow:0 1px 3px rgba(15,27,45,.12)}

      /* alanlar */
      .hAlan{margin-bottom:15px}
      .hAlan:last-of-type{margin-bottom:0}
      .hIkili{display:grid;grid-template-columns:1fr 1fr;gap:14px}
      @media(max-width:520px){ .hIkili{grid-template-columns:1fr} }
      .hKart select{width:100%;background:var(--panel,#fff);
        border:1px solid var(--line,#dde5ef);border-radius:10px;padding:11px 13px;
        color:var(--txt,#0f1b2d);font-family:inherit;font-size:15px;cursor:pointer}
      .hKart select:focus{outline:none;border-color:var(--blue,#1668c9)}

      /* alt bağlantı satırı */
      /* rota bitiş kutlaması */
      .hTebrik{text-align:center;padding:6px 0 2px}
      .hTebrikIkon{width:58px;height:58px;margin:0 auto 14px;border-radius:18px;
        display:grid;place-items:center;font-size:26px;
        background:rgba(22,104,201,.1);border:1px solid rgba(22,104,201,.28);
        color:var(--blue,#1668c9)}
      .hTebrikAd{font-size:17px;font-weight:750;margin-top:6px}
      .hTebrikSay{font-family:var(--mono,monospace);font-size:12px;letter-spacing:.1em;
        color:var(--mut,#586a80);margin-top:7px}
      .hAlt{text-align:center;margin-top:14px}
      .hBag{color:var(--blue,#1668c9);font-size:13.5px;cursor:pointer}
      .hBag:hover{text-decoration:underline}
      .hKart h3{margin:0 0 7px;font-size:25px;font-weight:850;letter-spacing:-.03em;text-align:center}
      .hKart .alt{color:var(--mut,#586a80);font-size:14px;margin:0 0 22px;text-align:center;line-height:1.6}
      .hKart label{display:block;font-size:13.5px;font-weight:600;
        color:var(--txt,#0f1b2d);margin:0 0 6px}
      /* etiket içindeki "· isteğe bağlı" notu: zorunlu alanlardan ayrılsın */
      .hKart label i{font-style:normal;font-weight:500;color:var(--mut,#586a80);
        font-size:12.5px}
      .hKart input,.hKart textarea{width:100%;background:var(--panel,#fff);
        border:1px solid var(--line,#dde5ef);border-radius:10px;padding:12px 14px;
        color:var(--txt,#0f1b2d);font-family:inherit;font-size:15px}
      .hKart textarea{resize:vertical;min-height:88px;line-height:1.6}
      .hKart input:focus,.hKart textarea:focus{outline:none;border-color:var(--blue,#1668c9)}
      .hDug{display:flex;gap:10px;margin-top:22px}
      .hDug button{flex:1;padding:13px 16px;border-radius:11px;font-size:15px;font-weight:700;
        cursor:pointer;border:1px solid var(--line,#dde5ef);background:var(--panel2,#eef2f8);
        color:var(--txt,#0f1b2d);font-family:inherit}
      .hDug button.ana{background:var(--blue,#1668c9);border-color:var(--blue,#1668c9);color:var(--anaTxt)}
      .hDug button.ana:hover{filter:brightness(1.08)}
      .hDug.tek button{flex:1}
      .hDug button.teh{color:var(--red,#cf2f2f);border-color:rgba(248,113,113,.4)}
      .hDug button:hover{border-color:var(--mut,#586a80)}
      .hGecis{display:block;text-align:center;margin-top:15px;font-size:13px;
        color:var(--blue,#1668c9);cursor:pointer}
      .hAyrac{display:flex;align-items:center;gap:12px;margin:20px 0 4px;
        color:var(--mut,#586a80);font-size:12px}
      .hAyrac::before,.hAyrac::after{content:'';flex:1;height:1px;background:var(--line,#dde5ef)}
      .hSos{display:flex;flex-direction:column;gap:9px;margin-top:12px}
      .hSos button{display:flex;align-items:center;justify-content:center;gap:10px;
        padding:12px 16px;border-radius:12px;font-size:14.5px;font-weight:600;cursor:pointer;
        border:1px solid var(--line,#dde5ef);background:var(--panel2,#eef2f8);
        color:var(--txt,#0f1b2d);font-family:inherit}
      .hSos svg{width:18px;height:18px;flex:none}
      .hSos button:hover{border-color:var(--mut,#586a80)}
      .hKilitMad{margin:14px 0 0;padding-left:18px;color:var(--mut,#586a80);
        font-size:13.5px;line-height:1.9}
      /* kayıt sonrası onay ekranı */
      .hBasari{text-align:center;padding:6px 2px 0}
      .hBasari h3{margin:0 0 8px}
      .hBasariIkon{width:56px;height:56px;margin:0 auto 20px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;font-size:27px;font-weight:800;
        background:rgba(34,211,160,.13);color:var(--green,#0a8b68)}
      .hBasariNot{margin:12px 0 0;font-size:13px;line-height:1.6;color:var(--mut,#586a80)}
      /* istek uçarken düğme kilitli: çift gönderim hız sınırına takılıyordu */
      .hDug button:disabled{opacity:.55;cursor:default;filter:none}
      .hMesaj{margin-top:14px;padding:10px 13px;border-radius:10px;font-size:13.5px;line-height:1.55}
      .hMesaj.iyi{background:rgba(34,211,160,.1);color:var(--green,#0a8b68)}
      .hMesaj.kotu{background:rgba(248,113,113,.1);color:var(--red,#cf2f2f)}
      .hYildiz{display:flex;gap:6px;margin-top:6px}
      .hYildiz span{font-size:30px;color:var(--line,#dde5ef);cursor:pointer;line-height:1}
      .hYildiz span.dolu{color:var(--star,#e0930b)}
      .hUst{display:flex;gap:9px;align-items:center}
      .hUst button{background:none;border:1px solid var(--line,#dde5ef);color:var(--mut,#586a80);
        font-family:var(--mono,monospace);font-size:11px;padding:6px 12px;border-radius:8px;cursor:pointer}
      .hUst button:hover{color:var(--txt,#0f1b2d);border-color:var(--mut,#586a80)}
      .hUst button.vurgu{color:var(--green,#0a8b68);border-color:rgba(34,211,160,.4)}
      /* Bekleyen yorum varsa moderatör düğmesi dikkat çeksin. */
      .hUst button.bekler{color:var(--orange,#c2620d);border-color:rgba(251,146,60,.45)}
      .hUst button.bekler b{display:inline-block;min-width:17px;margin-left:4px;padding:1px 5px;
        border-radius:20px;background:var(--orange,#c2620d);color:var(--anaTxt);
        font-size:10px;font-weight:800;text-align:center}
      /* kayıt ol: sayfadaki asıl eylem, dolu düğme */
      .hUst button.birincil{background:var(--blue,#1668c9);border-color:var(--blue,#1668c9);
        color:var(--anaTxt);font-weight:800}
      .hUst button.birincil:hover{filter:brightness(1.08);color:var(--anaTxt)}
      @media(max-width:400px){ .hUst button{padding:6px 9px;font-size:10.5px} }
      /* hesap ekranı · tehlikeli bölge */
      .hSatir{display:flex;justify-content:space-between;gap:16px;padding:13px 0;
        border-bottom:1px solid var(--line,#dde5ef);font-size:14px}
      .hSatir span{color:var(--mut,#586a80)}
      .hSatir b{font-weight:600;word-break:break-all;text-align:right}
      .hTehlike{margin-top:24px;border:1px solid rgba(207,47,47,.35);border-radius:12px;
        padding:16px 18px;background:rgba(248,113,113,.06)}
      .hTehlike h4{margin:0 0 8px;font-size:14.5px;color:var(--red,#cf2f2f);font-weight:800}
      .hTehlike p{margin:0 0 14px;font-size:13.5px;line-height:1.6;color:var(--mut,#586a80)}
      .hTehlike label{display:block;margin-bottom:7px;font-size:13px;font-weight:600}
      .hTehlike input{width:100%;padding:11px 13px;border:1px solid var(--line,#dde5ef);
        border-radius:9px;background:var(--panel,#fff);color:var(--txt,#0f1b2d);font:inherit;font-size:14px}
      .hTehlike button{width:100%;margin-top:12px;padding:12px;border:0;border-radius:9px;
        background:var(--red,#cf2f2f);color:#fff;font:inherit;font-size:14px;font-weight:700;cursor:pointer}
      .hTehlike button:disabled{opacity:.5;cursor:default}
      .hMod{border:1px solid var(--line,#dde5ef);border-radius:12px;padding:14px 16px;margin-bottom:10px}
      .hMod .ust{display:flex;justify-content:space-between;align-items:center;gap:10px}
      .hMod .ad{font-weight:700}
      .hMod .p{color:var(--star,#e0930b);letter-spacing:.1em}
      .hMod p{margin:8px 0 0;color:var(--mut,#586a80);font-size:14px;line-height:1.6}
    `;
    document.head.appendChild(s);
  }

  /* ── yardımcılar ── */
  const yildizHTML = p => Array.from({length:5}, (_,i) =>
    `<span data-p="${i+1}" class="${i < p ? 'dolu' : ''}">★</span>`).join('');

  function kapat(){ const a = document.querySelector('.hArka'); if (a) a.remove(); }
  function kart(icerik, genis){
    stil(); kapat();
    const arka = document.createElement('div');
    arka.className = 'hArka';
    arka.innerHTML = `<div class="hKart${genis ? ' genis' : ''}">` +
      `<button class="hKapat" aria-label="${t.kapat}">×</button>${icerik}</div>`;
    arka.addEventListener('mousedown', e => { if (e.target === arka) kapat(); });
    arka.querySelector('.hKapat').onclick = kapat;
    /* Escape ile kapansın: modalın kaçış yolu olmalı. */
    const esc = e => { if (e.key === 'Escape'){ kapat(); document.removeEventListener('keydown', esc); } };
    document.addEventListener('keydown', esc);
    document.body.appendChild(arka);
    return arka;
  }
  const mesaj = (arka, s, iyi) => {
    const eski = arka.querySelector('.hMesaj'); if (eski) eski.remove();
    const d = document.createElement('div');
    d.className = 'hMesaj ' + (iyi ? 'iyi' : 'kotu');
    d.textContent = s;
    arka.querySelector('.hKart').appendChild(d);
  };

  /* ── Supabase hatalarını çevir ──
     Supabase hata metinleri her zaman İngilizce döner. Ham hâlde göstermek
     Türkçe bir arayüzde hem yabancı duruyor hem de kullanıcıya ne yapması
     gerektiğini söylemiyor ("For security purposes, you can only request
     this after 49 seconds."). Tanıdığımız durumlar kendi metnimize
     çevriliyor. Tanımadığımız bir hata gelirse ham metin gösterilir:
     sessizce yutmak, sorunu bulmayı imkânsız kılardı. */
  const hataCevir = e => {
    const m = String((e && e.message) || e || '');
    const sn = m.match(/after (\d+) seconds?/i);
    if (sn) return t.hataBekle.replace('#', sn[1]);
    if (/rate limit|too many requests/i.test(m))       return t.hataBekle.replace('#', '60');
    if (/invalid login credentials/i.test(m))          return t.hataGiris;
    if (/already registered|already exists|user already/i.test(m)) return t.hataKayitli;
    if (/not confirmed/i.test(m))                      return t.hataOnaysiz;
    if (/invalid email|unable to validate email/i.test(m)) return t.hataEposta;
    if (/password should be at least|too short/i.test(m))  return t.hataSifreKisa;
    if (/failed to fetch|networkerror|load failed/i.test(m)) return t.hataAg;
    return m || t.hata;
  };

  /* ── kayıt sonrası ekran ──
     Kayıt başarılı olunca formu YERİNDE BIRAKMAK hataydı: kullanıcı
     düğmenin hâlâ basılabilir olduğunu görüp tekrar basıyor, ikinci istek
     Supabase'in hız sınırına takılıyor ve ekranda kırmızı bir hata
     beliriyor. Oysa kayıt olmuştu. Bu yüzden form tamamen kaldırılıyor. */
  /* ── doğrulama mailini yeniden gönder ──
     Bu yoktu ve gerçek bir çıkmaz üretiyordu: maili spam'e düşen ya da 24
     saatlik süreyi kaçıran kullanıcı tekrar kayıt olmayı denediğinde
     "zaten kayıtlı" duvarına çarpıyor, elinde tek yol kalmıyordu. Okullara
     açılmadan önce kapatılması gereken açıktı. */
  function tekrarDug(arka, eposta){
    const b = document.createElement('button');
    b.textContent = t.tekrarGonder;
    b.onclick = async () => {
      b.disabled = true; b.textContent = t.gonderiliyor;
      try {
        const { error } = await sb.auth.resend({ type:'signup', email: eposta });
        if (error) throw error;
        mesaj(arka, t.tekrarGonderildi, true);
        b.textContent = t.tekrarGonder;   // disabled kalıyor: üst üste basmanın
                                          // tek sonucu Supabase'in hız sınırı
      } catch (e){
        mesaj(arka, hataCevir(e), false);
        b.disabled = false; b.textContent = t.tekrarGonder;
      }
    };
    return b;
  }

  function basariEkrani(arka, eposta){
    const k = arka.querySelector('.hKart');
    k.classList.remove('genis');
    k.innerHTML = `<button class="hKapat" aria-label="${t.kapat}">×</button>
      <div class="hBasari">
        <div class="hBasariIkon">✓</div>
        <h3>${t.basariBas}</h3>
        <p class="alt">${t.basariAlt.replace('#', '<b>' + kacir(eposta) + '</b>')}</p>
        <p class="hBasariNot">${t.basariNot}</p>
        <div class="hDug" id="hBasariDug"><button id="hBitti" class="ana">${t.basariKapat}</button></div>
      </div>`;
    k.querySelector('.hKapat').onclick = kapat;
    k.querySelector('#hBitti').onclick = kapat;
    k.querySelector('#hBasariDug').prepend(tekrarDug(arka, eposta));
  }

  const IKON = {
    google:'<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.6 12.2c0-.8-.1-1.4-.2-2H12v3.8h6c-.1 1-.8 2.5-2.2 3.5l3.4 2.6c2-1.8 3.4-4.6 3.4-7.9z"/><path fill="#34A853" d="M12 23c2.9 0 5.4-1 7.2-2.6l-3.4-2.6c-.9.6-2.1 1-3.8 1-2.9 0-5.4-1.9-6.3-4.6l-3.5 2.7C4 20.5 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.7 14.2c-.2-.7-.4-1.4-.4-2.2s.1-1.5.4-2.2L2.2 7.1C1.4 8.6 1 10.2 1 12s.4 3.4 1.2 4.9l3.5-2.7z"/><path fill="#EA4335" d="M12 4.8c1.6 0 2.7.7 3.4 1.3l2.9-2.9C16.5 1.6 14 .6 12 .6 7.7.6 4 3.1 2.2 7.1l3.5 2.7C6.6 6.9 9.1 4.8 12 4.8z"/></svg>',
    github:'<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 .5C5.7.5.6 5.6.6 12c0 5 3.3 9.3 7.8 10.8.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.1.1 1.7 1.2 1.7 1.2 1 1.8 2.7 1.3 3.4 1 .1-.7.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.3 1.2-3.2-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.1 4.5 18 4.8 18 4.8c.7 1.6.3 2.8.1 3.1.8.9 1.2 1.9 1.2 3.2 0 4.5-2.7 5.5-5.3 5.8.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6 4.6-1.5 7.8-5.8 7.8-10.8C23.4 5.6 18.3.5 12 .5z"/></svg>',
  };

  /* ── sosyal giriş ──
     Yalnızca yapılandırmada açık olan sağlayıcılar gösterilir. Panelde
     etkinleştirilmemiş bir sağlayıcı için düğme çıkarmak, tıklanınca hata
     veren bir düğme demek olurdu. */
  function sosyalHTML(){
    const v = saglayicilar.filter(p => p !== 'email');
    if (!v.length) return '';
    const ad = { google:t.ileGoogle, github:t.ileGithub };
    return `<div class="hSos">` +
      v.map(p => `<button data-sag="${p}">${IKON[p] || ''}${ad[p] || p}</button>`).join('') +
      `</div><div class="hAyrac">${t.ya}</div>`;
  }
  function sosyalBagla(arka){
    arka.querySelectorAll('[data-sag]').forEach(d => {
      d.onclick = async () => {
        try {
          const { error } = await sb.auth.signInWithOAuth({
            provider: d.dataset.sag,
            options: { redirectTo: location.origin + location.pathname },
          });
          if (error) throw error;
        } catch (e){ mesaj(arka, hataCevir(e), false); }
      };
    });
  }

  /* ── kilit ekranı ── */
  function kilitEkrani(){
    const arka = kart(`
      <h3>${t.kilitBas}</h3>
      <p class="alt">${t.kilitAlt}</p>
      <div class="hMesaj iyi">${t.kilitNe}
        <ul class="hKilitMad">${t.kilitMad.map(x => '<li>'+x+'</li>').join('')}</ul></div>
      <div class="hDug">
        <button id="hIptal">${t.kapat}</button>
        <button id="hTamam" class="ana">${t.kayit}</button>
      </div>
      <span class="hGecis" id="hGecis">${t.gecis2}</span>`);
    arka.querySelector('#hIptal').onclick = kapat;
    arka.querySelector('#hTamam').onclick = () => girisEkrani(true);
    arka.querySelector('#hGecis').onclick = () => girisEkrani(false);
  }

  /* ── giriş / kayıt ── */
  /* ══ GİRİŞ / KAYIT PENCERESİ ══
     Tek kart, üstte marka, altında sekme. Kayıt formu geniş: ad, ünvan,
     kurum, e-posta ve iki kez şifre. Giriş formu kısa kalır, çünkü giriş
     yapan kişi zaten bilgi vermiş.

     Ünvan isteğe bağlıdır ve atlanabilir. Zorunlu yapılmadı: ücretsiz bir
     kursta her zorunlu alan kayıt tamamlama oranını düşürür. */
  function girisEkrani(kayitMi, sifirlamaMi){
    const alan = (etiket, ic) => `<div class="hAlan"><label>${etiket}</label>${ic}</div>`;

    const sifirlamaHTML = `
      <p class="alt">${t.girisAlt}</p>
      ${alan(t.eposta, '<input type="email" id="hE" autocomplete="email" placeholder="ad@ornek.com">')}
      <div class="hDug tek"><button id="hTamam" class="ana">${t.sifirlaGonder}</button></div>
      <div class="hAlt"><span class="hBag" id="hGeriGiris">← ${t.giris}</span></div>`;

    const girisHTML = `
      ${sosyalHTML()}
      ${alan(t.eposta, '<input type="email" id="hE" autocomplete="email" placeholder="ad@ornek.com">')}
      ${alan(t.sifre, `<div class="hSifreSar">
          <input type="password" id="hS" autocomplete="current-password">
          <button type="button" id="hGoz">${t.goster}</button></div>`)}
      <div class="hDug tek"><button id="hTamam" class="ana">${t.giris}</button></div>
      <div class="hAlt"><span class="hBag" id="hUnut">${t.sifremiUnuttum}</span></div>`;

    const kayitHTML = `
      ${sosyalHTML()}
      ${alan(t.adSoyad, '<input type="text" id="hAd" autocomplete="name">')}
      <div class="hIkili">
        ${alan(t.unvan, `<select id="hUn"><option value="">${t.unvanSec}</option>` +
          t.unvanlar.map(u => `<option>${u}</option>`).join('') + '</select>')}
        ${alan(t.kurum + ' <i>· ' + t.opsiyonel + '</i>',
               '<input type="text" id="hKu" autocomplete="organization">')}
      </div>
      ${alan(t.eposta, '<input type="email" id="hE" autocomplete="email" placeholder="ad@ornek.com">')}
      ${alan(t.sifre + ' · ' + t.sifreAz, `<div class="hSifreSar">
          <input type="password" id="hS" autocomplete="new-password">
          <button type="button" id="hGoz">${t.goster}</button></div>`)}
      ${alan(t.sifreTekrar, '<input type="password" id="hS2" autocomplete="new-password">')}
      <div class="hDug tek"><button id="hTamam" class="ana">${t.kayit}</button></div>`;

    const arka = kart(`
      <div class="hBas">
        <div class="hMarka">${t.marka}</div>
        <div class="hMarkaAlt">${t.markaAlt}</div>
      </div>
      ${sifirlamaMi ? '' : `
      <div class="hSekme" role="tablist">
        <button data-k="0" class="${kayitMi ? '' : 'on'}">${t.giris}</button>
        <button data-k="1" class="${kayitMi ? 'on' : ''}">${t.kayitKisa}</button>
      </div>`}
      ${sifirlamaMi ? sifirlamaHTML : (kayitMi ? kayitHTML : girisHTML)}
      ${kayitMi && !sifirlamaMi ? `<ul class="hArti">${t.arti.map(x => '<li>'+x+'</li>').join('')}</ul>` : ''}`,
      kayitMi && !sifirlamaMi);

    const q = sec => arka.querySelector(sec);

    arka.querySelectorAll('.hSekme button').forEach(d =>
      d.onclick = () => { if (d.dataset.k === (kayitMi ? '1' : '0')) return;
                          girisEkrani(d.dataset.k === '1'); });
    if (q('#hUnut')) q('#hUnut').onclick = () => girisEkrani(false, true);
    if (q('#hGeriGiris')) q('#hGeriGiris').onclick = () => girisEkrani(false);
    sosyalBagla(arka);

    const gz = q('#hGoz');
    if (gz) gz.onclick = () => {
      const inp = q('#hS'), gizli = inp.type === 'password';
      inp.type = gizli ? 'text' : 'password';
      gz.textContent = gizli ? t.gizle : t.goster;
    };

    /* Enter ile ilerleme: son alanda gönder, öncesinde sonrakine geç. */
    const sira = [...arka.querySelectorAll('input')];
    sira.forEach((inp, k) => inp.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      if (k < sira.length - 1) sira[k+1].focus(); else q('#hTamam').click();
    }));
    setTimeout(() => { const ilk = sira[0]; if (ilk) ilk.focus(); }, 30);

    /* Düğme kilidi. Ağ isteği uçarken ikinci kez basılabilmesi gerçek bir
       hataydı: Supabase aynı adrese üst üste kayıt isteğini hız sınırına
       takıyor, kullanıcı da kaydın başarısız olduğunu sanıyordu. */
    const dugme = q('#hTamam');
    let calisiyor = false;
    const kilitle = () => {
      calisiyor = true;
      dugme.dataset.eski = dugme.textContent;
      dugme.textContent  = t.gonderiliyor;
      dugme.disabled     = true;
    };
    const coz = () => {
      calisiyor = false;
      if (dugme.dataset.eski) dugme.textContent = dugme.dataset.eski;
      dugme.disabled = false;
    };

    dugme.onclick = async () => {
      if (calisiyor) return;
      const eposta = (q('#hE') || {}).value ? q('#hE').value.trim() : '';

      /* şifre sıfırlama */
      if (sifirlamaMi){
        if (!eposta){ mesaj(arka, t.zorunluEposta, false); return; }
        kilitle();
        try {
          const { error } = await sb.auth.resetPasswordForEmail(eposta);
          if (error) throw error;
          mesaj(arka, t.sifirlaBilgi, true);
        } catch (e){ mesaj(arka, hataCevir(e), false); }
        coz();
        return;
      }

      const sifre = q('#hS').value;

      /* Zorunlu alanlar. Kayıtta ad, ünvan, e-posta ve şifre istenir;
         Kurum / Okul isteğe bağlıdır. Her eksik alan için ayrı ve somut
         bir mesaj gösterilir, tek bir "form eksik" uyarısı değil. */
      if (kayitMi){
        if (!q('#hAd').value.trim()){ mesaj(arka, t.zorunluAd, false); q('#hAd').focus(); return; }
        if (!q('#hUn').value)       { mesaj(arka, t.zorunluUnvan, false); q('#hUn').focus(); return; }
      }
      if (!eposta){ mesaj(arka, t.zorunluEposta, false); q('#hE').focus(); return; }
      if (kayitMi ? sifre.length < 8 : !sifre){
        mesaj(arka, t.zorunluSifre, false); q('#hS').focus(); return;
      }
      if (kayitMi && sifre !== q('#hS2').value){
        mesaj(arka, t.sifreUyum, false); q('#hS2').focus(); return;
      }

      kilitle();
      try {
        if (kayitMi){
          /* Ad, ünvan ve kurum auth metadata'sına yazılır; profil satırını
             veritabanı tarafındaki tetikleyici bundan doldurur. */
          const { data, error } = await sb.auth.signUp({
            email: eposta, password: sifre,
            options: { data: {
              display_name: q('#hAd').value.trim(),
              title:        q('#hUn').value,
              organization: q('#hKu').value.trim(),
            } },
          });
          if (error) throw error;

          /* Supabase, kayıtlı bir e-postayla tekrar kayıt olunduğunda
             güvenlik gereği hata döndürmez; hesabın var olduğunu ele
             vermemek için normal bir yanıt verir. Ayırt edici işaret
             BOŞ identities dizisidir. */
          const zatenVar = data && data.user && Array.isArray(data.user.identities)
                           && data.user.identities.length === 0;
          if (zatenVar){
            mesaj(arka, t.hataKayitli, false);
            const onceki = arka.querySelector('#hTekrarSar'); if (onceki) onceki.remove();
            const sar = document.createElement('div');
            sar.className = 'hDug tek'; sar.id = 'hTekrarSar';
            sar.appendChild(tekrarDug(arka, eposta));
            arka.querySelector('.hKart').appendChild(sar);
            coz(); return;
          }

          basariEkrani(arka, eposta);   // düğme artık yok, kilit de gereksiz
        } else {
          const { error } = await sb.auth.signInWithPassword({ email:eposta, password:sifre });
          if (error) throw error;
          kapat();
        }
      } catch (e){ mesaj(arka, hataCevir(e), false); coz(); }
    };
  }


  /* ── yorum ── */
  async function kendiYorumu(){
    if (!kullanici) return null;
    const { data } = await sb.from('review').select('*').eq('user_id', kullanici.id).maybeSingle();
    return data || null;
  }

  /* ══ ROTA BİTİŞ EKRANI ══
     Bir rota tamamlanınca çıkar. Amaç kutlamak ve o anda, deneyim tazeyken
     değerlendirme istemek. Zorunlu değil: "Şimdi değil" ile geçilebilir,
     ama index.html her rota için yalnızca BİR KEZ gösterir. */
  function rotaTebrik(o){
    o = o || {};
    const arka = kart(`
      <div class="hTebrik">
        <div class="hTebrikIkon">${o.ikon || '◆'}</div>
        <h3>${t.rotaBas}</h3>
        <div class="hTebrikAd">${kacir(o.ad || '')}</div>
        <div class="hTebrikSay">${(t.rotaAlt || '# ders · # XP')
          .replace('#', o.ders || 0).replace('#', o.xp || 0)}</div>
      </div>
      <p class="alt" style="margin-top:18px">${t.rotaSor}</p>
      <div class="hDug">
        <button id="hSonra">${t.rotaSonra}</button>
        <button id="hDegerlendir" class="ana">${kullanici ? t.yorumBas : t.rotaGiris}</button>
      </div>`);
    arka.querySelector('#hSonra').onclick = kapat;
    arka.querySelector('#hDegerlendir').onclick = () =>
      kullanici ? yorumEkrani() : girisEkrani(true);
  }

  async function yorumEkrani(){
    if (!kullanici) return girisEkrani(false);
    const mevcut = await kendiYorumu();
    const durumYazi = mevcut
      ? { pending:t.durumBekliyor, approved:t.durumOnayli, rejected:t.durumRed }[mevcut.status]
      : '';
    let puan = mevcut ? mevcut.rating : 0;

    const arka = kart(`
      <h3>${t.yorumBas}</h3>
      <p class="alt">${t.yorumAlt}</p>
      ${durumYazi ? `<div class="hMesaj ${mevcut.status==='approved'?'iyi':''}">${durumYazi}</div>` : ''}
      <label>${t.ad}</label>
      <input id="hAd" maxlength="40" value="${kacir(mevcut ? mevcut.display_name : '')}">
      <label>${t.puanEt}</label>
      <div class="hYildiz" id="hY">${yildizHTML(puan)}</div>
      <label>${t.yorumMetin}</label>
      <textarea id="hM" maxlength="600">${kacir(mevcut ? (mevcut.body || '') : '')}</textarea>
      <div class="hDug">
        ${mevcut ? `<button id="hSil" class="teh">${t.sil}</button>` : ''}
        <button id="hIptal">${t.iptal}</button>
        <button id="hTamam" class="ana">${mevcut ? t.guncelle : t.gonder}</button>
      </div>`);

    arka.querySelector('#hY').onclick = e => {
      const p = +(e.target.dataset.p || 0);
      if (!p) return;
      puan = p;
      arka.querySelector('#hY').innerHTML = yildizHTML(puan);
    };
    arka.querySelector('#hIptal').onclick = kapat;
    if (mevcut) arka.querySelector('#hSil').onclick = async () => {
      await sb.from('review').delete().eq('user_id', kullanici.id);
      kapat(); duyur();
    };
    arka.querySelector('#hTamam').onclick = async () => {
      const ad = arka.querySelector('#hAd').value.trim();
      const metin = arka.querySelector('#hM').value.trim();
      if (ad.length < 2) return mesaj(arka, t.ad + ': 2-40', false);
      if (!puan) return mesaj(arka, t.puanEt, false);
      const satir = { user_id:kullanici.id, rating:puan, body:metin || null,
                      display_name:ad, status:'pending' };
      try {
        const { error } = mevcut
          ? await sb.from('review').update({ rating:puan, body:metin || null, display_name:ad })
                    .eq('user_id', kullanici.id)
          : await sb.from('review').insert(satir);
        if (error) throw error;
        kapat(); duyur();
      } catch (e){ mesaj(arka, hataCevir(e), false); }
    };
  }

  /* ══ HESAP EKRANI ══
     "Hesabını istediğin zaman silebilirsin" cümlesi kayıt penceresinde,
     kilit ekranında ve gönderilen doğrulama e-postalarında yazıyordu ama
     silme diye bir şey yoktu. Bu yalnızca eksik özellik değil: GDPR 17.
     madde ve KVKK silme hakkını zaten zorunlu kılıyor.

     Silme geri alınamaz olduğu için tek tıkla yapılmıyor: kullanıcının
     kendi e-posta adresini yazması isteniyor. Onay kutusu ya da "emin
     misin" penceresi refleksle geçilir, adres yazmak geçilmez. */
  async function hesabimEkrani(){
    if (!kullanici) return girisEkrani(false);

    const eposta = kullanici.email || '';
    const tarih  = kullanici.created_at
      ? new Date(kullanici.created_at).toLocaleDateString(t === M.en ? 'en-GB' : 'tr-TR',
          { year:'numeric', month:'long', day:'numeric' })
      : '—';

    const arka = kart(`
      <h3>${t.hesabim}</h3>
      <div class="hSatir"><span>${t.hesapEposta}</span><b>${kacir(eposta)}</b></div>
      <div class="hSatir"><span>${t.hesapUyeBas}</span><b>${kacir(tarih)}</b></div>
      <div class="hTehlike">
        <h4>${t.tehlike}</h4>
        <p>${t.tehlikeAlt}</p>
        <label for="hSilE">${t.tehlikeOnay}</label>
        <input type="text" id="hSilE" autocomplete="off" spellcheck="false" placeholder="${kacir(eposta)}">
        <button id="hSilDug" disabled>${t.tehlikeDug}</button>
      </div>
      <div class="hDug tek"><button id="hIptal">${t.kapat}</button></div>`);

    arka.querySelector('#hIptal').onclick = kapat;

    const kutu = arka.querySelector('#hSilE');
    const dug  = arka.querySelector('#hSilDug');
    const uyar = () => { dug.disabled = kutu.value.trim().toLowerCase() !== eposta.toLowerCase(); };
    kutu.oninput = uyar;

    let calisiyor = false;
    dug.onclick = async () => {
      if (calisiyor || dug.disabled) return;
      if (kutu.value.trim().toLowerCase() !== eposta.toLowerCase()){
        mesaj(arka, t.tehlikeYanlis, false); return;
      }
      calisiyor = true; dug.disabled = true; dug.textContent = t.siliniyor;
      try {
        const { error } = await sb.rpc('delete_own_account');
        if (error) throw error;
        /* Oturum sunucuda artık geçersiz. Çıkışta olduğu gibi ağ
           beklenmiyor: yerel anahtarlar silinip sayfa yenileniyor. */
        try {
          Object.keys(localStorage)
            .filter(k => k.indexOf('sb-') === 0)
            .forEach(k => localStorage.removeItem(k));
        } catch (e){}
        alert(t.silindi);
        location.href = 'index.html';
      } catch (e){
        mesaj(arka, hataCevir(e), false);
        calisiyor = false; dug.disabled = false; dug.textContent = t.tehlikeDug;
      }
    };
  }

  /* ── moderasyon ──
     ÖNCE PENCERE, SONRA VERİ.
     Eski sürüm ilk satırda sorguyu `await` ediyor ve pencereyi ancak sorgu
     döndükten sonra çiziyordu. Sorgu takılır ya da hata verirse düğmeye
     basıldığında ekranda hiçbir şey olmuyordu; kullanıcı düğmenin bozuk
     olduğunu sanıyordu. Aynı hata çıkış düğmesinde de vardı.

     Artık pencere hemen açılıyor, içine "Yükleniyor" yazıyor, veri gelince
     doluyor. Hata gelirse hata metni pencerenin içinde görünüyor. */
  async function modEkrani(){
    const arka = kart(`
      <h3>${t.modBas}</h3>
      <p class="alt" id="mDurum">${t.modYukleniyor}</p>
      <div id="mListe"></div>
      <div class="hDug"><button id="hIptal">${t.kapat}</button></div>`, true);
    arka.querySelector('#hIptal').onclick = kapat;

    const durum = arka.querySelector('#mDurum');
    const yer   = arka.querySelector('#mListe');

    let data = null, error = null;
    try {
      ({ data, error } = await sb.from('review').select('*')
        .eq('status','pending').order('created_at'));
    } catch (e){ error = e; }

    /* Pencere kapanmış olabilir: kullanıcı beklerken Escape'e basmıştır. */
    if (!document.body.contains(arka)) return;

    if (error){ durum.textContent = hataCevir(error); return; }

    const kayitlar = data || [];
    durum.textContent = kayitlar.length
      ? t.modSayi.replace('#', kayitlar.length)
      : t.modYok;

    yer.innerHTML = kayitlar.map(r => `
      <div class="hMod" data-id="${r.id}">
        <div class="ust"><span class="ad">${kacir(r.display_name)}</span>
          <span class="p">${'★'.repeat(r.rating || 0)}${'☆'.repeat(5 - (r.rating || 0))}</span></div>
        ${r.body ? `<p>${kacir(r.body)}</p>` : ''}
        <div class="hDug">
          <button class="teh" data-is="red">${t.reddet}</button>
          <button class="ana" data-is="onay">${t.onayla}</button>
        </div>
      </div>`).join('');

    yer.querySelectorAll('.hMod button').forEach(d => {
      d.onclick = async () => {
        const kutu = d.closest('.hMod');
        kutu.querySelectorAll('button').forEach(x => x.disabled = true);
        const { error: hata } = await sb.from('review')
          .update({ status: d.dataset.is === 'onay' ? 'approved' : 'rejected' })
          .eq('id', kutu.dataset.id);
        if (hata){
          durum.textContent = hataCevir(hata);
          kutu.querySelectorAll('button').forEach(x => x.disabled = false);
          return;
        }
        bekleyen = await bekleyenSayisi();
        cubukCiz(); duyur();
        modEkrani();
      };
    });
  }

  /* ── üst çubuk ── */
  function cubukCiz(){
    const yer = document.getElementById('hesapCubuk');
    if (!yer) return;
    if (!kullanici){
      /* Üst çubukta TEK düğme. Pencerede zaten "Giriş yap | Kayıt ol"
         sekmesi var, iki düğme çubuğu kalabalıklaştırıyordu. */
      yer.innerHTML = `<button id="hbGiris" class="birincil">${t.giris}</button>`;
      yer.querySelector('#hbGiris').onclick = () => girisEkrani(false);
    } else {
      yer.innerHTML =
        `<button id="hbHesap">${t.hesabim}</button>` +
        `<button id="hbYorum" class="vurgu">${t.yorumBas}</button>` +
        (moderator ? `<button id="hbMod"${bekleyen ? ' class="bekler"' : ''}>${t.modBas}` +
             (bekleyen ? ` <b>${bekleyen}</b>` : '') + `</button>` : '') +
        `<button id="hbCikis">${t.cikis}</button>`;
      yer.querySelector('#hbHesap').onclick = hesabimEkrani;
      yer.querySelector('#hbYorum').onclick = yorumEkrani;
      if (moderator) yer.querySelector('#hbMod').onclick = modEkrani;
      /* ÇIKIŞ · AĞ İSTEĞİ BEKLENMEZ.
         İki sürüm boyunca çalışmadı, sebebi her seferinde aynıydı: kod
         `await sb.auth.signOut()` diyordu ve o istek yanıt vermediğinde
         (belirteç sunucuda geçersiz, ağ takılı, uç yavaş) sonraki satırlar
         hiç çalışmıyordu. Düğmeye basılıyor, hiçbir şey olmuyordu.

         Çıkış yerel bir karardır: kullanıcı "beni çıkar" dediğinde sunucunun
         iznini beklemenin anlamı yok. Bu yüzden sıra şu:
           1 · supabase-js'in oturum anahtarları localStorage'dan SİLİNİR
           2 · sunucudaki oturumu iptal isteği ARKA PLANDA gönderilir
           3 · sayfa yenilenir
         Ağ hiç cevap vermese bile kullanıcı çıkmış olur.

         Sayfa yenilemek kasıtlı: ders kilitleri, topluluk bölümü ve üst
         çubuk aynı anda ve tutarlı biçimde yeniden kuruluyor. */
      yer.querySelector('#hbCikis').onclick = () => {
        const dug = yer.querySelector('#hbCikis');
        dug.disabled = true;

        /* Arka planda; sonucu beklenmiyor, hatası yutuluyor. */
        try { Promise.resolve(sb.auth.signOut()).catch(() => {}); } catch (e){}

        /* Asıl çıkış burada. supabase-js oturumu 'sb-' ile başlayan
           anahtarlarda tutuyor. */
        try {
          Object.keys(localStorage)
            .filter(k => k.indexOf('sb-') === 0)
            .forEach(k => localStorage.removeItem(k));
        } catch (e){}

        kullanici = null; moderator = false; bekleyen = 0;
        location.reload();
      };
    }
  }

  const duyur = () => dinleyiciler.forEach(f => { try { f(); } catch(e){} });
  const dinle = f => dinleyiciler.push(f);

  /* Moderatör mü?
     ESKİ SÜRÜM HATALIYDI: bekleyen yorumları sorgulayıp `Array.isArray(data)`
     diyordu. Boş dizi de dizidir, yani sonuç HER kullanıcı için true oluyordu
     ve "Onay bekleyen yorumlar" düğmesi herkese görünüyordu.

     Doğrusu veritabanındaki is_moderator() fonksiyonunu sormak. O fonksiyon
     security definer ve moderator tablosuna bakıyor; tabloyu kimse okuyamaz
     ama fonksiyon evet/hayır döndürebilir.

     Hata durumunda false döner, yani düğme gizlenir. Güvenli varsayılan bu:
     gerçek yetki zaten veritabanı politikalarında, buradaki kontrol sadece
     arayüzü sadeleştirmek için. */
  async function moderatorMu(){
    const { data, error } = await sb.rpc('is_moderator');
    if (error) return false;
    return data === true;
  }

  /* Kaç yorum onay bekliyor?
     Moderatör siteye girer girmez sayıyı düğmenin üstünde görsün diye.
     Sayıyı yalnızca moderatör alabilir: politika 'pending' satırları
     başkasına döndürmüyor, dolayısıyla bu sorgu başkası için 0 döner. */
  async function bekleyenSayisi(){
    const { count, error } = await sb.from('review')
      .select('id', { count:'exact', head:true }).eq('status','pending');
    return error ? 0 : (count || 0);
  }

  async function kur(o){
    o = o || {};
    t = M[o.dil === 'en' ? 'en' : 'tr'];
    saglayicilar = o.saglayicilar || ['email'];
    if (!o.url || !o.anonKey || typeof window.supabase === 'undefined') return;
    /* Sayfadaki TEK istemci. Ayrıntı yapilandirma.js içindeki SUPA.istemci
       notunda: iki istemci birbirine kimlik olayı yayıp döngü kuruyordu. */
    sb = (typeof SUPA !== 'undefined' && SUPA.istemci)
       ? SUPA.istemci()
       : window.supabase.createClient(o.url, o.anonKey);
    if (!sb) return;

    const uygula = async oturum => {
      kullanici = oturum ? oturum.user : null;
      moderator = kullanici ? await moderatorMu() : false;
      bekleyen = moderator ? await bekleyenSayisi() : 0;
      cubukCiz(); duyur();
    };
    const { data } = await sb.auth.getSession();
    await uygula(data ? data.session : null);
    sb.auth.onAuthStateChange((_, oturum) => uygula(oturum));
  }

  /* Dil çubuğundan değişince giriş/yorum ekranlarının dili de değişsin. */
  function dil(d){ t = M[d === 'en' ? 'en' : 'tr']; cubukCiz(); }

  return { kur, dinle, dil, girisEkrani, kilitEkrani, yorumEkrani, modEkrani,
           hesabimEkrani, rotaTebrik,
           get girisli(){ return !!kullanici; },
           get kullanici(){ return kullanici; }, get moderator(){ return moderator; } };
})();

if (typeof module !== 'undefined') module.exports = HESAP;
