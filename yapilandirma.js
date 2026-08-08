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

if (typeof module !== 'undefined') module.exports = SUPA;
