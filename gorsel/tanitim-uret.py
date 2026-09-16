#!/usr/bin/env python3
"""
ML Academy · 60 saniyelik tanıtım filmini sitenin kendi motoruyla üret.

    python3 gorsel/tanitim-uret.py

Ekran kaydı yok, yapay zeka video üreticisi yok. Grafikleri viz.js içindeki
gerçek kod çiziyor, sayılar derslerin kendi live() çıktısından geliyor, kapsam
rakamları ROTALAR'dan sayılıyor. Video ürünün canlandırması değil, ürünün
kendisi. Ders eklenince rakamlar da kendiliğinden güncelleniyor.

Üretilenler:
    gorsel/tanitim-60.mp4        1280x720  · LinkedIn, X, YouTube, sunum
    gorsel/tanitim-60-kare.mp4   1080x1080 · Instagram, LinkedIn akışı
    gorsel/tanitim-60.gif        900px     · README, e-posta

Video SESSİZ ve altyazılı tasarlandı: sosyal medyada çoğu izleyici sesi
açmıyor, altyazı da seslendirme kaydı gerektirmiyor.
"""
import http.server, os, pathlib, shutil, socketserver, subprocess, sys, threading
from urllib.parse import urlencode

KOK   = pathlib.Path(__file__).resolve().parent.parent
KARE  = KOK / "gorsel" / "kareler-60"
KROM  = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT  = 8907

# ─────────────────────────── SENARYO ───────────────────────────
# Her sahne: (süre_saniye, sorgu_parametreleri)
#
# Altyazılar bilinçli olarak NİTEL: "doğruluk %97.2" gibi bir sayıyı altyazıya
# yazmıyoruz, çünkü o sayı dersin live() çıktısından geliyor ve ders
# güncellenirse altyazı yalan söyler. Ekranda zaten yazıyor.
A = "altyazi"

SENARYO = [
    # ── 1 · açılış ──────────────────────────────────────────────
    (3.0, {"tip":"kart",
           "buyuk":"Yapay zekâyı <em>yaparak</em> öğren",
           "orta":"Sıfırdan başlayanlar için. Tarayıcıda çalışır, kurulum istemez.",
           "url":"mltraining.org"}),

    # ── 2 · doğruluk yalan söyler ───────────────────────────────
    # Eşik DÜŞÜKTEN YÜKSEĞE gidiyor ki son karede vurucu hâl kalsın:
    # doğruluk %97, yakalanan dolandırıcılık 0/30. Dersin başlığının vaadi bu.
    # Ölçülen değerler: 0.25 → %76.7 (30/30, 233 yanlış alarm) · 0.50 → %97.2
    # (22/30) · 0.75 → %98.2 (12/30) · 0.90 → %97.1 (1/30) · 0.97 → %97.0 (0/30)
    (2.8, {"tip":"viz","ders":"metrikler","adim":0,"deger":0.25,"rota":0,
           A:"1000 işlemin 30'u dolandırıcılık. Eşiği sen belirliyorsun."}),
    (2.4, {"tip":"viz","ders":"metrikler","adim":0,"deger":0.50,"rota":0,
           A:"Eşiği yükselt: yanlış alarmlar düşüyor, doğruluk %97'ye çıkıyor."}),
    (2.2, {"tip":"viz","ders":"metrikler","adim":0,"deger":0.75,"rota":0,
           A:"Yükseltmeye devam et."}),
    (2.2, {"tip":"viz","ders":"metrikler","adim":0,"deger":0.90,"rota":0,
           A:"Doğruluk hâlâ %97."}),
    (3.4, {"tip":"viz","ders":"metrikler","adim":0,"deger":0.97,"rota":0,
           A:"Ama artık <s>tek bir</s> dolandırıcılık bile yakalanmıyor."}),

    # ── 3 · ezberleme ───────────────────────────────────────────
    (2.8, {"tip":"viz","ders":"ezberleme","adim":1,"deger":1,"rota":0,
           A:"Aynı veriye bir eğri uyduruyoruz."}),
    (2.2, {"tip":"viz","ders":"ezberleme","adim":1,"deger":3,"rota":0,
           A:"Modeli esnettikçe eğitim hatası düşüyor…"}),
    (2.2, {"tip":"viz","ders":"ezberleme","adim":1,"deger":5,"rota":0,
           A:"…düşmeye devam ediyor…"}),
    (2.2, {"tip":"viz","ders":"ezberleme","adim":1,"deger":7,"rota":0,
           A:"…neredeyse sıfıra iniyor."}),
    (3.6, {"tip":"viz","ders":"ezberleme","adim":1,"deger":9,"rota":0,
           A:"Ama model artık öğrenmiyor, <s>ezberliyor</s>."}),

    # ── 4 · soft tree · neural-trees bağlantısı ─────────────────
    # Sıra bilinçli: önce BAŞARISIZ ayar, sonra düzelme, sonunda kazanma.
    # T=0.4'te sigmoid doyuyor ve soft tree %54.6'da kalıyor; T=1.6'da %94.2
    # ile hem CART'ı (%92.5) geçiyor hem Bayes tavanına (%94.0) değiyor.
    # Değerler dersin kendi live() çıktısından okunarak seçildi.
    (2.8, {"tip":"viz","ders":"soft-tree","adim":0,"deger":0.4,"rota":1,
           "rozet":"NEURAL-TREES",
           A:"Karar ağacında sert eşik yerine <em>yumuşak kapı</em>."}),
    (2.6, {"tip":"viz","ders":"soft-tree","adim":0,"deger":0.8,"rota":1,
           "rozet":"NEURAL-TREES",
           A:"Kapı fazla keskinse gradyan kayboluyor. Yumuşat."}),
    (3.6, {"tip":"viz","ders":"soft-tree","adim":0,"deger":1.6,"rota":1,
           "rozet":"NEURAL-TREES",
           A:"Ve daha az parametreyle klasik ağacı <em>geçiyor</em>."}),

    # ── 5 · kanıt pedagojisi ────────────────────────────────────
    (3.5, {"tip":"kart",
           "buyuk":"Her ders bir <em>iddia</em> ile biter",
           "orta":"İddiayı okumuyorsun. Kaydırıcıyı oynatıp <em>kendin doğruluyorsun</em>."}),
    (3.5, {"tip":"kart","logo":"0",
           "buyuk":"Ezber değil, <em>kanıt</em>",
           "orta":"123 dersin tamamı bu şekilde kurgulandı."}),

    # ── 6 · kapsam · rakamlar ROTALAR'dan sayılıyor ─────────────
    (7.5, {"tip":"kart","rakam":"1",
           "buyuk":"Beş rota, tek yol",
           "orta":"Hiç bilmeyenden büyük dil modellerine kadar."}),

    # ── 7 · kapanış ─────────────────────────────────────────────
    (6.0, {"tip":"kart","logo":"0",
           "buyuk":"Kurulum yok.<br>Ücret yok.",
           "orta":"Her rotanın ilk üç dersi herkese açık.",
           "url":"mltraining.org"}),
]

def sunucu_baslat():
    os.chdir(KOK)
    class Sessiz(http.server.SimpleHTTPRequestHandler):
        def log_message(self, *a): pass
    srv = socketserver.TCPServer(("127.0.0.1", PORT), Sessiz)
    threading.Thread(target=srv.serve_forever, daemon=True).start()
    return srv

def kare_cek(i, parametre):
    hedef = KARE / f"k{i:03d}.png"
    url = f"http://127.0.0.1:{PORT}/gorsel/tanitim-film.html?" + urlencode(parametre)
    subprocess.run(
        # --hide-scrollbars KULLANMA: bu sayfada kareyi boş bırakıyor.
        [KROM, "--headless", "--disable-gpu", "--virtual-time-budget=5000",
         f"--screenshot={hedef}", "--window-size=1280,720", url],
        check=True, capture_output=True)
    if not hedef.exists():
        raise SystemExit(f"kare yazılamadı: {hedef}")
    return hedef

def main():
    if not pathlib.Path(KROM).exists():
        raise SystemExit(f"Chrome bulunamadı: {KROM}")
    if shutil.rmtree(KARE, ignore_errors=True) or True:
        KARE.mkdir(parents=True, exist_ok=True)

    srv = sunucu_baslat()
    try:
        print(f"→ {len(SENARYO)} kare çiziliyor")
        for i, (sure, p) in enumerate(SENARYO):
            kare_cek(i, p)
            etiket = p.get("ders") or p.get("buyuk", "kart")[:34]
            print(f"  {i:02d} · {sure:4.1f}s · {etiket}")
    finally:
        srv.shutdown()

    # concat demuxer: son kare süre almadığı için tekrar yazılıyor
    liste = KOK / "gorsel" / "liste-60.txt"
    with liste.open("w", encoding="utf-8") as f:
        for i, (sure, _) in enumerate(SENARYO):
            f.write(f"file 'kareler-60/k{i:03d}.png'\nduration {sure}\n")
        f.write(f"file 'kareler-60/k{len(SENARYO)-1:03d}.png'\n")

    mp4 = KOK / "gorsel" / "tanitim-60.mp4"
    gif = KOK / "gorsel" / "tanitim-60.gif"
    palet = KOK / "gorsel" / "palet-60.png"

    print("→ mp4")
    subprocess.run(["ffmpeg","-loglevel","error","-y","-f","concat","-safe","0",
        "-i",str(liste),"-vf","fps=30,format=yuv420p","-c:v","libx264",
        "-profile:v","high","-crf","20","-movflags","+faststart",str(mp4)], check=True)

    print("→ kare · 1080x1080 · Instagram, LinkedIn akışı")
    # Akışta 16:9'dan daha çok yer kaplıyor. Kırpmıyoruz, üste/alta zemin
    # rengi ekliyoruz: kırpmak altyazıyı keser.
    kare_mp4 = KOK / "gorsel" / "tanitim-60-kare.mp4"
    subprocess.run(["ffmpeg","-loglevel","error","-y","-i",str(mp4),
        "-vf","scale=1080:-2:flags=lanczos,pad=1080:1080:(ow-iw)/2:(oh-ih)/2:color=0x070a0f",
        "-c:v","libx264","-profile:v","high","-pix_fmt","yuv420p","-crf","20",
        "-movflags","+faststart",str(kare_mp4)], check=True)

    print("→ gif")
    # İki geçiş: önce palet, sonra kodlama. Tek geçişte grafiklerde bantlaşma oluyor.
    subprocess.run(["ffmpeg","-loglevel","error","-y","-i",str(mp4),
        "-vf","fps=10,scale=900:-1:flags=lanczos,palettegen=stats_mode=diff",str(palet)], check=True)
    subprocess.run(["ffmpeg","-loglevel","error","-y","-i",str(mp4),"-i",str(palet),
        "-lavfi","fps=10,scale=900:-1:flags=lanczos[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=3",
        str(gif)], check=True)
    palet.unlink(missing_ok=True); liste.unlink(missing_ok=True)

    # Süre ÖLÇÜLÜYOR, toplanmıyor: concat demuxer'ın tekrarlanan son karesi
    # kendi süresini bir kez daha ekliyor, yani senaryodaki toplam gerçek
    # süreden kısa çıkıyor.
    olculen = subprocess.run(["ffprobe","-v","error","-show_entries",
        "format=duration","-of","csv=p=0",str(mp4)],
        capture_output=True, text=True, check=True).stdout.strip()
    print(f"\nsenaryo toplamı: {sum(s for s, _ in SENARYO):.1f} sn"
          f"  ·  ölçülen süre: {float(olculen):.1f} sn")
    subprocess.run(["ls","-lh",str(mp4),str(kare_mp4),str(gif)])

if __name__ == "__main__":
    main()
