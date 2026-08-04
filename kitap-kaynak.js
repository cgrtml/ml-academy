/* ═══════════════════════════════════════════════════════════════
   KITAP KAYNAKLARI — her ders adimi icin ilgili kitap bolumu.

   Uretim: ml-books-rag/scripts/kaynak_haritasi.py. Adim metni ders
   kitabi korpusunda aranir, en yakin bolumler sayfa araligiyla
   yazilir. Burada SADECE atif vardir; kitap metni yer almaz.

   Eslesme otomatiktir, benzerlik esigi 0.52. Yanlis eslesme gorursen
   bildir, esik yukseltilir ya da o adim elle duzeltilir.
   ═══════════════════════════════════════════════════════════════ */
const KITAP_KAYNAK = {
 "veri:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "44-48, 113, 148",
   "p": 0.586
  },
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "18, 37, 223",
   "p": 0.557
  }
 ],
 "veri:3": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "44, 81, 113, 123, 148, 173, 330, 496, 829, 844, 950",
   "p": 0.527
  }
 ],
 "veri:5": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "5, 44-47, 117, 131, 170-174, 946",
   "p": 0.597
  },
  {
   "k": "Weidman, S. (2019) · Deep Learning from Scratch: Building with Python from First Principles",
   "s": "63",
   "p": 0.541
  }
 ],
 "ezber:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "6, 46, 117, 170-180",
   "p": 0.639
  }
 ],
 "ezber:3": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "6, 117, 171, 188, 508",
   "p": 0.556
  }
 ],
 "ezber:4": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "46, 170-179, 188, 203",
   "p": 0.658
  },
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "42",
   "p": 0.601
  }
 ],
 "nasil-ogrenir:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "114-117, 126-129",
   "p": 0.685
  },
  {
   "k": "Weidman, S. (2019) · Deep Learning from Scratch: Building with Python from First Principles",
   "s": "64",
   "p": 0.624
  }
 ],
 "nasil-ogrenir:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "45-48, 115, 138, 147, 181, 953-954",
   "p": 0.702
  },
  {
   "k": "Weidman, S. (2019) · Deep Learning from Scratch: Building with Python from First Principles",
   "s": "64",
   "p": 0.646
  }
 ],
 "nasil-ogrenir:3": [
  {
   "k": "Bishop, C. M. (2006) · Pattern Recognition and Machine Learning",
   "s": "168, 256",
   "p": 0.537
  },
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "115-120, 129, 485-490, 849, 883",
   "p": 0.534
  }
 ],
 "nasil-ogrenir:4": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "95-96, 195-196, 485, 883-889",
   "p": 0.699
  },
  {
   "k": "Raschka, S. (2024) · Build a Large Language Model (From Scratch)",
   "s": "285",
   "p": 0.657
  }
 ],
 "nasil-ogrenir:5": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "116, 127-129, 480-481, 502, 883",
   "p": 0.668
  },
  {
   "k": "Bishop, C. M. (2006) · Pattern Recognition and Machine Learning",
   "s": "260",
   "p": 0.622
  }
 ],
 "nasil-ogrenir:6": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "481, 509-510, 519-534",
   "p": 0.632
  }
 ],
 "nasil-ogrenir:7": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "128, 168, 222, 482, 492-493, 535-536, 610-611",
   "p": 0.563
  },
  {
   "k": "Raschka, S. (2024) · Build a Large Language Model (From Scratch)",
   "s": "297",
   "p": 0.552
  }
 ],
 "nasil-ogrenir:8": [
  {
   "k": "Weidman, S. (2019) · Deep Learning from Scratch: Building with Python from First Principles",
   "s": "64-66, 76",
   "p": 0.613
  },
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "91, 116, 123-133, 151, 194",
   "p": 0.589
  }
 ],
 "ezberleme:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "5, 44-46, 129, 157-158, 170-180, 336, 851",
   "p": 0.56
  }
 ],
 "ezberleme:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "116-117, 174-180",
   "p": 0.66
  },
  {
   "k": "Bishop, C. M. (2006) · Pattern Recognition and Machine Learning",
   "s": "26-31",
   "p": 0.621
  }
 ],
 "ezberleme:3": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "46, 172-180, 222, 611",
   "p": 0.614
  },
  {
   "k": "Bishop, C. M. (2006) · Pattern Recognition and Machine Learning",
   "s": "26",
   "p": 0.57
  }
 ],
 "ezberleme:4": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "6, 46, 117, 170-177, 213, 466, 536, 611",
   "p": 0.566
  },
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "309",
   "p": 0.545
  }
 ],
 "soft-split:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "137, 705, 849, 950-956",
   "p": 0.554
  }
 ],
 "soft-split:2": [
  {
   "k": "Bishop, C. M. (2006) · Pattern Recognition and Machine Learning",
   "s": "674, 684-686",
   "p": 0.527
  },
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "115",
   "p": 0.522
  }
 ],
 "soft-split:3": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "96, 162, 194-197, 485, 519, 870, 889",
   "p": 0.561
  },
  {
   "k": "Bishop, C. M. (2006) · Pattern Recognition and Machine Learning",
   "s": "15",
   "p": 0.539
  }
 ],
 "soft-split:4": [
  {
   "k": "Bishop, C. M. (2006) · Pattern Recognition and Machine Learning",
   "s": "674, 684-686",
   "p": 0.549
  }
 ],
 "algoritma:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "19, 52, 327, 348, 416, 803, 812, 927",
   "p": 0.585
  }
 ],
 "algoritma:5": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "41-43, 57-65, 286, 829",
   "p": 0.614
  }
 ],
 "noron:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "121-122, 157-160, 186, 194, 225, 350, 864",
   "p": 0.585
  },
  {
   "k": "Weidman, S. (2019) · Deep Learning from Scratch: Building with Python from First Principles",
   "s": "10-11, 76",
   "p": 0.54
  }
 ],
 "noron:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "6, 60, 122, 129, 157-160, 184-186, 194, 431, 872",
   "p": 0.583
  }
 ],
 "noron:3": [
  {
   "k": "Weidman, S. (2019) · Deep Learning from Scratch: Building with Python from First Principles",
   "s": "79-80, 95-106, 191-197",
   "p": 0.616
  },
  {
   "k": "Bishop, C. M. (2006) · Pattern Recognition and Machine Learning",
   "s": "263",
   "p": 0.605
  }
 ],
 "attention:1": [
  {
   "k": "Alammar, J. & Grootendorst, M. (2024) · Hands-On Large Language Models",
   "s": "35-37, 135-136",
   "p": 0.684
  },
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "437, 769-775",
   "p": 0.632
  }
 ],
 "attention:2": [
  {
   "k": "Raschka, S. (2024) · Build a Large Language Model (From Scratch)",
   "s": "87-94",
   "p": 0.721
  },
  {
   "k": "Xiao, T. & Zhu, J. (2025) · Foundations of Large Language Models",
   "s": "87",
   "p": 0.637
  }
 ],
 "attention:3": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "437-442, 453, 460, 769",
   "p": 0.631
  },
  {
   "k": "Tunstall, L., von Werra, L. & Wolf, T. (2022) · Natural Language Processing with Transformers",
   "s": "94, 108",
   "p": 0.618
  }
 ],
 "backprop:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "6, 96, 194-197, 367, 886-889",
   "p": 0.703
  },
  {
   "k": "Weidman, S. (2019) · Deep Learning from Scratch: Building with Python from First Principles",
   "s": "80",
   "p": 0.585
  }
 ],
 "backprop:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "6-10, 60, 128, 148-151, 188, 197, 535-538",
   "p": 0.573
  }
 ],
 "cnn:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "253-259, 272-283, 298, 664, 671",
   "p": 0.728
  }
 ],
 "cnn:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "8, 258-265, 272-274, 303, 660",
   "p": 0.586
  }
 ],
 "kumeleme:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "11, 46-48, 55-56",
   "p": 0.611
  },
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "182-184",
   "p": 0.585
  }
 ],
 "kumeleme:2": [
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "182-195",
   "p": 0.582
  },
  {
   "k": "Bishop, C. M. (2006) · Pattern Recognition and Machine Learning",
   "s": "445-447",
   "p": 0.575
  }
 ],
 "siniflandirma:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "49, 113, 135-140, 148, 209, 829, 849",
   "p": 0.641
  },
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "40, 70",
   "p": 0.572
  }
 ],
 "siniflandirma:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "49-50, 100, 137-140, 148, 907",
   "p": 0.598
  },
  {
   "k": "Monarch, R. (Munro) (2021) · Human-in-the-Loop Machine Learning",
   "s": "55, 82",
   "p": 0.592
  }
 ],
 "metrikler:1": [
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "291-292",
   "p": 0.591
  },
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "45, 148-149, 173, 956-959",
   "p": 0.549
  }
 ],
 "metrikler:2": [
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "290, 297, 304-307",
   "p": 0.571
  }
 ],
 "metrikler:3": [
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "303-310",
   "p": 0.638
  },
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "808-809",
   "p": 0.586
  }
 ],
 "bolme:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "46, 173-177, 221",
   "p": 0.697
  },
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "265, 276-277, 316",
   "p": 0.609
  }
 ],
 "bolme:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "173-174, 220-222, 906",
   "p": 0.612
  },
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "266-271, 286",
   "p": 0.572
  }
 ],
 "sizinti:1": [
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "41-42, 372",
   "p": 0.558
  },
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "45, 148, 173-174, 210-213, 950",
   "p": 0.555
  }
 ],
 "sizinti:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "170-180, 336, 538-543",
   "p": 0.563
  },
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "277, 324-325, 334",
   "p": 0.556
  }
 ],
 "knn:1": [
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "35, 49-50, 58",
   "p": 0.585
  },
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "170-174, 211",
   "p": 0.551
  }
 ],
 "knn:2": [
  {
   "k": "Bishop, C. M. (2006) · Pattern Recognition and Machine Learning",
   "s": "146-147",
   "p": 0.616
  },
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "52-58, 72, 114",
   "p": 0.595
  }
 ],
 "agac:1": [
  {
   "k": "Bishop, C. M. (2006) · Pattern Recognition and Machine Learning",
   "s": "685-686, 695",
   "p": 0.585
  }
 ],
 "agac:3": [
  {
   "k": "Monarch, R. (Munro) (2021) · Human-in-the-Loop Machine Learning",
   "s": "92-95",
   "p": 0.557
  },
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "157, 198, 207, 829",
   "p": 0.555
  }
 ],
 "orman:1": [
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "97-100, 304",
   "p": 0.647
  },
  {
   "k": "Monarch, R. (Munro) (2021) · Human-in-the-Loop Machine Learning",
   "s": "92-95",
   "p": 0.594
  }
 ],
 "boosting:1": [
  {
   "k": "Bishop, C. M. (2006) · Pattern Recognition and Machine Learning",
   "s": "19, 673-682",
   "p": 0.592
  },
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "102",
   "p": 0.569
  }
 ],
 "boosting:2": [
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "97-106, 142",
   "p": 0.623
  },
  {
   "k": "Bishop, C. M. (2006) · Pattern Recognition and Machine Learning",
   "s": "677",
   "p": 0.543
  }
 ],
 "lojistik:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "123, 139-154, 209, 830, 926",
   "p": 0.689
  },
  {
   "k": "Bishop, C. M. (2006) · Pattern Recognition and Machine Learning",
   "s": "226",
   "p": 0.598
  }
 ],
 "lojistik:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "181",
   "p": 0.549
  },
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "71-81, 254-255, 290-293",
   "p": 0.548
  }
 ],
 "svm:1": [
  {
   "k": "Bishop, C. M. (2006) · Pattern Recognition and Machine Learning",
   "s": "346-347, 354, 363",
   "p": 0.655
  },
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "71-72, 80, 112-114",
   "p": 0.646
  }
 ],
 "svm:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "46, 186, 262-264, 477-479, 518, 849",
   "p": 0.534
  },
  {
   "k": "Bishop, C. M. (2006) · Pattern Recognition and Machine Learning",
   "s": "355-359",
   "p": 0.531
  }
 ],
 "soft-tree:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "140, 152-157, 172, 225, 350, 538, 849",
   "p": 0.521
  }
 ],
 "soft-tree:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "116, 128, 185, 359, 482, 496, 538-542, 611",
   "p": 0.608
  },
  {
   "k": "Tunstall, L., von Werra, L. & Wolf, T. (2022) · Natural Language Processing with Transformers",
   "s": "245",
   "p": 0.545
  }
 ],
 "soft-tree:3": [
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "89, 292-300",
   "p": 0.545
  },
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "141, 148, 611, 829",
   "p": 0.535
  }
 ],
 "boyut:1": [
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "154-160",
   "p": 0.643
  },
  {
   "k": "Bishop, C. M. (2006) · Pattern Recognition and Machine Learning",
   "s": "581-585, 595, 604, 619-622",
   "p": 0.564
  }
 ],
 "boyut:2": [
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "154-155, 167",
   "p": 0.598
  },
  {
   "k": "Monarch, R. (Munro) (2021) · Human-in-the-Loop Machine Learning",
   "s": "131",
   "p": 0.596
  }
 ],
 "boyut:3": [
  {
   "k": "Müller, A. C. & Guido, S. (2016) · Introduction to Machine Learning with Python",
   "s": "154-166, 177-182",
   "p": 0.613
  },
  {
   "k": "Tunstall, L., von Werra, L. & Wolf, T. (2022) · Natural Language Processing with Transformers",
   "s": "63",
   "p": 0.554
  }
 ],
 "optimizer:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "503-516, 524-534",
   "p": 0.678
  }
 ],
 "aktivasyon:1": [
  {
   "k": "Weidman, S. (2019) · Deep Learning from Scratch: Building with Python from First Principles",
   "s": "94, 124-125",
   "p": 0.696
  },
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "160-166",
   "p": 0.691
  }
 ],
 "aktivasyon:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "161-163, 198-202, 470",
   "p": 0.763
  },
  {
   "k": "Weidman, S. (2019) · Deep Learning from Scratch: Building with Python from First Principles",
   "s": "124-125",
   "p": 0.67
  }
 ],
 "mlp:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "65, 121, 158-160, 258-264, 287, 308, 315-322, 849",
   "p": 0.631
  }
 ],
 "regular:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "117, 170, 179-181, 536, 611",
   "p": 0.638
  },
  {
   "k": "Raschka, S. (2024) · Build a Large Language Model (From Scratch)",
   "s": "172, 221",
   "p": 0.609
  }
 ],
 "regular:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "181-187",
   "p": 0.706
  },
  {
   "k": "Weidman, S. (2019) · Deep Learning from Scratch: Building with Python from First Principles",
   "s": "115, 137-142",
   "p": 0.664
  }
 ],
 "batchnorm:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "157, 186, 198-203, 524",
   "p": 0.616
  },
  {
   "k": "Weidman, S. (2019) · Deep Learning from Scratch: Building with Python from First Principles",
   "s": "135-136",
   "p": 0.607
  }
 ],
 "batchnorm:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "308-315, 454",
   "p": 0.642
  },
  {
   "k": "Raschka, S. (2024) · Build a Large Language Model (From Scratch)",
   "s": "121",
   "p": 0.595
  }
 ],
 "embed:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "17, 342, 699-702, 717-727",
   "p": 0.639
  },
  {
   "k": "Monarch, R. (Munro) (2021) · Human-in-the-Loop Machine Learning",
   "s": "45",
   "p": 0.575
  }
 ],
 "embed:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "16-17, 698-702, 721, 729-730, 737",
   "p": 0.672
  }
 ],
 "transfer:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "46, 170, 188, 198, 363, 538-543, 609-611",
   "p": 0.624
  }
 ],
 "transfer:2": [
  {
   "k": "Xiao, T. & Zhu, J. (2025) · Foundations of Large Language Models",
   "s": "42, 218",
   "p": 0.571
  },
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "98",
   "p": 0.569
  }
 ],
 "token:1": [
  {
   "k": "Raschka, S. (2024) · Build a Large Language Model (From Scratch)",
   "s": "55-56, 71",
   "p": 0.757
  },
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "722-724",
   "p": 0.681
  }
 ],
 "token:2": [
  {
   "k": "Alammar, J. & Grootendorst, M. (2024) · Hands-On Large Language Models",
   "s": "82-84, 91, 114",
   "p": 0.685
  },
  {
   "k": "Tunstall, L., von Werra, L. & Wolf, T. (2022) · Natural Language Processing with Transformers",
   "s": "52-54, 126",
   "p": 0.646
  }
 ],
 "transformer:1": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "86",
   "p": 0.635
  },
  {
   "k": "Raschka, S. (2024) · Build a Large Language Model (From Scratch)",
   "s": "131-137",
   "p": 0.632
  }
 ],
 "transformer:2": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "32, 82-92",
   "p": 0.632
  },
  {
   "k": "Xiao, T. & Zhu, J. (2025) · Foundations of Large Language Models",
   "s": "48, 72",
   "p": 0.592
  }
 ],
 "sampling:1": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "114-116",
   "p": 0.73
  },
  {
   "k": "Raschka, S. (2024) · Build a Large Language Model (From Scratch)",
   "s": "176-177",
   "p": 0.665
  }
 ],
 "sampling:2": [
  {
   "k": "Tunstall, L., von Werra, L. & Wolf, T. (2022) · Natural Language Processing with Transformers",
   "s": "160-163",
   "p": 0.64
  },
  {
   "k": "Alammar, J. & Grootendorst, M. (2024) · Hands-On Large Language Models",
   "s": "241-243",
   "p": 0.603
  }
 ],
 "kvcache:1": [
  {
   "k": "Xiao, T. & Zhu, J. (2025) · Foundations of Large Language Models",
   "s": "75-87",
   "p": 0.585
  },
  {
   "k": "Alammar, J. & Grootendorst, M. (2024) · Hands-On Large Language Models",
   "s": "129-130",
   "p": 0.559
  }
 ],
 "kvcache:2": [
  {
   "k": "Xiao, T. & Zhu, J. (2025) · Foundations of Large Language Models",
   "s": "48, 75-88",
   "p": 0.685
  },
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "86",
   "p": 0.576
  }
 ],
 "multihead:1": [
  {
   "k": "Tunstall, L., von Werra, L. & Wolf, T. (2022) · Natural Language Processing with Transformers",
   "s": "94",
   "p": 0.619
  },
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "86",
   "p": 0.61
  }
 ],
 "multihead:2": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "448-451, 737",
   "p": 0.669
  },
  {
   "k": "Alammar, J. & Grootendorst, M. (2024) · Hands-On Large Language Models",
   "s": "153",
   "p": 0.621
  }
 ],
 "egitim-llm:1": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "102-104, 148",
   "p": 0.615
  },
  {
   "k": "Tunstall, L., von Werra, L. & Wolf, T. (2022) · Natural Language Processing with Transformers",
   "s": "8",
   "p": 0.598
  }
 ],
 "egitim-llm:2": [
  {
   "k": "Xiao, T. & Zhu, J. (2025) · Foundations of Large Language Models",
   "s": "6, 54-58, 144, 163, 179",
   "p": 0.597
  },
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "108, 134",
   "p": 0.59
  }
 ],
 "rag:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "9-16, 349-354, 363, 390",
   "p": 0.583
  },
  {
   "k": "Tunstall, L., von Werra, L. & Wolf, T. (2022) · Natural Language Processing with Transformers",
   "s": "137",
   "p": 0.557
  }
 ],
 "rag:2": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "9, 193, 280, 288-291",
   "p": 0.575
  },
  {
   "k": "Xiao, T. & Zhu, J. (2025) · Foundations of Large Language Models",
   "s": "141-144",
   "p": 0.556
  }
 ],
 "llm-embed:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "17, 699-702, 717-721, 729-730, 737, 848",
   "p": 0.63
  }
 ],
 "halusinasyon:1": [
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "213, 342, 354-363, 975",
   "p": 0.527
  },
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "115, 129-134, 143",
   "p": 0.52
  }
 ],
 "halusinasyon:2": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "9-14, 131-134, 277-278",
   "p": 0.563
  },
  {
   "k": "Xiao, T. & Zhu, J. (2025) · Foundations of Large Language Models",
   "s": "141, 211, 226",
   "p": 0.525
  }
 ],
 "eval:1": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "230-231",
   "p": 0.654
  },
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "951-961",
   "p": 0.6
  }
 ],
 "eval:2": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "9, 224-236, 254",
   "p": 0.601
  }
 ],
 "prompt:1": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "18, 235-244, 253-257, 274-275",
   "p": 0.671
  },
  {
   "k": "Alammar, J. & Grootendorst, M. (2024) · Hands-On Large Language Models",
   "s": "254",
   "p": 0.624
  }
 ],
 "ajan:1": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "11, 233, 277, 299",
   "p": 0.552
  },
  {
   "k": "Zhang, A., Lipton, Z. C., Li, M. & Smola, A. J. (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "56-61, 546",
   "p": 0.528
  }
 ],
 "judge:1": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "167-170, 180, 231",
   "p": 0.568
  },
  {
   "k": "Monarch, R. (Munro) (2021) · Human-in-the-Loop Machine Learning",
   "s": "255-259, 285",
   "p": 0.55
  }
 ],
 "maliyet:1": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "95, 201-202, 251-253, 279",
   "p": 0.57
  }
 ],
 "arena:1": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "172-179, 231",
   "p": 0.595
  }
 ],
 "rag-kir:1": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "9, 18, 193, 277-280, 288, 295",
   "p": 0.53
  }
 ],
 "kirmizi:1": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "18, 259-263, 272-275",
   "p": 0.625
  }
 ]
};
