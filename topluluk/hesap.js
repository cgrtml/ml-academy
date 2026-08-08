/* ML Academy · hesap katmanı: giriş, kayıt, yorum, moderasyon
   Supabase Auth üzerine ince bir sarmalayıcı. Yapılandırma yoksa hiçbir istek
   atmaz ve arayüzde hiçbir şey göstermez, yani site eskisi gibi çalışır.

   Kullanım (index.html içinde):
     <script src="topluluk/hesap.js"></script>
     <script>HESAP.kur({ url:SUPA.url, anonKey:SUPA.anonKey, dil:DIL });</script>   */

const HESAP = (() => {

  const M = {
    tr: {
      giris:'Giriş yap', kayit:'Kayıt ol', cikis:'Çıkış',
      eposta:'e-posta', sifre:'şifre', sifreAz:'en az 8 karakter',
      girisBas:'Giriş yap', kayitBas:'Hesap aç',
      gecis1:'Hesabın yok mu?', gecis2:'Zaten hesabın var mı?',
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
      modBas:'Onay bekleyen yorumlar', modYok:'Bekleyen yorum yok.',
      onayla:'Onayla', reddet:'Reddet',
    },
    en: {
      giris:'Sign in', kayit:'Sign up', cikis:'Sign out',
      eposta:'email', sifre:'password', sifreAz:'at least 8 characters',
      girisBas:'Sign in', kayitBas:'Create account',
      gecis1:'No account yet?', gecis2:'Already have an account?',
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
      modBas:'Reviews awaiting approval', modYok:'Nothing pending.',
      onayla:'Approve', reddet:'Reject',
    },
  };

  let sb = null, t = M.tr, kullanici = null, moderator = false;
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
        border-radius:18px;max-width:440px;width:100%;padding:28px;margin:auto;
        color:var(--txt,#e6edf3);font-size:15px}
      .hKart.genis{max-width:680px}
      .hKart h3{margin:0 0 6px;font-size:21px;font-weight:800;letter-spacing:-.02em}
      .hKart .alt{color:var(--mut,#8494a8);font-size:13.5px;margin:0 0 20px}
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
      .hDug button.teh{color:var(--red,#f87171);border-color:rgba(248,113,113,.4)}
      .hDug button:hover{border-color:var(--mut,#8494a8)}
      .hGecis{display:block;text-align:center;margin-top:15px;font-size:13px;
        color:var(--blue,#4cc4ff);cursor:pointer}
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

  /* ── giriş / kayıt ── */
  function girisEkrani(kayitMi){
    const arka = kart(`
      <h3>${kayitMi ? t.kayitBas : t.girisBas}</h3>
      <p class="alt">${kayitMi ? t.sifreAz : ''}</p>
      <label>${t.eposta}</label><input type="email" id="hE" autocomplete="email">
      <label>${t.sifre}</label><input type="password" id="hS" autocomplete="current-password">
      <div class="hDug">
        <button id="hIptal">${t.iptal}</button>
        <button id="hTamam" class="ana">${kayitMi ? t.kayit : t.giris}</button>
      </div>
      <span class="hGecis" id="hGecis">${kayitMi ? t.gecis2 : t.gecis1}</span>`);

    arka.querySelector('#hIptal').onclick = kapat;
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

  return { kur, dinle, girisEkrani, yorumEkrani, modEkrani,
           get kullanici(){ return kullanici; }, get moderator(){ return moderator; } };
})();

if (typeof module !== 'undefined') module.exports = HESAP;
