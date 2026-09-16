#!/usr/bin/env python3
"""
ML Academy · uzun tanıtım filmi (~2 dk) — sitenin kendi motoru ve kendi sayfaları.

    python3 gorsel/tanitim-uzun.py

60 saniyelik sürümden farkı: sitede NASIL ilerlendiğini de gösteriyor. İki tür
kare var:

    film · gorsel/tanitim-film.html · dersin grafiğini viz.js ile yeniden çizer
    ui   · gorsel/tanitim-ui.html   · sitenin GERÇEK sayfasını iframe'e alır ve
                                      lesson.html'in kendi go(i) fonksiyonuyla
                                      istenen adıma getirir

İkisinde de uydurma arayüz yok: birinde çizen motor sitenin motoru, diğerinde
görünen sayfa sitenin sayfası. Ekran kaydı da yok, o yüzden fare titremiyor ve
kare hızı sabit.

Üretilenler:
    gorsel/tanitim-uzun.mp4        1280x720  · YouTube, LinkedIn, sunum
    gorsel/tanitim-uzun-kare.mp4   1080x1080 · Instagram, LinkedIn akışı
"""
import http.server, os, pathlib, shutil, socketserver, subprocess, threading
from urllib.parse import urlencode

KOK  = pathlib.Path(__file__).resolve().parent.parent
KARE = KOK / "gorsel" / "kareler-uzun"
KROM = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
PORT = 8912
A    = "altyazi"

# Yalnız ÜCRETSİZ dersler kullanılabilir: her rotanın ilk 3 dersi açık, sonrası
# hesap istiyor ve kilitli derste ekrana ödeme penceresi geliyor.
# Rota 0'ın açık dersleri: algoritma · veri · ezber
DERS = "veri"

SENARYO = [
    # ══ 1 · AÇILIŞ ═══════════════════════════════════════════════
    (3.5, "film", {"tip":"kart",
        "buyuk":"Yapay zekâyı <em>yaparak</em> öğren",
        "orta":"Sıfırdan başlayanlar için. Tarayıcıda çalışır, kurulum istemez.",
        "url":"mltraining.org"}),

    # ══ 2 · SİTE ═════════════════════════════════════════════════
    (4.5, "ui", {"sayfa":"index","kaydir":0,
        A:"mltraining.org'u aç. Kurulum yok, indirme yok."}),
    (4.5, "ui", {"sayfa":"index","kaydir":620,
        A:"123 ders, 401 etkileşimli adım, 165 canlı görselleştirme."}),
    (5.5, "ui", {"sayfa":"index","kaydir":760,
        A:"Her ders aynı beş adımı izler: <em>hedef · gör · oyna · soru · özet</em>."}),
    (5.0, "ui", {"sayfa":"index","kaydir":1900,
        A:"Beş rota var. Her rotanın <em>ilk üç dersi herkese açık</em>."}),

    # ══ 3 · DERS NASIL İŞLİYOR ═══════════════════════════════════
    (5.0, "ui", {"sayfa":"ders","id":DERS,"adim":2,"kaydir":0,
        A:"Bir ders aç. Solda adımlar, sağda konu."}),
    (4.5, "ui", {"sayfa":"ders","id":DERS,"adim":2,"kaydir":210,
        A:"<em>1 · HEDEF</em> — Adım, ne öğreneceğini tek cümleyle baştan söyler."}),
    (5.0, "ui", {"sayfa":"ders","id":DERS,"adim":2,"kaydir":780,
        A:"<em>3 · OYNA</em> — Sonra kaydırıcıyı sana veriyor."}),
    (2.6, "ui", {"sayfa":"ders","id":DERS,"adim":2,"kaydir":780,"deger":5,
        A:"Oynattıkça sayılar yeniden hesaplanıyor…"}),
    (3.4, "ui", {"sayfa":"ders","id":DERS,"adim":2,"kaydir":780,"deger":10,
        A:"…okumuyorsun, <em>deniyorsun</em>."}),
    (5.5, "ui", {"sayfa":"ders","id":DERS,"adim":4,"kaydir":1000,
        A:"<em>4 · SORU</em> — Sonraki adımın kilidi doğru cevapla açılıyor."}),

    # ══ 4 · NE ÖĞRENİYORSUN ══════════════════════════════════════
    (3.4, "film", {"tip":"kart","logo":"0",
        "buyuk":"Peki ne öğreniyorsun?",
        "orta":"Üç örnek, üç farklı rotadan."}),

    # doğruluk yalan söyler · eşik düşükten yükseğe, vurucu hâl sonda
    (3.0, "film", {"tip":"viz","ders":"metrikler","adim":0,"deger":0.25,"rota":0,
        A:"1000 işlemin 30'u dolandırıcılık. Eşiği sen belirliyorsun."}),
    (2.4, "film", {"tip":"viz","ders":"metrikler","adim":0,"deger":0.50,"rota":0,
        A:"Eşiği yükselt: doğruluk %97'ye çıkıyor."}),
    (2.2, "film", {"tip":"viz","ders":"metrikler","adim":0,"deger":0.90,"rota":0,
        A:"Doğruluk hâlâ %97."}),
    (3.6, "film", {"tip":"viz","ders":"metrikler","adim":0,"deger":0.97,"rota":0,
        A:"Ama artık <s>tek bir</s> dolandırıcılık bile yakalanmıyor."}),

    # ezberleme
    (2.8, "film", {"tip":"viz","ders":"ezberleme","adim":1,"deger":1,"rota":0,
        A:"Aynı veriye bir eğri uyduruyoruz."}),
    (2.2, "film", {"tip":"viz","ders":"ezberleme","adim":1,"deger":5,"rota":0,
        A:"Modeli esnettikçe eğitim hatası düşüyor…"}),
    (3.6, "film", {"tip":"viz","ders":"ezberleme","adim":1,"deger":9,"rota":0,
        A:"…sıfıra iniyor. Ama model öğrenmiyor, <s>ezberliyor</s>."}),

    # soft tree · T=0.4 başarısız, T=1.6 kazanıyor (ölçülen değerler)
    (2.8, "film", {"tip":"viz","ders":"soft-tree","adim":0,"deger":0.4,"rota":1,
        "rozet":"NEURAL-TREES",
        A:"Karar ağacında sert eşik yerine <em>yumuşak kapı</em>."}),
    (2.6, "film", {"tip":"viz","ders":"soft-tree","adim":0,"deger":0.8,"rota":1,
        "rozet":"NEURAL-TREES",
        A:"Kapı fazla keskinse gradyan kayboluyor. Yumuşat."}),
    (3.8, "film", {"tip":"viz","ders":"soft-tree","adim":0,"deger":1.6,"rota":1,
        "rozet":"NEURAL-TREES",
        A:"Ve daha az parametreyle klasik ağacı <em>geçiyor</em>."}),

    # ══ 5 · KAPANIŞ ══════════════════════════════════════════════
    (4.0, "film", {"tip":"kart",
        "buyuk":"Her ders bir <em>iddia</em> ile biter",
        "orta":"İddiayı okumuyorsun. Kaydırıcıyı oynatıp <em>kendin doğruluyorsun</em>."}),
    (7.0, "film", {"tip":"kart","rakam":"1",
        "buyuk":"Beş rota, tek yol",
        "orta":"Hiç bilmeyenden büyük dil modellerine kadar."}),
    (6.5, "film", {"tip":"kart","logo":"0",
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

def kare_cek(i, tur, parametre):
    sayfa = "tanitim-film.html" if tur == "film" else "tanitim-ui.html"
    hedef = KARE / f"k{i:03d}.png"
    url = f"http://127.0.0.1:{PORT}/gorsel/{sayfa}?" + urlencode(parametre)
    # ui kareleri iframe içinde ayrı bir sayfa yüklediği için daha uzun süre ister.
    # --hide-scrollbars KULLANMA: bu sayfalarda kareyi boş bırakıyor.
    butce = 11000 if tur == "ui" else 5000
    subprocess.run([KROM, "--headless", "--disable-gpu",
        f"--virtual-time-budget={butce}", f"--screenshot={hedef}",
        "--window-size=1280,720", url], check=True, capture_output=True)
    if not hedef.exists():
        raise SystemExit(f"kare yazılamadı: {hedef}")
    return hedef

def main():
    shutil.rmtree(KARE, ignore_errors=True)
    KARE.mkdir(parents=True, exist_ok=True)
    srv = sunucu_baslat()
    try:
        print(f"→ {len(SENARYO)} kare çiziliyor")
        for i, (sure, tur, p) in enumerate(SENARYO):
            kare_cek(i, tur, p)
            etiket = p.get("ders") or p.get("sayfa") or p.get("buyuk", "")[:30]
            print(f"  {i:02d} · {sure:4.1f}s · {tur:4s} · {etiket}")
    finally:
        srv.shutdown()

    liste = KOK / "gorsel" / "liste-uzun.txt"
    with liste.open("w", encoding="utf-8") as f:
        for i, (sure, _, _) in enumerate(SENARYO):
            f.write(f"file 'kareler-uzun/k{i:03d}.png'\nduration {sure}\n")
        f.write(f"file 'kareler-uzun/k{len(SENARYO)-1:03d}.png'\n")

    mp4   = KOK / "gorsel" / "tanitim-uzun.mp4"
    kare  = KOK / "gorsel" / "tanitim-uzun-kare.mp4"

    print("→ mp4 · 1280x720")
    subprocess.run(["ffmpeg","-loglevel","error","-y","-f","concat","-safe","0",
        "-i",str(liste),"-vf","fps=30,format=yuv420p","-c:v","libx264",
        "-profile:v","high","-crf","20","-movflags","+faststart",str(mp4)], check=True)

    print("→ kare · 1080x1080")
    subprocess.run(["ffmpeg","-loglevel","error","-y","-i",str(mp4),
        "-vf","scale=1080:-2:flags=lanczos,pad=1080:1080:(ow-iw)/2:(oh-ih)/2:color=0x070a0f",
        "-c:v","libx264","-profile:v","high","-pix_fmt","yuv420p","-crf","20",
        "-movflags","+faststart",str(kare)], check=True)
    liste.unlink(missing_ok=True)

    # Süre ÖLÇÜLÜYOR, toplanmıyor: concat'in tekrarlanan son karesi kendi
    # süresini bir kez daha ekliyor.
    olculen = subprocess.run(["ffprobe","-v","error","-show_entries","format=duration",
        "-of","csv=p=0",str(mp4)], capture_output=True, text=True, check=True).stdout.strip()
    dk, sn = divmod(float(olculen), 60)
    print(f"\nölçülen süre: {int(dk)}:{sn:04.1f}")
    subprocess.run(["ls","-lh",str(mp4),str(kare)])

if __name__ == "__main__":
    main()
