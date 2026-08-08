/* ML Academy · hesap katmanı: giriş, kayıt, yorum, moderasyon
   Supabase Auth üzerine ince bir sarmalayıcı. Yapılandırma yoksa hiçbir istek
   atmaz ve arayüzde hiçbir şey göstermez, yani site eskisi gibi çalışır.

   Kullanım (index.html içinde):
     <script src="topluluk/hesap.js"></script>
     <script>HESAP.kur({ url:SUPA.url, anonKey:SUPA.anonKey, dil:DIL });</script>   */

const HESAP = (() => {

  const M = {
    tr: {
      giris:'Giriş yap', kayit:'Ücretsiz hesap aç', cikis:'Çıkış',
      eposta:'e-posta', sifre:'şifre', sifreAz:'en az 8 karakter',
      girisBas:'Tekrar hoş geldin', girisAlt:'Kaldığın yerden devam et.',
      kayitBas:'Ücretsiz hesap aç', kayitAlt:'113 dersin tamamı açılır. Kart istenmez.',
      gecis1:'Hesabın yok mu?  Kayıt ol', gecis2:'Zaten hesabın var mı?  Giriş yap',
      goster:'göster', gizle:'gizle',
      artiBas:'Hesapla birlikte',
      arti:['113 dersin tamamı', 'İlerlemen cihazlar arası saklanır', 'Ücretsiz, istediğin an sil'],
      dogrula:'E-postana bir doğrulama bağlantısı gönderdik. Onayladıktan sonra giriş yapabilirsin.',
      hata:'Bir şey ters gitti',
      yorumBas:'Deneyimini yaz',
      yorumAlt:'Yorumun okunduktan sonra yayımlanır. İstediğin zaman değiştirebilirsin.',
      ad:'görünecek ad', puanEt:'puanın', yorumMetin:'yorumun (isteğe bağlı)',
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
                'Hangi soruların bozuk olduğunu görüp dersleri düzeltiyoruz.',
                'Ücretsiz, ve istediğin an silebilirsin.'],
      modBas:'Onay bekleyen yorumlar', modYok:'Bekleyen yorum yok.',
      onayla:'Onayla', reddet:'Reddet',
    },
    en: {
      giris:'Sign in', kayit:'Create free account', cikis:'Sign out',
      eposta:'email', sifre:'password', sifreAz:'at least 8 characters',
      girisBas:'Welcome back', girisAlt:'Pick up where you left off.',
      kayitBas:'Create a free account', kayitAlt:'All 113 lessons unlock. No card needed.',
      gecis1:'No account yet?  Sign up', gecis2:'Already have an account?  Sign in',
      goster:'show', gizle:'hide',
      artiBas:'With an account',
      arti:['All 113 lessons', 'Progress kept across devices', 'Free, delete it any time'],
      dogrula:'We sent a confirmation link to your email. You can sign in once you confirm it.',
      hata:'Something went wrong',
      yorumBas:'Write about your experience',
      yorumAlt:'Your review is published after it has been read. You can change it any time.',
      ad:'display name', puanEt:'your rating', yorumMetin:'your review (optional)',
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
                'We see which questions are broken and fix the lessons.',
                'It is free, and you can delete it whenever you like.'],
      modBas:'Reviews awaiting approval', modYok:'Nothing pending.',
      onayla:'Approve', reddet:'Reject',
    },
  };

  let sb = null, t = M.tr, kullanici = null, moderator = false;
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
      .hArka{position:fixed;inset:0;background:rgba(4,7,12,.86);z-index:9100;
        display:flex;align-items:center;justify-content:center;padding:20px;overflow-y:auto}
      .hKart{background:var(--panel,#0f151e);border:1px solid var(--line,#1e2a3a);
        border-radius:20px;max-width:428px;width:100%;padding:34px 32px 28px;margin:auto;
        color:var(--txt,#e6edf3);font-size:15px;
        box-shadow:0 24px 60px rgba(0,0,0,.5)}
      .hKart .marka{font-family:var(--mono,monospace);font-size:10px;letter-spacing:.26em;
        text-transform:uppercase;color:var(--mut,#8494a8);text-align:center;margin-bottom:18px}
      .hArti{margin:18px 0 0;padding:0;list-style:none}
      .hArti li{display:flex;gap:10px;align-items:flex-start;color:var(--mut,#8494a8);
        font-size:13.5px;line-height:1.6;margin-top:8px}
      .hArti li::before{content:'✓';color:var(--green,#22d3a0);font-weight:800;flex:none}
      .hSifreSar{position:relative}
      .hSifreSar button{position:absolute;right:10px;top:50%;transform:translateY(-50%);
        background:none;border:0;color:var(--mut,#8494a8);font-family:var(--mono,monospace);
        font-size:10.5px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;padding:4px 6px}
      .hKart.genis{max-width:680px}
      .hKart h3{margin:0 0 7px;font-size:25px;font-weight:850;letter-spacing:-.03em;text-align:center}
      .hKart .alt{color:var(--mut,#8494a8);font-size:14px;margin:0 0 22px;text-align:center;line-height:1.6}
      .hKart label{display:block;font-family:var(--mono,monospace);font-size:10.5px;
        letter-spacing:.16em;text-transform:uppercase;color:var(--mut,#8494a8);margin:14px 0 6px}
      .hKart input,.hKart textarea{width:100%;background:var(--bg,#080b11);
        border:1px solid var(--line,#1e2a3a);border-radius:10px;padding:11px 13px;
        color:var(--txt,#e6edf3);font-family:inherit;font-size:15px}
      .hKart textarea{resize:vertical;min-height:88px;line-height:1.6}
      .hKart input:focus,.hKart textarea:focus{outline:none;border-color:var(--blue,#4cc4ff)}
      .hDug{display:flex;gap:10px;margin-top:20px}
      .hDug button{flex:1;padding:12px 16px;border-radius:11px;font-size:14.5px;font-weight:700;
        cursor:pointer;border:1px solid var(--line,#1e2a3a);background:var(--panel2,#141c28);
        color:var(--txt,#e6edf3);font-family:inherit}
      .hDug button.ana{background:var(--green,#22d3a0);border-color:var(--green,#22d3a0);color:#04120d}
      .hDug button.ana:hover{filter:brightness(1.08)}
      .hDug.tek button{flex:1}
      .hDug button.teh{color:var(--red,#f87171);border-color:rgba(248,113,113,.4)}
      .hDug button:hover{border-color:var(--mut,#8494a8)}
      .hGecis{display:block;text-align:center;margin-top:15px;font-size:13px;
        color:var(--blue,#4cc4ff);cursor:pointer}
      .hAyrac{display:flex;align-items:center;gap:12px;margin:20px 0 4px;
        color:var(--mut,#8494a8);font-size:12px}
      .hAyrac::before,.hAyrac::after{content:'';flex:1;height:1px;background:var(--line,#1e2a3a)}
      .hSos{display:flex;flex-direction:column;gap:9px;margin-top:12px}
      .hSos button{display:flex;align-items:center;justify-content:center;gap:10px;
        padding:12px 16px;border-radius:12px;font-size:14.5px;font-weight:600;cursor:pointer;
        border:1px solid var(--line,#1e2a3a);background:var(--panel2,#141c28);
        color:var(--txt,#e6edf3);font-family:inherit}
      .hSos svg{width:18px;height:18px;flex:none}
      .hSos button:hover{border-color:var(--mut,#8494a8)}
      .hKilitMad{margin:14px 0 0;padding-left:18px;color:var(--mut,#8494a8);
        font-size:13.5px;line-height:1.9}
      .hMesaj{margin-top:14px;padding:10px 13px;border-radius:10px;font-size:13.5px;line-height:1.55}
      .hMesaj.iyi{background:rgba(34,211,160,.1);color:var(--green,#22d3a0)}
      .hMesaj.kotu{background:rgba(248,113,113,.1);color:var(--red,#f87171)}
      .hYildiz{display:flex;gap:6px;margin-top:6px}
      .hYildiz span{font-size:30px;color:var(--line,#1e2a3a);cursor:pointer;line-height:1}
      .hYildiz span.dolu{color:var(--yellow,#facc15)}
      .hUst{display:flex;gap:9px;align-items:center}
      .hUst button{background:none;border:1px solid var(--line,#1e2a3a);color:var(--mut,#8494a8);
        font-family:var(--mono,monospace);font-size:11px;padding:6px 12px;border-radius:8px;cursor:pointer}
      .hUst button:hover{color:var(--txt,#e6edf3);border-color:var(--mut,#8494a8)}
      .hUst button.vurgu{color:var(--green,#22d3a0);border-color:rgba(34,211,160,.4)}
      .hMod{border:1px solid var(--line,#1e2a3a);border-radius:12px;padding:14px 16px;margin-bottom:10px}
      .hMod .ust{display:flex;justify-content:space-between;align-items:center;gap:10px}
      .hMod .ad{font-weight:700}
      .hMod .p{color:var(--yellow,#facc15);letter-spacing:.1em}
      .hMod p{margin:8px 0 0;color:var(--mut,#8494a8);font-size:14px;line-height:1.6}
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
    arka.innerHTML = `<div class="hKart${genis ? ' genis' : ''}">${icerik}</div>`;
    arka.addEventListener('mousedown', e => { if (e.target === arka) kapat(); });
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
        } catch (e){ mesaj(arka, e.message || t.hata, false); }
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
  function girisEkrani(kayitMi){
    const arka = kart(`
      <div class="marka">ML Academy</div>
      <h3>${kayitMi ? t.kayitBas : t.girisBas}</h3>
      <p class="alt">${kayitMi ? t.kayitAlt : t.girisAlt}</p>
      ${sosyalHTML()}
      <label>${t.eposta}</label>
      <input type="email" id="hE" autocomplete="email" placeholder="ad@ornek.com">
      <label>${t.sifre}${kayitMi ? ' · ' + t.sifreAz : ''}</label>
      <div class="hSifreSar">
        <input type="password" id="hS" autocomplete="${kayitMi?'new-password':'current-password'}">
        <button type="button" id="hGoz">${t.goster}</button>
      </div>
      <div class="hDug tek">
        <button id="hTamam" class="ana">${kayitMi ? t.kayit : t.giris}</button>
      </div>
      ${kayitMi ? `<div style="margin-top:20px"><div class="marka" style="text-align:left;margin-bottom:0">${t.artiBas}</div>
        <ul class="hArti">${t.arti.map(x => '<li>'+x+'</li>').join('')}</ul></div>` : ''}
      <span class="hGecis" id="hGecis">${kayitMi ? t.gecis2 : t.gecis1}</span>`);

    sosyalBagla(arka);
    const gz = arka.querySelector('#hGoz');
    gz.onclick = () => { const i = arka.querySelector('#hS');
      const gizli = i.type === 'password';
      i.type = gizli ? 'text' : 'password';
      gz.textContent = gizli ? t.gizle : t.goster; };
    arka.querySelector('#hE').addEventListener('keydown', e => {
      if (e.key === 'Enter') arka.querySelector('#hS').focus(); });
    arka.querySelector('#hS').addEventListener('keydown', e => {
      if (e.key === 'Enter') arka.querySelector('#hTamam').click(); });
    setTimeout(() => arka.querySelector('#hE').focus(), 30);
    arka.querySelector('#hGecis').onclick = () => girisEkrani(!kayitMi);
    arka.querySelector('#hTamam').onclick = async () => {
      const eposta = arka.querySelector('#hE').value.trim();
      const sifre  = arka.querySelector('#hS').value;
      if (!eposta || !sifre) return;
      try {
        if (kayitMi){
          const { error } = await sb.auth.signUp({ email:eposta, password:sifre });
          if (error) throw error;
          mesaj(arka, t.dogrula, true);
        } else {
          const { error } = await sb.auth.signInWithPassword({ email:eposta, password:sifre });
          if (error) throw error;
          kapat();
        }
      } catch (e){ mesaj(arka, e.message || t.hata, false); }
    };
  }

  /* ── yorum ── */
  async function kendiYorumu(){
    if (!kullanici) return null;
    const { data } = await sb.from('review').select('*').eq('user_id', kullanici.id).maybeSingle();
    return data || null;
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
      } catch (e){ mesaj(arka, e.message || t.hata, false); }
    };
  }

  /* ── moderasyon ── */
  async function modEkrani(){
    const { data } = await sb.from('review').select('*')
      .eq('status','pending').order('created_at');
    const liste = (data || []).map(r => `
      <div class="hMod" data-id="${r.id}">
        <div class="ust"><span class="ad">${kacir(r.display_name)}</span>
          <span class="p">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</span></div>
        ${r.body ? `<p>${kacir(r.body)}</p>` : ''}
        <div class="hDug">
          <button class="teh" data-is="red">${t.reddet}</button>
          <button class="ana" data-is="onay">${t.onayla}</button>
        </div>
      </div>`).join('');

    const arka = kart(`
      <h3>${t.modBas}</h3>
      <p class="alt">${(data || []).length || t.modYok}</p>
      ${liste}
      <div class="hDug"><button id="hIptal">${t.kapat}</button></div>`, true);

    arka.querySelector('#hIptal').onclick = kapat;
    arka.querySelectorAll('.hMod button').forEach(d => {
      d.onclick = async () => {
        const id = d.closest('.hMod').dataset.id;
        await sb.from('review')
          .update({ status: d.dataset.is === 'onay' ? 'approved' : 'rejected' })
          .eq('id', id);
        modEkrani(); duyur();
      };
    });
  }

  /* ── üst çubuk ── */
  function cubukCiz(){
    const yer = document.getElementById('hesapCubuk');
    if (!yer) return;
    if (!kullanici){
      yer.innerHTML = `<button id="hbGiris">${t.giris}</button>`;
      yer.querySelector('#hbGiris').onclick = () => girisEkrani(false);
    } else {
      yer.innerHTML =
        `<button id="hbYorum" class="vurgu">${t.yorumBas}</button>` +
        (moderator ? `<button id="hbMod">${t.modBas}</button>` : '') +
        `<button id="hbCikis">${t.cikis}</button>`;
      yer.querySelector('#hbYorum').onclick = yorumEkrani;
      if (moderator) yer.querySelector('#hbMod').onclick = modEkrani;
      yer.querySelector('#hbCikis').onclick = async () => { await sb.auth.signOut(); };
    }
  }

  const duyur = () => dinleyiciler.forEach(f => { try { f(); } catch(e){} });
  const dinle = f => dinleyiciler.push(f);

  /* Moderatör mü? Doğrudan sorulamaz (tabloya kimseye yetki yok),
     bekleyen yorum sorgusu üzerinden dolaylı anlaşılır: politika yalnızca
     moderatöre 'pending' satır döndürür, diğerlerine boş küme döner.
     Boş küme moderatör olmadığını KANITLAMAZ; yalnızca düğmeyi göstermek
     için kullanılıyor, gerçek yetki her hâlükârda veritabanında. */
  async function moderatorMu(){
    const { data, error } = await sb.from('review').select('id').eq('status','pending').limit(1);
    if (error) return false;
    return Array.isArray(data);
  }

  async function kur(o){
    o = o || {};
    t = M[o.dil === 'en' ? 'en' : 'tr'];
    saglayicilar = o.saglayicilar || ['email'];
    if (!o.url || !o.anonKey || typeof window.supabase === 'undefined') return;
    sb = window.supabase.createClient(o.url, o.anonKey);

    const uygula = async oturum => {
      kullanici = oturum ? oturum.user : null;
      moderator = kullanici ? await moderatorMu() : false;
      cubukCiz(); duyur();
    };
    const { data } = await sb.auth.getSession();
    await uygula(data ? data.session : null);
    sb.auth.onAuthStateChange((_, oturum) => uygula(oturum));
  }

  /* Dil çubuğundan değişince giriş/yorum ekranlarının dili de değişsin. */
  function dil(d){ t = M[d === 'en' ? 'en' : 'tr']; cubukCiz(); }

  return { kur, dinle, dil, girisEkrani, kilitEkrani, yorumEkrani, modEkrani,
           get girisli(){ return !!kullanici; },
           get kullanici(){ return kullanici; }, get moderator(){ return moderator; } };
})();

if (typeof module !== 'undefined') module.exports = HESAP;
