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

if (typeof module !== 'undefined') module.exports = SUPA;
