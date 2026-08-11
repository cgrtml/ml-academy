/* ML Academy · Supabase bağlantı ayarları
   Buradaki iki değer de AÇIKTIR ve açık olması tasarım gereğidir:
   publishable key sitenin JavaScript'ine gömülür, ziyaretçi tarayıcıda görebilir.
   Güvenlik anahtarın gizliliğine değil, veritabanındaki satır düzeyi güvenliğe
   (RLS) dayanır. Her tabloda RLS açık ve politikalar tanımlı.

   BURAYA ASLA `secret key` YAZILMAZ. O tam yetkilidir ve RLS'i baypas eder. */

const SUPA = {
  url:     'https://uhiwcrkwmyjzprmbuyja.supabase.co',
  anonKey: 'sb_publishable_meWKyqSOHhHvQjnjlyHLCg_9QGAvfOq',
};

/* Değerler dolu mu? Boşsa site Supabase'e hiç istek atmaz ve
   topluluk bölümü gizli kalır, yani hiçbir şey bozulmaz. */
SUPA.hazir = !!(SUPA.url && SUPA.anonKey);

/* Açık olan giriş sağlayıcıları. Supabase panelinde etkinleştirilmeden
   buraya eklenirse düğme çıkar ama tıklandığında hata döner; o yüzden
   listeyi ancak panelde açtıktan sonra genişlet.
   Kurulum: Authentication → Sign In / Providers → Google / GitHub
   Yönlendirme adresi: <proje-url>/auth/v1/callback  */
SUPA.saglayicilar = ['email'];        // 'google', 'github' eklenebilir

/* Her rotada üyeliksiz açılabilen ders sayısı.
   NOT: bu kilit yalnızca ARAYÜZDEDİR. Ders içeriği content.js içinde ve o
   dosya herkese açıktır; kararlı biri kilidi aşabilir. Amaç kayıt olmayı
   teşvik etmek, içeriği korumak değil. */
SUPA.ucretsizDers = 3;

/* ── TEK İSTEMCİ ──
   hesap.js ve topluluk.js ayrı ayrı createClient çağırıyordu. Aynı oturum
   anahtarını paylaşan iki Supabase istemcisi birbirine kimlik olayı yayıyor:
   her olay hesap.js'in dinleyicisini tetikliyor, dinleyici topluluk.js'i
   yeniden kuruyor, o da yeni bir istemci yaratıyor ve döngü kapanıyordu.
   Ana sayfadaki topluluk bölümünün sürekli yanıp sönmesinin sebebi buydu.

   Artık ikisi de bu fonksiyonu çağırıyor ve sayfa başına tek istemci var.
   Fonksiyon çağrı anında çalışıyor, yani supabase kütüphanesinin bu
   dosyadan önce ya da sonra yüklenmiş olması fark etmiyor. */
SUPA.istemci = function(){
  if (typeof window === 'undefined' || typeof window.supabase === 'undefined') return null;
  if (!window.__mlSb) window.__mlSb = window.supabase.createClient(SUPA.url, SUPA.anonKey);
  return window.__mlSb;
};

if (typeof module !== 'undefined') module.exports = SUPA;
