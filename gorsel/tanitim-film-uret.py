#!/usr/bin/env python3
"""
ML Academy · tanıtım filmi — gerçek hareket ve gerçek geçişlerle.

    python3 gorsel/tanitim-film-uret.py

ÖNCEKİ SÜRÜMDEN FARKI
Eskiden her sahne tek bir duran kareydi ve sahneler sert kesmeyle birbirine
ekleniyordu; sonuç videodan çok slayt gösterisi gibiydi. Bu sürüm 30 fps'lik
kareleri Python'da üretip doğrudan ffmpeg'e akıtıyor:

  · Sayfa turları GERÇEKTEN kayıyor. Sayfanın tamamı tek bir uzun görüntü
    olarak yakalanıyor, kareler o görüntüden kayan bir pencereyle kesiliyor.
    Çapraz geçişle kaydırma taklidi yapılmıyor.
  · Kaydırıcı ve grafik hareketleri, yakalanan komşu kareler arasında
    ara değer üretilerek yumuşatılıyor. Chrome'u 30 fps çağırmak yerine
    birkaç kare çekip aradaki geçişi hesaplıyoruz.
  · Sahneler birbirine çapraz geçişle bağlanıyor.
  · Altyazı sayfadan bağımsız saydam bir katman; belirip kayboluyor.
    Tam genişlikte karartma bandı YOK — o bant videoya oynatıcı çubuğu
    koymuş gibi duruyordu.

Kaynak yine sitenin kendisi: grafikleri viz.js çiziyor, sayfa kareleri
lesson.html'in gerçek DOM'undan geliyor, kapsam rakamları ROTALAR'dan
sayılıyor. Uydurma arayüz ve ekran kaydı yok.

Üretilenler:
    gorsel/tanitim-tur.mp4        1280x720
    gorsel/tanitim-tur-kare.mp4   1080x1080

DİKKAT: gorsel/tanitim.mp4 BAŞKA bir dosya — film-uret.sh'ın ürettiği 15
saniyelik kısa tanıtım. Üzerine yazma.
"""
import http.server, os, pathlib, shutil, socketserver, subprocess, sys, threading
from urllib.parse import urlencode
from PIL import Image

KOK   = pathlib.Path(__file__).resolve().parent.parent
GECICI= KOK / "gorsel" / ".yapim"
KROM  = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT  = 8915
W, H  = 1280, 720
FPS   = 30
GECIS = 0.45          # sahneler arası çapraz geçiş, saniye

# ═══════════════════════════ SENARYO ═══════════════════════════
# tur:
#   kart  · duran kart (tanitim-film.html), hafif yakınlaşma ile
#   pan   · sayfanın tamamı yakalanıp y0'dan y1'e kaydırılır
#   dizi  · birkaç kare çekilip araları yumuşatılır (kaydırıcı/grafik hareketi)
DERS = "veri"         # rota 0'ın 2. dersi · ücretsiz (ilk 3 ders açık)

SENARYO = [
  {"tur":"kart","sure":3.6,"p":{"tip":"kart",
    "buyuk":"Yapay zekâyı <em>yaparak</em> öğren",
    "orta":"Sıfırdan başlayanlar için. Tarayıcıda çalışır, kurulum istemez.",
    "url":"mltraining.org"}},

  # Kaydırma aralıkları uzun görüntü üzerinden ÖLÇÜLDÜ, tahmin değil:
  # y≈560'ta rakam şeridi ve "Her ders aynı beş adımı izler" başlığı,
  # y≈1800'de Rota 0 ve ilk üç dersin açık olduğu ızgara duruyor.
  {"tur":"pan","sure":5.5,"sayfa":"index","y0":0,"y1":430,
    "altyazi":"mltraining.org'u aç. Kurulum yok, indirme yok."},
  {"tur":"pan","sure":5.5,"sayfa":"index","y0":430,"y1":610,
    "altyazi":"123 ders, 401 etkileşimli adım, 165 canlı görselleştirme."},
  {"tur":"pan","sure":6.0,"sayfa":"index","y0":645,"y1":880,
    "altyazi":"Her ders aynı beş adımı izler: <em>hedef · gör · oyna · soru · özet</em>."},
  {"tur":"pan","sure":5.5,"sayfa":"index","y0":1755,"y1":2150,
    "altyazi":"Beş rota var. Her rotanın <em>ilk üç dersi herkese açık</em>."},

  {"tur":"pan","sure":5.5,"ders":DERS,"adim":2,"y0":0,"y1":330,
    "altyazi":"Bir ders aç. Solda adımlar, sağda konu."},
  {"tur":"pan","sure":5.0,"ders":DERS,"adim":2,"y0":150,"y1":470,
    "altyazi":"<em>1 · HEDEF</em> — Ne öğreneceğini tek cümleyle baştan söyler."},
  {"tur":"pan","sure":4.5,"ders":DERS,"adim":2,"y0":520,"y1":744,
    "altyazi":"<em>3 · OYNA</em> — Sonra kaydırıcıyı sana veriyor."},

  # Kaydırıcı hareketi: 1'den 10'a. Aradaki kareler hesaplanıyor.
  {"tur":"dizi","sure":5.0,"sayfa":"ders","altyazi":"Oynattıkça sayılar yeniden hesaplanıyor — okumuyorsun, <em>deniyorsun</em>.",
   "kareler":[{"sayfa":"ders","id":DERS,"adim":2,"kaydir":780,"deger":v} for v in (1,3,5,7,9,10)]},

  {"tur":"pan","sure":5.5,"ders":DERS,"adim":4,"y0":690,"y1":880,
    "altyazi":"<em>4 · SORU</em> — Sonraki adımın kilidi doğru cevapla açılıyor."},

  {"tur":"kart","sure":3.2,"p":{"tip":"kart","logo":"0",
    "buyuk":"Peki ne öğreniyorsun?","orta":"Üç örnek, üç farklı rotadan."}},

  # Eşik 0.20'den 0.97'ye akıyor; vurucu hâl sonda.
  {"tur":"dizi","sure":7.0,"altyazi":"Doğruluk yükseliyor… ama yakalanan dolandırıcılık <s>düşüyor</s>.",
   "kareler":[{"tip":"viz","ders":"metrikler","adim":0,"deger":d,"rota":0}
              for d in (0.20,0.35,0.50,0.62,0.75,0.86,0.93,0.97)]},

  # Polinom derecesi 1'den 9'a.
  {"tur":"dizi","sure":6.0,"altyazi":"Modeli esnettikçe hata sıfıra iniyor. Ama model öğrenmiyor, <s>ezberliyor</s>.",
   "kareler":[{"tip":"viz","ders":"ezberleme","adim":1,"deger":d,"rota":0}
              for d in (1,2,3,4,5,6,7,8,9)]},

  # Sıcaklık 0.4'ten 1.6'ya: başarısızdan kazanmaya.
  {"tur":"dizi","sure":6.0,"altyazi":"Sert eşik yerine yumuşak kapı: daha az parametreyle klasik ağacı <em>geçiyor</em>.",
   "kareler":[{"tip":"viz","ders":"soft-tree","adim":0,"deger":d,"rota":1,"rozet":"NEURAL-TREES"}
              for d in (0.4,0.6,0.8,1.0,1.2,1.4,1.6)]},

  {"tur":"kart","sure":4.2,"p":{"tip":"kart",
    "buyuk":"Her ders bir <em>iddia</em> ile biter",
    "orta":"İddiayı okumuyorsun. Kaydırıcıyı oynatıp <em>kendin doğruluyorsun</em>."}},
  {"tur":"kart","sure":6.5,"p":{"tip":"kart","rakam":"1",
    "buyuk":"Beş rota, tek yol","orta":"Hiç bilmeyenden büyük dil modellerine kadar."}},
  {"tur":"kart","sure":6.0,"p":{"tip":"kart","logo":"0",
    "buyuk":"Kurulum yok.<br>Ücret yok.",
    "orta":"Her rotanın ilk üç dersi herkese açık.","url":"mltraining.org"}},
]

# ══════════════════════════ yardımcılar ══════════════════════════
def sunucu():
    os.chdir(KOK)
    class Sessiz(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    s = socketserver.TCPServer(("127.0.0.1", PORT), Sessiz)
    threading.Thread(target=s.serve_forever, daemon=True).start()
    return s

def krom(url, cikti, boy, saydam=False, butce=11000):
    ek = ["--default-background-color=00000000"] if saydam else []
    subprocess.run([KROM, "--headless", "--disable-gpu", *ek,
        f"--virtual-time-budget={butce}", f"--screenshot={cikti}",
        f"--window-size={boy[0]},{boy[1]}", url], check=True, capture_output=True)
    if not pathlib.Path(cikti).exists():
        raise SystemExit(f"kare yazılamadı: {cikti}\n{url}")

def adres(sayfa, p):
    return f"http://127.0.0.1:{PORT}/gorsel/{sayfa}?" + urlencode(p)

def uzun_yakala(ad, p):
    """Sayfanın tamamını tek görüntüde yakala. Yükseklik iki geçişte bulunuyor:
    önce sayfa kendi boyunu başlığa yazıyor, sonra o boyda ekran alınıyor."""
    hedef = GECICI / f"uzun_{ad}.png"
    if hedef.exists(): return Image.open(hedef).convert("RGB")
    u = adres("tanitim-ui.html", {**p, "tam":"1"})
    dom = subprocess.run([KROM,"--headless","--disable-gpu",
        "--virtual-time-budget=12000","--dump-dom",u],
        capture_output=True, text=True).stdout
    yuk = 720
    for parca in dom.split("YUK:")[1:2]:
        yuk = int("".join(c for c in parca[:8] if c.isdigit()))
    krom(u, hedef, (W, yuk + 40), butce=13000)
    return Image.open(hedef).convert("RGB")

def altyazi_katman(metin, i):
    if not metin: return None
    hedef = GECICI / f"alt_{i:02d}.png"
    if not hedef.exists():
        krom(adres("tanitim-ui.html", {"sadece":"altyazi","altyazi":metin}),
             hedef, (W, H), saydam=True, butce=4000)
    return Image.open(hedef).convert("RGBA")

def yumusat(x):
    """smoothstep · doğrusal hareket videoda mekanik duruyor."""
    return x * x * (3 - 2 * x)

def bindir(kare, katman, gorunurluk):
    if katman is None or gorunurluk <= 0: return kare
    k = katman
    if gorunurluk < 1:
        a = k.split()[3].point(lambda v: int(v * gorunurluk))
        k = Image.merge("RGBA", (*k.split()[:3], a))
    out = kare.convert("RGBA"); out.alpha_composite(k)
    return out.convert("RGB")

def sahne_kareleri(s, idx):
    """Bir sahnenin 30 fps kare listesini üret."""
    n = max(1, int(round(s["sure"] * FPS)))
    katman = altyazi_katman(s.get("altyazi"), idx)
    # altyazı ilk 0.4 sn'de beliriyor, son 0.4 sn'de kayboluyor
    bel = int(0.4 * FPS)
    def gor(i):
        if i < bel: return i / bel
        if i > n - bel: return max(0.0, (n - i) / bel)
        return 1.0

    if s["tur"] == "pan":
        p = ({"sayfa":"index"} if s.get("sayfa") == "index"
             else {"sayfa":"ders","id":s["ders"],"adim":s["adim"]})
        ad = "index" if s.get("sayfa") == "index" else f"ders{s['adim']}"
        uzun = uzun_yakala(ad, p)
        ymaks = max(0, uzun.height - H)
        for i in range(n):
            t = yumusat(i / max(1, n - 1))
            y = int(round(s["y0"] + (s["y1"] - s["y0"]) * t))
            y = max(0, min(ymaks, y))
            yield bindir(uzun.crop((0, y, W, y + H)), katman, gor(i))
        return

    if s["tur"] == "dizi":
        sayfa = "tanitim-ui.html" if s.get("sayfa") == "ders" else "tanitim-film.html"
        imgs = []
        for j, p in enumerate(s["kareler"]):
            hedef = GECICI / f"d{idx:02d}_{j:02d}.png"
            if not hedef.exists():
                krom(adres(sayfa, p), hedef, (W, H),
                     butce=11000 if sayfa.endswith("ui.html") else 5000)
            imgs.append(Image.open(hedef).convert("RGB"))
        # Komşu kareler arasında ara değer: Chrome'u 30 fps çağırmadan
        # yumuşak hareket. Başta ve sonda kısa duraklama var.
        bas, son = int(0.35 * FPS), int(0.55 * FPS)
        akis = max(1, n - bas - son)
        for i in range(n):
            if i < bas: konum = 0.0
            elif i >= bas + akis: konum = 1.0
            else: konum = yumusat((i - bas) / max(1, akis - 1))
            x = konum * (len(imgs) - 1)
            a = min(len(imgs) - 1, int(x)); b = min(len(imgs) - 1, a + 1)
            kare = imgs[a] if a == b else Image.blend(imgs[a], imgs[b], x - a)
            yield bindir(kare, katman, gor(i))
        return

    # kart · yavaş yakınlaşma, duran görüntü olmasın
    hedef = GECICI / f"k{idx:02d}.png"
    if not hedef.exists():
        krom(adres("tanitim-film.html", s["p"]), hedef, (W, H), butce=5000)
    taban = Image.open(hedef).convert("RGB")
    for i in range(n):
        t = i / max(1, n - 1)
        olcek = 1.0 + 0.022 * t
        yw, yh = int(W * olcek), int(H * olcek)
        buyuk = taban.resize((yw, yh), Image.LANCZOS)
        sol, ust = (yw - W) // 2, (yh - H) // 2
        yield bindir(buyuk.crop((sol, ust, sol + W, ust + H)), katman, gor(i))

def main():
    if not pathlib.Path(KROM).exists():
        raise SystemExit(f"Chrome bulunamadı: {KROM}")
    GECICI.mkdir(parents=True, exist_ok=True)
    srv = sunucu()
    try:
        print(f"→ {len(SENARYO)} sahne")
        sahneler = []
        for i, s in enumerate(SENARYO):
            kareler = list(sahne_kareleri(s, i))
            sahneler.append(kareler)
            print(f"  {i:02d} · {s['tur']:4s} · {s['sure']:4.1f}s · {len(kareler):3d} kare")
    finally:
        srv.shutdown()

    gecis = int(GECIS * FPS)
    mp4 = KOK / "gorsel" / "tanitim-tur.mp4"
    print("→ çapraz geçişlerle birleştiriliyor")
    ff = subprocess.Popen(["ffmpeg","-loglevel","error","-y",
        "-f","rawvideo","-pix_fmt","rgb24","-s",f"{W}x{H}","-r",str(FPS),
        "-i","-","-c:v","libx264","-profile:v","high","-pix_fmt","yuv420p",
        "-crf","19","-movflags","+faststart",str(mp4)], stdin=subprocess.PIPE)

    toplam = 0
    for i, kareler in enumerate(sahneler):
        bas = 0
        if i > 0:
            # önceki sahnenin kuyruğu bu sahnenin başına karışıyor
            onceki = sahneler[i-1][-gecis:]
            for j, eski in enumerate(onceki):
                yeni = kareler[min(j, len(kareler)-1)]
                ff.stdin.write(Image.blend(eski, yeni, (j+1)/(gecis+1)).tobytes())
                toplam += 1
            bas = gecis
        son = len(kareler) - (gecis if i < len(sahneler)-1 else 0)
        for kare in kareler[bas:son]:
            ff.stdin.write(kare.tobytes()); toplam += 1
    ff.stdin.close(); ff.wait()

    kare_mp4 = KOK / "gorsel" / "tanitim-tur-kare.mp4"
    print("→ kare · 1080x1080")
    subprocess.run(["ffmpeg","-loglevel","error","-y","-i",str(mp4),
        "-vf","scale=1080:-2:flags=lanczos,pad=1080:1080:(ow-iw)/2:(oh-ih)/2:color=0x070a0f",
        "-c:v","libx264","-profile:v","high","-pix_fmt","yuv420p","-crf","20",
        "-movflags","+faststart",str(kare_mp4)], check=True)

    olculen = float(subprocess.run(["ffprobe","-v","error","-show_entries",
        "format=duration","-of","csv=p=0",str(mp4)],
        capture_output=True, text=True, check=True).stdout.strip())
    dk, sn = divmod(olculen, 60)
    print(f"\n{toplam} kare · ölçülen süre {int(dk)}:{sn:04.1f}")
    subprocess.run(["ls","-lh",str(mp4),str(kare_mp4)])

if __name__ == "__main__":
    main()
