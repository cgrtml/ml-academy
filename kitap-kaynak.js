/* ═══════════════════════════════════════════════════════════════
   KITAP KAYNAKLARI — her ders adimi icin ilgili kitap bolumu.

   Uretim: ml-books-rag/scripts/kaynak_haritasi.py. Adim metni ders
   kitabi korpusunda aranir, en yakin bolumler sayfa araligiyla
   yazilir. Burada SADECE atif vardir; kitap metni yer almaz.

   Eslesme otomatiktir, benzerlik esigi 0.50. Yanlis eslesme gorursen
   bildir, esik yukseltilir ya da o adim elle duzeltilir.
   ═══════════════════════════════════════════════════════════════ */
const KITAP_KAYNAK = {
 "veri:2": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "44-48",
   "p": 0.586
  },
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "18, 37, 223",
   "p": 0.557
  }
 ],
 "veri:3": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "44, 81, 148, 496",
   "p": 0.528
  }
 ],
 "veri:5": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "44-47, 174",
   "p": 0.598
  }
 ],
 "ezber:2": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "171-173",
   "p": 0.639
  },
  {
   "k": "Andrew Ng ve ark. (2023) · CS229 Lecture Notes",
   "s": "115-116",
   "p": 0.537
  }
 ],
 "ezber:3": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "117, 171",
   "p": 0.556
  }
 ],
 "ezber:4": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "46, 173-174, 188",
   "p": 0.659
  }
 ],
 "nasil-ogrenir:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "116-117, 127-129",
   "p": 0.685
  }
 ],
 "nasil-ogrenir:2": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "45, 115, 953",
   "p": 0.702
  },
  {
   "k": "Seth Weidman (2019) · Deep Learning from Scratch: Building with Python from First Principles",
   "s": "64",
   "p": 0.646
  }
 ],
 "nasil-ogrenir:3": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "116-117, 129, 883",
   "p": 0.534
  }
 ],
 "nasil-ogrenir:4": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "96, 195, 883-889",
   "p": 0.698
  },
  {
   "k": "Sebastian Raschka (2024) · Build a Large Language Model (From Scratch)",
   "s": "285",
   "p": 0.658
  }
 ],
 "nasil-ogrenir:5": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "116, 128, 480, 502",
   "p": 0.669
  },
  {
   "k": "François Fleuret · The Little Book of Deep Learning",
   "s": "35",
   "p": 0.654
  }
 ],
 "nasil-ogrenir:6": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "524-534",
   "p": 0.631
  },
  {
   "k": "Mohamed Aazi · Mathematics for Machine Learning: A Comprehensive Guide to Building Mathematical Foundations for AI and Data Science",
   "s": "91",
   "p": 0.603
  }
 ],
 "nasil-ogrenir:7": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "128, 535-536, 611",
   "p": 0.563
  },
  {
   "k": "Sebastian Raschka (2024) · Build a Large Language Model (From Scratch)",
   "s": "297",
   "p": 0.552
  }
 ],
 "nasil-ogrenir:8": [
  {
   "k": "Andrew Ng ve ark. (2023) · CS229 Lecture Notes",
   "s": "10-11, 24, 83",
   "p": 0.62
  },
  {
   "k": "Seth Weidman (2019) · Deep Learning from Scratch: Building with Python from First Principles",
   "s": "64, 76",
   "p": 0.613
  }
 ],
 "ezberleme:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "46, 157-158, 173",
   "p": 0.56
  }
 ],
 "ezberleme:2": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "174-180",
   "p": 0.66
  },
  {
   "k": "Andrew Ng ve ark. (2023) · CS229 Lecture Notes",
   "s": "118-120",
   "p": 0.572
  }
 ],
 "ezberleme:3": [
  {
   "k": "Andrew Ng ve ark. (2023) · CS229 Lecture Notes",
   "s": "116-118",
   "p": 0.618
  },
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "173-179",
   "p": 0.614
  }
 ],
 "ezberleme:4": [
  {
   "k": "Andrew Ng ve ark. (2023) · CS229 Lecture Notes",
   "s": "116-120",
   "p": 0.589
  }
 ],
 "soft-split:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "705, 849",
   "p": 0.554
  },
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "88, 301-304",
   "p": 0.518
  }
 ],
 "soft-split:2": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "115",
   "p": 0.523
  },
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "152, 162, 849",
   "p": 0.522
  }
 ],
 "soft-split:3": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "96, 196, 485, 870",
   "p": 0.562
  },
  {
   "k": "Seth Weidman (2019) · Deep Learning from Scratch: Building with Python from First Principles",
   "s": "240",
   "p": 0.527
  }
 ],
 "soft-split:5": [
  {
   "k": "David L. Poole, Alan K. Mackworth (2017-2023) · Python for Artificial Intelligence: Foundations of Computational Agents",
   "s": "167-171",
   "p": 0.509
  }
 ],
 "algoritma:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "52",
   "p": 0.585
  },
  {
   "k": "Cormen, T. H. ve ark. (2009) · Introduction to Algorithms (Third Edition)",
   "s": "171, 220, 236-240",
   "p": 0.54
  }
 ],
 "algoritma:2": [
  {
   "k": "Cormen, T. H. ve ark. (2009) · Introduction to Algorithms (Third Edition)",
   "s": "227-231",
   "p": 0.596
  }
 ],
 "algoritma:3": [
  {
   "k": "Cormen, T. H. ve ark. (2009) · Introduction to Algorithms (Third Edition)",
   "s": "61, 222-228",
   "p": 0.538
  }
 ],
 "algoritma:4": [
  {
   "k": "Cormen, T. H. ve ark. (2009) · Introduction to Algorithms (Third Edition)",
   "s": "61, 222",
   "p": 0.582
  }
 ],
 "algoritma:5": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "41-43, 65, 829",
   "p": 0.614
  }
 ],
 "noron:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "122, 157-160, 186",
   "p": 0.586
  },
  {
   "k": "David L. Poole, Alan K. Mackworth (2017-2023) · Python for Artificial Intelligence: Foundations of Computational Agents",
   "s": "5",
   "p": 0.544
  }
 ],
 "noron:2": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "60, 122, 184-186",
   "p": 0.583
  }
 ],
 "noron:3": [
  {
   "k": "Seth Weidman (2019) · Deep Learning from Scratch: Building with Python from First Principles",
   "s": "79-80, 95-101",
   "p": 0.616
  }
 ],
 "attention:1": [
  {
   "k": "Alammar, J. & Grootendorst, M. (2024) · Hands-On Large Language Models",
   "s": "35-37, 135-136",
   "p": 0.685
  },
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "437, 769-775",
   "p": 0.63
  }
 ],
 "attention:2": [
  {
   "k": "Sebastian Raschka (2024) · Build a Large Language Model (From Scratch)",
   "s": "87-94",
   "p": 0.722
  },
  {
   "k": "François Fleuret · The Little Book of Deep Learning",
   "s": "87-88",
   "p": 0.665
  }
 ],
 "attention:3": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "437, 453, 460, 769",
   "p": 0.63
  },
  {
   "k": "Tunstall, L., von Werra, L. & Wolf, T. (2022) · Natural Language Processing with Transformers",
   "s": "94, 108",
   "p": 0.618
  }
 ],
 "backprop:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "194-197, 889",
   "p": 0.704
  }
 ],
 "backprop:2": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "6, 60, 128, 538",
   "p": 0.572
  }
 ],
 "cnn:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "253-259, 664",
   "p": 0.728
  }
 ],
 "cnn:2": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "258-261, 272",
   "p": 0.586
  }
 ],
 "kumeleme:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "47-48, 56",
   "p": 0.611
  },
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "182-183",
   "p": 0.586
  }
 ],
 "kumeleme:2": [
  {
   "k": "Larry Wasserman · Statistical Methods for Machine Learning (Lecture Notes)",
   "s": "224-229",
   "p": 0.66
  }
 ],
 "siniflandirma:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "49, 113, 135",
   "p": 0.641
  }
 ],
 "siniflandirma:2": [
  {
   "k": "Andrew Ng ve ark. (2023) · CS229 Lecture Notes",
   "s": "60-61",
   "p": 0.643
  },
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "49, 100, 137-140",
   "p": 0.598
  }
 ],
 "metrikler:1": [
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "291-292",
   "p": 0.591
  },
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "148, 173, 956-959",
   "p": 0.549
  }
 ],
 "metrikler:2": [
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "290, 297, 307",
   "p": 0.571
  }
 ],
 "bolme:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "46, 173",
   "p": 0.697
  },
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "265, 276-277, 316",
   "p": 0.609
  }
 ],
 "bolme:2": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "174, 220-222",
   "p": 0.612
  },
  {
   "k": "Larry Wasserman · Statistical Methods for Machine Learning (Lecture Notes)",
   "s": "202",
   "p": 0.604
  }
 ],
 "sizinti:1": [
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "41-42, 372",
   "p": 0.559
  },
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "148, 173, 210-213",
   "p": 0.555
  }
 ],
 "sizinti:2": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "170-173, 336",
   "p": 0.562
  },
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "277, 325, 334",
   "p": 0.556
  }
 ],
 "agac:1": [
  {
   "k": "Larry Wasserman · Statistical Methods for Machine Learning (Lecture Notes)",
   "s": "197, 213",
   "p": 0.629
  }
 ],
 "agac:2": [
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "87-89",
   "p": 0.52
  }
 ],
 "orman:1": [
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "97-100",
   "p": 0.647
  }
 ],
 "boosting:1": [
  {
   "k": "Larry Wasserman · Statistical Methods for Machine Learning (Lecture Notes)",
   "s": "106, 199-201",
   "p": 0.587
  }
 ],
 "lojistik:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "123, 140, 154, 830",
   "p": 0.689
  }
 ],
 "lojistik:2": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "181",
   "p": 0.549
  },
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "73-76, 254",
   "p": 0.548
  }
 ],
 "soft-tree:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "140, 172, 225, 849",
   "p": 0.521
  },
  {
   "k": "Larry Wasserman · Statistical Methods for Machine Learning (Lecture Notes)",
   "s": "163, 211",
   "p": 0.508
  }
 ],
 "soft-tree:2": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "359, 482, 538-541",
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
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "89, 292-298",
   "p": 0.546
  },
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "141, 148, 611, 829",
   "p": 0.536
  }
 ],
 "boyut:1": [
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "154-160",
   "p": 0.643
  }
 ],
 "boyut:3": [
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "177-182",
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
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "524-531",
   "p": 0.678
  },
  {
   "k": "Mohamed Aazi · Mathematics for Machine Learning: A Comprehensive Guide to Building Mathematical Foundations for AI and Data Science",
   "s": "91",
   "p": 0.65
  }
 ],
 "aktivasyon:2": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "162, 198-199, 470",
   "p": 0.763
  },
  {
   "k": "Seth Weidman (2019) · Deep Learning from Scratch: Building with Python from First Principles",
   "s": "124-125",
   "p": 0.67
  }
 ],
 "mlp:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "158, 264, 315, 849",
   "p": 0.631
  }
 ],
 "regular:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "170, 179-180, 536",
   "p": 0.638
  },
  {
   "k": "Sebastian Raschka (2024) · Build a Large Language Model (From Scratch)",
   "s": "172, 221",
   "p": 0.609
  }
 ],
 "regular:2": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "182-187",
   "p": 0.706
  },
  {
   "k": "Andrew Ng ve ark. (2023) · CS229 Lecture Notes",
   "s": "137",
   "p": 0.673
  }
 ],
 "batchnorm:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "186, 198",
   "p": 0.615
  },
  {
   "k": "Seth Weidman (2019) · Deep Learning from Scratch: Building with Python from First Principles",
   "s": "135-136",
   "p": 0.607
  }
 ],
 "batchnorm:2": [
  {
   "k": "François Fleuret · The Little Book of Deep Learning",
   "s": "79-81",
   "p": 0.655
  },
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "308-315",
   "p": 0.642
  }
 ],
 "embed:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "702, 717-721",
   "p": 0.639
  },
  {
   "k": "Monarch, R. (Munro) (2021) · Human-in-the-Loop Machine Learning",
   "s": "45",
   "p": 0.577
  }
 ],
 "embed:2": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "702, 729-730, 737",
   "p": 0.672
  },
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "288",
   "p": 0.537
  }
 ],
 "transfer:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "538, 609-611",
   "p": 0.624
  }
 ],
 "transfer:2": [
  {
   "k": "Tong Xiao ve ark. (2025) · Foundations of Large Language Models",
   "s": "42, 218-224",
   "p": 0.571
  },
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "82, 95-98",
   "p": 0.569
  }
 ],
 "token:1": [
  {
   "k": "Sebastian Raschka (2024) · Build a Large Language Model (From Scratch)",
   "s": "55-56, 71",
   "p": 0.756
  },
  {
   "k": "François Fleuret · The Little Book of Deep Learning",
   "s": "34",
   "p": 0.738
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
   "p": 0.636
  },
  {
   "k": "Sebastian Raschka (2024) · Build a Large Language Model (From Scratch)",
   "s": "131-137",
   "p": 0.632
  }
 ],
 "transformer:2": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "32, 88-92",
   "p": 0.632
  },
  {
   "k": "Tong Xiao ve ark. (2025) · Foundations of Large Language Models",
   "s": "48, 72, 87",
   "p": 0.592
  }
 ],
 "sampling:1": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "115-116",
   "p": 0.731
  },
  {
   "k": "Sebastian Raschka (2024) · Build a Large Language Model (From Scratch)",
   "s": "176-177",
   "p": 0.666
  }
 ],
 "sampling:2": [
  {
   "k": "Tunstall, L., von Werra, L. & Wolf, T. (2022) · Natural Language Processing with Transformers",
   "s": "160-163",
   "p": 0.641
  },
  {
   "k": "Alammar, J. & Grootendorst, M. (2024) · Hands-On Large Language Models",
   "s": "241-243",
   "p": 0.603
  }
 ],
 "kvcache:1": [
  {
   "k": "Tong Xiao ve ark. (2025) · Foundations of Large Language Models",
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
   "k": "Tong Xiao ve ark. (2025) · Foundations of Large Language Models",
   "s": "48, 75, 87-88",
   "p": 0.684
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
   "p": 0.618
  },
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "86",
   "p": 0.61
  }
 ],
 "multihead:2": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "448-451, 737",
   "p": 0.669
  },
  {
   "k": "François Fleuret · The Little Book of Deep Learning",
   "s": "95",
   "p": 0.63
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
   "k": "Tong Xiao ve ark. (2025) · Foundations of Large Language Models",
   "s": "6, 54-55, 179",
   "p": 0.598
  },
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "108, 134-135",
   "p": 0.59
  }
 ],
 "rag:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "10-16, 353-354",
   "p": 0.585
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
   "s": "280, 288-291",
   "p": 0.575
  },
  {
   "k": "Tong Xiao ve ark. (2025) · Foundations of Large Language Models",
   "s": "141-144",
   "p": 0.555
  }
 ],
 "llm-embed:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "702, 717, 729, 737",
   "p": 0.63
  }
 ],
 "halusinasyon:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "342, 358-363, 975",
   "p": 0.527
  },
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "115, 129-131, 143",
   "p": 0.52
  }
 ],
 "halusinasyon:2": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "14, 133, 277-278",
   "p": 0.562
  },
  {
   "k": "Tong Xiao ve ark. (2025) · Foundations of Large Language Models",
   "s": "111, 141, 211, 226",
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
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "959-961",
   "p": 0.6
  }
 ],
 "eval:2": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "226-232",
   "p": 0.601
  }
 ],
 "prompt:1": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "18, 236, 244",
   "p": 0.671
  },
  {
   "k": "Alammar, J. & Grootendorst, M. (2024) · Hands-On Large Language Models",
   "s": "244, 252-254",
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
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "56-61, 546",
   "p": 0.53
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
   "s": "256-258",
   "p": 0.55
  }
 ],
 "maliyet:1": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "201-202, 279",
   "p": 0.57
  }
 ],
 "arena:1": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "175",
   "p": 0.595
  }
 ],
 "rag-kir:1": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "193, 277-279, 288",
   "p": 0.529
  },
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "98, 210-213, 349",
   "p": 0.504
  }
 ],
 "kirmizi:1": [
  {
   "k": "Huyen, C. (2024) · AI Engineering: Building Applications with Foundation Models",
   "s": "272-274",
   "p": 0.625
  }
 ],
 "ridge:1": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "115, 219, 954",
   "p": 0.571
  },
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "62-67, 74",
   "p": 0.522
  }
 ],
 "ridge:2": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "115, 181",
   "p": 0.63
  },
  {
   "k": "Larry Wasserman · Statistical Methods for Machine Learning (Lecture Notes)",
   "s": "112-113",
   "p": 0.591
  }
 ],
 "ridge:3": [
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "63-64",
   "p": 0.641
  },
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "219-222",
   "p": 0.594
  }
 ],
 "ridge:4": [
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "220-222",
   "p": 0.591
  },
  {
   "k": "Larry Wasserman · Statistical Methods for Machine Learning (Lecture Notes)",
   "s": "36, 112, 126, 142",
   "p": 0.544
  }
 ],
 "lasso:1": [
  {
   "k": "Larry Wasserman · Statistical Methods for Machine Learning (Lecture Notes)",
   "s": "112-117, 128",
   "p": 0.612
  },
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "63-67",
   "p": 0.606
  }
 ],
 "lasso:2": [
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "67-69",
   "p": 0.62
  },
  {
   "k": "Larry Wasserman · Statistical Methods for Machine Learning (Lecture Notes)",
   "s": "111-115",
   "p": 0.577
  }
 ],
 "lasso:3": [
  {
   "k": "Andreas C. Müller, Sarah Guido (2017) · Introduction to Machine Learning with Python: A Guide for Data Scientists",
   "s": "63-69",
   "p": 0.693
  },
  {
   "k": "Larry Wasserman · Statistical Methods for Machine Learning (Lecture Notes)",
   "s": "94, 112-115",
   "p": 0.641
  }
 ],
 "norm-l1l2:1": [
  {
   "k": "Larry Wasserman · Statistical Methods for Machine Learning (Lecture Notes)",
   "s": "113, 125-128",
   "p": 0.673
  },
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "181",
   "p": 0.6
  }
 ],
 "norm-l1l2:3": [
  {
   "k": "Larry Wasserman · Statistical Methods for Machine Learning (Lecture Notes)",
   "s": "94, 111-115",
   "p": 0.665
  },
  {
   "k": "Aston Zhang, Zachary C. Lipton, Mu Li, Alexander J. Smola (2022) · Derin Öğrenmeye Dalış (Dive into Deep Learning)",
   "s": "181",
   "p": 0.662
  }
 ]
};
