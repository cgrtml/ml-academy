/* ML Academy · yorum bildirimi
   ─────────────────────────────────────────────────────────────────────
   `review` tablosuna yeni bir satır düştüğünde ya da mevcut bir yorum
   düzenlenip tekrar sıraya girdiğinde moderatöre e-posta atar.

   Tetikleyen: Supabase Database Webhook (review · INSERT + UPDATE)
   Gönderen  : Resend, noreply@mltraining.org

   ── GÜVENLİK ──
   Bu uç herkese açık bir adres. JWT doğrulaması KAPALI dağıtılıyor
   (`--no-verify-jwt`), çünkü projenin yeni biçim publishable anahtarı
   JWT değil ve doğrulamadan geçmiyor. Onun yerine paylaşılan bir gizli
   başlık kontrol ediliyor: webhook `x-webhook-secret` gönderir, fonksiyon
   kendi ortam değişkeniyle karşılaştırır. Eşleşmezse 401 döner.

   Bu şart olmadan herhangi biri uca istek atıp sana sahte bildirim
   yağdırabilirdi.

   ── NEDEN E-POSTA GÖVDESİNDE YORUM METNİ VAR ──
   Moderatörün karar vermek için siteye girmesi gerekmesin diye. Onay ve
   ret işlemi yine sitede yapılıyor; e-posta yalnızca haber veriyor.

   ── ORTAM DEĞİŞKENLERİ ──
   RESEND_API_KEY  · Resend API anahtarı (re_...)
   WEBHOOK_SECRET  · webhook ile paylaşılan gizli dize
   MOD_EPOSTA      · bildirimin gideceği adres
*/

const RESEND  = Deno.env.get('RESEND_API_KEY')  ?? '';
const GIZLI   = Deno.env.get('WEBHOOK_SECRET')  ?? '';
const ALICI   = Deno.env.get('MOD_EPOSTA')      ?? 'cagritemel34@gmail.com';

const kacir = (s: unknown) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;')
                 .replace(/>/g, '&gt;').replace(/"/g, '&quot;');

Deno.serve(async (istek) => {
  if (istek.method !== 'POST') return new Response('method not allowed', { status: 405 });

  /* Gizli başlık kontrolü. GIZLI tanımlı değilse uç kapalı sayılır:
     yanlışlıkla korumasız açık kalmasındansa hiç çalışmaması iyidir. */
  if (!GIZLI || istek.headers.get('x-webhook-secret') !== GIZLI){
    return new Response('unauthorized', { status: 401 });
  }

  let gelen: any;
  try { gelen = await istek.json(); }
  catch { return new Response('bad json', { status: 400 }); }

  const satir = gelen?.record;
  const eski  = gelen?.old_record;
  if (!satir) return new Response('no record', { status: 400 });

  /* Yalnızca ONAY BEKLEYEN duruma geçişte haber ver.
     Moderatörün kendi onay/ret işlemi de UPDATE üretiyor; onlar için
     e-posta atmak gereksiz gürültü olurdu. */
  const bekliyor = satir.status === 'pending';
  const yeniyseVeyaSirayaDondu = !eski || eski.status !== 'pending';
  if (!bekliyor || !yeniyseVeyaSirayaDondu){
    return new Response(JSON.stringify({ atlandi: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const yildiz = '★'.repeat(satir.rating ?? 0) + '☆'.repeat(5 - (satir.rating ?? 0));
  const duzenleme = !!eski;

  const html = `
  <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;
              max-width:560px;margin:0 auto;padding:26px">
    <div style="font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11px;
                letter-spacing:.24em;color:#0a8b68;font-weight:700">ML ACADEMY</div>
    <h2 style="margin:12px 0 4px;font-size:19px;color:#0f1b2d">
      ${duzenleme ? 'Bir yorum düzenlendi' : 'Yeni bir yorum geldi'}
    </h2>
    <p style="margin:0 0 20px;font-size:14px;color:#586a80">
      Onay bekliyor. Yayına çıkması için siteden onaylaman gerekiyor.
    </p>

    <div style="border:1px solid #dde5ef;border-radius:12px;padding:16px 18px;background:#f6f8fc">
      <div style="display:flex;justify-content:space-between;gap:12px">
        <b style="color:#0f1b2d;font-size:15px">${kacir(satir.display_name)}</b>
        <span style="color:#e0930b;letter-spacing:.09em">${yildiz}</span>
      </div>
      ${satir.body
        ? `<p style="margin:11px 0 0;font-size:14px;line-height:1.65;color:#3d4f66">${kacir(satir.body)}</p>`
        : `<p style="margin:11px 0 0;font-size:13px;color:#8494a8">(yorum metni yok, yalnızca puan)</p>`}
    </div>

    <p style="margin:22px 0 0">
      <a href="https://mltraining.org"
         style="display:inline-block;background:#1668c9;color:#fff;text-decoration:none;
                padding:12px 24px;border-radius:10px;font-weight:700;font-size:14px">
        Siteye git ve incele
      </a>
    </p>

    <p style="margin:22px 0 0;font-size:12px;line-height:1.6;color:#8494a8">
      Onaylanana kadar bu yorum hiç kimseye görünmüyor. Bot ya da sahte
      hesap saldırısında da durum aynı: yayına çıkan tek şey senin
      onayladığın yorumlar.
    </p>
  </div>`;

  const yanit = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RESEND}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'ML Academy <noreply@mltraining.org>',
      to: [ALICI],
      subject: duzenleme
        ? 'ML Academy · bir yorum düzenlendi, onay bekliyor'
        : 'ML Academy · yeni yorum onay bekliyor',
      html,
    }),
  });

  if (!yanit.ok){
    /* Hata gövdesini logla ama 200 dön: webhook'un tekrar tekrar denemesi
       yorum kaydını etkilemez, sadece gürültü üretir. */
    console.error('resend hatasi', yanit.status, await yanit.text());
    return new Response(JSON.stringify({ gonderildi: false }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ gonderildi: true }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
