/* ═══════════════════════════════════════════════════════════════
   ENGLISH LESSON CONTENT

   Lessons in here override the Turkish ones when the interface
   language is EN. A lesson that is missing simply falls back to
   Turkish, so this file can grow one lesson at a time.

   The shape is identical to content.js. Same viz names, same
   state keys, same numbers. Only the prose changes, so nothing
   in the engine or in the verification suite has to know about
   this file.
   ═══════════════════════════════════════════════════════════════ */
const DERSLER_EN = {};

DERSLER_EN['veri'] = {
  ad:'Data, features, labels',
  alt:'The raw material of machine learning. Get these three words right and everything else stacks on top of them.',
  kaynaklar:[{"y": "Alpaydın, E.", "t": "2020", "b": "Introduction to Machine Learning, 4th edition, Chapter 1", "n": "MIT Press"}],

  rota:0,
  adimlar:[
  {
    t:'This is a dataset',
    goal:'Machine learning starts with a table. First you will learn to read that table correctly.',
    todo:'Look at the table. How many rows, how many columns? Then continue.',
    kind:'static', viz:'tablo', state:{},
    body:'<p>10 students. For each of them we collected two things: <b>how many hours they studied per week</b> and <b>the score they got on the exam</b>.</p>' +
         '<p>That is all. This is where machine learning begins, not with anything magical, with a table.</p>' +
         '<p>Our goal: pull a rule out of this table that also works for a new student who is <b>not in the table</b>.</p>',
    learned:'<b>Machine learning starts with a table.</b> Rows tell you who was measured, columns tell you what was measured. ' +
      'There is no magic box here, only numbers somebody wrote down.<br><br>' +
      'And the goal is not to summarise this table: it is to produce a prediction for a student who is <b>not in it</b>.',
    xp:10,
  },
  {
    t:'Columns: feature and label',
    goal:'The columns of a table are not equal. Some are <b>input</b>, one is <b>output</b>. You will learn to tell them apart.',
    todo:'Use NEXT to walk through the three stages and watch the highlighted column each time.',
    kind:'phases', viz:'tablo',
    phases:[
      {state:{col:0}, body:'<p>The first column is just a <b>name</b>. It teaches the model nothing. Ada being called "Ada" does not affect her score.</p>' +
        '<p>Columns like this are <b>not given</b> to the model. (If you do give it, the model will try to predict the score from the name, which is absurd and, surprisingly, a common mistake.)</p>'},
      {state:{col:1}, body:'<p>The second column is the <b>FEATURE</b>. It is usually written as <b>x</b>.</p>' +
        '<p>A feature is <b>what the model has in hand</b>. When it makes a prediction, this is all it is allowed to look at. Real problems have hundreds of features rather than one: age, income, click count, pixel values and so on.</p>'},
      {state:{col:2}, body:'<p>The third column is the <b>LABEL</b>. It is usually written as <b>y</b>.</p>' +
        '<p>The label is <b>what the model is asked to predict</b>. During training we show it the right answer so it can correct itself.</p>' +
        '<p>Learning <b>with</b> labels is called <b>supervised learning</b>. Without them it becomes unsupervised learning, which later tracks cover.</p>'},
    ],
    quiz:{ q:'A loan application arrives at a bank. In the model "will this person repay the loan?", which one is the <b>label</b>?',
      opts:[
        {t:'The applicant\'s income', why:'No, that is a <b>feature</b>. It is information we already have and hand to the model.'},
        {t:'The applicant\'s age', why:'No, that is a feature too.'},
        {t:'Whether they repaid the loan', why:'Correct. This is the thing we want to predict. For past applications it is <b>known</b> (the model learns from it), for a new application it is <b>unknown</b> (the model predicts it).'},
        {t:'The application date', why:'No, that is a feature (sometimes useful, sometimes dangerous, as the lesson on data leakage shows).'},
      ], correct:2 },
    learned:'<b>Feature (x) = what the model has in hand. Label (y) = what it is asked to predict.</b> ' +
      'Every machine learning problem starts by answering one question: which column is x, which column is y?',
    xp:25,
  },
  {
    t:'Rows: every row is one sample',
    goal:'Columns say "what we measured", rows say "who we measured". The model learns from rows.',
    todo:'Drag the slider and walk through the rows one by one.',
    kind:'controls', viz:'tablo',
    controls:[{k:'row', lb:'ROW', min:0, max:9, step:1, val:0, fmt:v => 'student '+(v+1)}],
    live:s => [['SAMPLE', DATA.study.isim[s.row]], ['x (hours)', DATA.study.X[s.row]], ['y (score)', DATA.study.Y[s.row]]],
    body:'<p>Every row is called a <b>sample</b> (also instance or observation). One sample = one (x, y) pair.</p>' +
      '<p>The model looks at these pairs one at a time and tries to answer "what is the relationship between x and y?"</p>' +
      '<p><b>The number of samples is critical.</b> A relationship found in 10 samples can be a coincidence; one found in 10,000 usually is not. ' +
      'When you work with little data, "is this real or is it chance?" becomes the vital question, and the last lesson of Track 0 is exactly that.</p>',
    learned:'<b>One row = one sample = one (x, y) pair.</b> The model derives its rule by looking at these pairs.<br><br>' +
      'The number of samples decides how much you can trust the result. A relationship seen in 10 samples can be luck, ' +
      'one seen in 10,000 usually is not. Telling those two apart is what the last lesson of Track 0 is about.',
    xp:15,
  },
  {
    t:'From table to plot',
    goal:'Seeing the same data as a <b>plot</b> lets you catch the relationship by eye. Almost every lesson from here on lives on this plot.',
    todo:'Press PLAY and watch the table turn into points.',
    kind:'play', viz:'tabloGrafik',
    frames:() => { const F = [];
      for (let i=0;i<=24;i++) F.push({state:{t:i/24},
        body: i===0 ? '<p>Starting point: all we have is numbers.</p>'
             : (i<24 ? '<p>Each row moves to a point, with <b>x</b> (hours) on the horizontal axis and <b>y</b> (score) on the vertical one.</p>'
                     : '<p><b>This is what data is.</b> Same information, but now you <i>see</i> the relationship: the points rise to the right. ' +
                       'More study hours, higher score.</p><p>The job of a model is to turn that rise into <b>a numerical rule</b>.</p>')});
      return F; },
    learned:'<b>Same data, two different views.</b> The relationship you had to read row by row in the table is visible at a glance in the plot: ' +
      'the points rise to the right, more study hours means a higher score.<br><br>' +
      'Most of the later lessons happen on this plot, because it is the fastest way to see what a model is doing.',
    xp:15,
  },
  {
    t:'So what exactly is a "model"?',
    goal:'Here you will pin down the definition of a model. The whole next lesson is built on it.',
    todo:'Look at the plot: the yellow line asks about a student who is <b>not</b> in the table. Then answer the question.',
    kind:'controls', viz:'dogruUydur',
    controls:[{k:'sor', lb:'NEW STUDENT · x', min:0.5, max:10, step:0.5, val:6.5, fmt:v => v.toFixed(1)+' hours'}],
    state:{w:null, b:null},
    body:'<p>The yellow line marks a student who is not in the table. Someone who studied <b>6.5 hours</b>, for example.</p>' +
      '<p>This student is <b>not</b> in the data, so you cannot look the answer up. But looking at the points you can still guess, right? Around 70.</p>' +
      '<p><b>A model is the thing that makes that eyeball guess automatically and numerically.</b></p>',
    quiz:{ q:'What is the real worth of a model measured by?',
      opts:[
        {t:'How well it knows the points in the training data', why:'No, and this is the biggest trap for beginners. A model that knows the training data perfectly may simply have <b>memorised</b> it. The next lesson is entirely about this.'},
        {t:'How accurate it is on data it has never seen', why:'Correct. This is called <b>generalisation</b> and it is the only real measure of success in machine learning. A model is worth something if it predicts well for a student it never saw.'},
        {t:'How large and complicated it is', why:'No. Size is not a goal. A simple straight line often generalises better than a curve full of wiggles.'},
      ], correct:1 },
    learned:'<b>A model is a rule derived from data that also applies to samples it has never seen.</b><br><br>' +
      'Three words in your pocket: <b>feature (x)</b> input · <b>label (y)</b> output · <b>sample</b> one row. ' +
      'The next lesson shows how that rule is found, and what separates "memorising" from "learning a rule".',
    xp:35,
  },
]};

/* ═══════════════════════════════════════════════════════════════
   LESSON TITLES

   The curriculum on the home page reads its titles from ROTALAR,
   which is Turkish only. Without this map the interface switches to
   English but every lesson in the list stays Turkish. A title here
   does not claim the lesson body is translated: it only makes the
   navigation readable. DERSLER_EN above is still the source of truth
   for a fully translated lesson.
   ═══════════════════════════════════════════════════════════════ */
const DERS_ADI_EN = {
  /* rota 0 · start from zero */
  'algoritma':'What is an algorithm? (3D sorting)',
  'veri':'Data, features, labels',
  'ezber':'Memorise it, or find the rule?',
  'nasil-ogrenir':'How does a model learn?',
  'ezberleme':'Memorisation and generalisation (overfitting)',
  'siniflandirma':'Classification and the decision boundary',
  'metrikler':'Why accuracy lies to you',
  'bolme':'Train / validation / test',
  'sizinti':'Data leakage detective',
  'kanit':'Is this model really better?',
  'mat-matris':'Matrices: the hidden skeleton of AI',
  'mat-olasilik':'Probability: how a model dances with uncertainty',
  'neden-simdi':'Why it exploded now: data, compute, algorithms',
  'arama-uzayi':'Search space: turning a problem into nodes and edges',
  'kombinatorik':'Combinatorial explosion: why brute force collapses',

  /* rota 1 · classical machine learning */
  'knn':'k-NN: ask the nearest neighbour',
  'lojistik':'Logistic regression',
  'agac':'How a decision tree is built (CART)',
  'soft-split':'Hard threshold vs soft threshold',
  'soft-tree':'Training a soft tree with neural-trees',
  'orman':'Bagging and Random Forest',
  'boosting':'Boosting: building on top of the error',
  'svm':'SVM and the idea of the margin',
  'kumeleme':'k-means: learning without labels',
  'boyut':'PCA, t-SNE, UMAP',
  'regresyon':'Linear regression and least squares',
  'ridge':'Ridge: shrinking the coefficients',
  'lasso':'Lasso: squeezing a coefficient to zero',
  'norm-l1l2':'L1 and L2: two penalties, two different worlds',
  'yanlilik':'Bias and variance: a model’s two kinds of error',
  'boyut-laneti':'The curse of dimensionality: why neighbours drift apart',
  'softmax':'Softmax and cross-entropy',
  'dagilim-kaymasi':'When the ground moves: distribution shift',
  'hiper-arama':'Hyperparameter search: grid, random, halving',
  'gauss-surec':'Gaussian Process: a model that tells you its uncertainty',
  'bayes-reg':'The Bayesian view: can Occam’s razor be computed?',
  'fisher-lda':'Fisher’s idea: the best direction to separate classes',
  'uretici-ayirici':'Draw the boundary, or generate the data?',
  'spline':'Splines: bending the curve piece by piece',
  'gam':'Additive models: one curve per feature',
  'ozellik-onemi':'Feature importance: which variable is the model looking at?',
  'ozellik-muh':'Feature engineering: pulling new information out of data',
  'pekistirmeli':'Reinforcement learning: learning from reward',
  'a-yildiz':'A* search: finding the way with a good guess',
  'kisit':'Constraint satisfaction: a game of variables and rules',
  'hessian':'The Hessian: measuring the curvature of a curve',
  'taylor':'Taylor series: making the complicated locally simple',

  /* rota 2 · deep learning */
  'noron':'What does a single neuron do?',
  'mlp':'Layers and hidden representations',
  'backprop':'Backpropagation',
  'aktivasyon':'Activation functions',
  'optimizer':'SGD, Momentum, Adam: the race',
  'regular':'Stopping overfitting',
  'batchnorm':'Batch normalization',
  'cnn':'Convolution: the kernel walking over the image',
  'embed':'Embedding spaces',
  'transfer':'Transfer learning',
  'ilkleme':'Weight initialisation: Xavier and He',
  'patlayan':'Exploding gradients and clipping',
  'kisayol':'Skip connections: the ResNet idea',
  'havuzlama':'Pooling: summarising the image',
  'rnn':'RNN: holding the sequence in memory',
  'lstm':'LSTM: a network that learns to forget and to remember',
  'otokodlayici':'Autoencoder: learning from unlabelled data',
  'hesap-cizge':'The computation graph: how the derivative flows',
  'mdn':'When one answer is not enough: mixture density networks',
  'bayes-ag':'Bayesian networks: doubting the weights as well',
  'enc-dec':'Encoder or decoder: to understand, or to generate?',

  /* rota 3 · large language models */
  'token':'Tokenisation: how text becomes numbers',
  'llm-embed':'Where words sit in space',
  'attention':'Attention: the system that models you',
  'multihead':'Multi-head attention and positional encoding',
  'transformer':'One transformer block, end to end',
  'egitim-llm':'Pretrain / fine-tune / RLHF',
  'sampling':'Temperature, top-k, top-p',
  'halusinasyon':'Why hallucination happens',
  'rag':'The RAG pipeline',
  'kvcache':'Context window and the KV cache',
  'cot':'Chain-of-Thought: thinking before answering',
  'self-cons':'Self-consistency: trusting the majority',
  'oz-gozetim':'Self-supervision: making the label out of the data',
  'olcek-yasalari':'Scaling laws: what growth buys and what it costs',
  'perplexity':'Perplexity: measuring a model’s surprise',
  'talimat-ayar':'Teaching obedience: instruction tuning',
  'icl':'Teaching by example: in-context learning',
  'zincir-prompt':'Splitting the problem: prompt chaining',
  'gramer':'Forcing the output into shape: grammars and schemas',
  'hafiza':'Conversation memory: what does the model remember?',
  'tokenizer-fark':'Why tokenizers behave differently',
  'cokdilli':'The blind spot of multilingual models',
  'alan-model':'Domain-specific models: generalist or specialist?',
  'temel-model':'Foundation models: one model for everything',
  'llm-siniflandirici':'Turning an LLM into a classifier',
  'konu-kesif':'From embeddings to topics: finding topics by clustering',

  /* rota 4 · using ai in practice */
  'prompt':'Anatomy of a prompt',
  'eval':'Building an eval set',
  'arena':'Prompt Arena: blind comparison',
  'rag-kir':'The RAG breaking room',
  'ajan':'Agents and tool calling',
  'judge':'LLM-as-judge',
  'kirmizi':'Red teaming and defence',
  'maliyet':'Cost and latency',
  'kuantizasyon':'Quantisation: the price of shrinking a model',
  'acik-kapali':'Open or closed: how you get access to a model',
  'yigin':'The AI application stack: who builds what',
  'ai-vs-ml':'How AI engineering differs from classical ML',
  'proje-karari':'How to decide on an AI project',
  'adillik':'The model in the mirror: fairness and transparency',
  'automl':'AutoML: the model that picks your model',
  'aktif-ogrenme':'Active learning: which example should we label?',
  'leaderboard':'The leaderboard illusion: how much can you trust a ranking?',
};

DERSLER_EN['algoritma'] = {
  ad:'What is an algorithm?',
  alt:'Before we get to artificial intelligence, one thing has to be clear: how do you tell a computer to do a job, step by step? And why does that matter so much?',
  kaynaklar:[{"y":"Knuth, D. E.","t":"1998","b":"The Art of Computer Programming, Vol. 3: Sorting and Searching","n":"Addison-Wesley"},
             {"y":"Cormen, Leiserson, Rivest, Stein","t":"2009","b":"Introduction to Algorithms, 3rd edition","n":"MIT Press"}],
  rota:0,
  adimlar:[
  {
    t:'First ask this: what is it good for?',
    goal:'You will see, <b>as a number</b>, why sorting matters, by asking the same question of sorted and unsorted data.',
    todo:'The animation plays on its own. Watch how many checks each of the two lists needs.',
    kind:'play', viz:'arama', h:700, hiz:420, xp:35,
    learned:'<b>Choosing the algorithm matters more than the hardware.</b> Scanning an unsorted list costs n steps; binary search on a sorted one costs log₂n. On a billion records that is the difference between a billion and thirty.<br><br>Now let us look at <b>how</b> the sorting itself is done.',
    quiz:{
      q:'An online shop shows the "20 cheapest" out of 50 million products instantly. How is it doing that?',
      opts:[
        {t:'It scans all 50 million products on every request',
         why:'No. Scanning 50 million records would take seconds on every request. No user waits that long.'},
        {t:'It keeps the data <b>sorted</b> in advance; the list is already there, it just reads the first 20',
         why:'Correct. The sorting is done once, or in the background, and then millions of queries benefit from it. A database <b>index</b> is exactly this: a structure that was sorted ahead of time.'},
        {t:'It uses a faster computer',
         why:'Hardware helps, but it cannot close the gap between n and log n. 50 million versus 26 steps is not a difference in speed, it is a difference in <b>method</b>.'},
        {t:'It only shows popular products',
         why:'That might be a shortcut, but it does not answer the question. The "20 cheapest" still has to come out of the whole catalogue.'},
      ], correct:1 },
  },
  {
    t:'The problem: 8 boxes in a mess',
    goal:'You will see the constraints a computer is working under while it does this job.',
    todo:'Look at the boxes. How would you sort them? Then continue.',
    kind:'static', viz:'sirala', h:660, xp:10,
    state:{ dizi:[5,2,8,1,9,3,7,4], mesaj:'a mess, needs sorting' },
    body:'<p>Eight boxes, out of order. The task: <b>line them up from smallest to largest.</b></p>' +
         '<p>You solve this in seconds, because you see all of them <b>at once</b>. A computer cannot.</p>' +
         '<p>The only two things a computer can do here are: <b>compare two numbers</b> and <b>swap two boxes</b>. Nothing else.</p>' +
         '<p>An <b>algorithm</b> is a recipe that finishes the job with those two moves and leaves no gap for interpretation. "Sort it" is not an algorithm. "Look at the first pair, swap them if they are in the wrong order, move one to the right, repeat" is one.</p>',
    learned:'<b>A computer has two moves: compare and swap.</b> You sort eight boxes at a glance because you see all of them at the same time. The computer does not.<br><br>That is why "sort it" is not an algorithm. An algorithm is a recipe that finishes the job with those two moves and leaves nothing to interpretation.',
  },
  {
    t:'Watch bubble sort run',
    goal:'You will follow every step of an algorithm side by side with the line of code that causes it.',
    todo:'The animation plays and loops on its own. Use ⏸ to stop it, ◀ ▶ to walk it one step at a time.',
    kind:'play', viz:'sirala', h:660, hiz:230, xp:10,
    learned:'<b>Bubble sort repeats one rule: look at the neighbouring pair, swap if they are in the wrong order, move one to the right.</b> On this 8 element list it did 28 comparisons and 13 swaps.<br><br>At the end of every pass, the largest remaining number is guaranteed to reach the end, which is why the green region on the right keeps growing. That sentence is also the proof that the algorithm is correct.',
  },
  {
    t:'So how did it manage that?',
    goal:'You will stop the animation <b>pass by pass</b> and understand why the algorithm works at all.',
    todo:'Drag the pass slider from 0 to 7. Watch the green region on the right grow with every pass.',
    kind:'controls', viz:'turOzet', h:660, xp:45,
    body:'<p>In the animation you saw the individual comparisons, but <b>why it works</b> went by too fast. Let us stop it.</p>' +
         '<p><b>Every pass guarantees this:</b> after one sweep from left to right, the largest remaining number is certain to reach the far right. Whichever pair the largest number enters, it wins and moves one step right, and it never stops during the sweep.</p>' +
         '<p>So:</p>' +
         '<p>· <b>after pass 1</b> 1 number is definitely in place (the largest, on the right)<br>' +
         '· <b>after pass 2</b> 2 numbers are definitely in place<br>' +
         '· <b>after pass k</b> k numbers are definitely in place</p>' +
         '<p>The dashed green frame is that <b>locked region</b>. There is no reason to look at it again, which is why the code says <code>range(n - 1 - pass)</code>: every pass walks one box less.</p>' +
         '<p>After 7 passes 7 numbers are locked; the one number left over is necessarily the smallest. <b>The list is sorted.</b></p>' +
         '<p>This kind of reasoning is called a <b>loop invariant</b>: you find a statement that stays true on every pass, and with it you prove that the algorithm <i>works</i>. Not try it and see, <b>prove it</b>.</p>',
    learned:'<b>Understanding an algorithm means being able to prove why it produces the right answer.</b> The proof for bubble sort is one sentence: on every pass the largest remaining number reaches the end, therefore after k passes k numbers are certainly in place.<br><br>And its cost is n², so <b>how much work it spends</b> matters just as much as <b>what it does</b>.',
    controls:[{k:'tur', lb:'PASS', min:0, max:7, step:1, val:0}],
    quiz:{
      q:'Bubble sort did about 28 comparisons for 8 elements. How many does it do for 800?',
      opts:[
        {t:'About 2,800, proportional to the number of elements',
         why:'No. There are two nested loops: for every element we walk the list once more. The cost is not <b>linear</b> in the number of elements.'},
        {t:'About 320,000, proportional to the square of the number of elements (n²/2)',
         why:'Correct. For n=8, 28 ≈ 8²/2. For n=800, 800²/2 = 320,000. A hundred times more elements means <b>ten thousand times</b> more work. This is why bubble sort is not used in real systems; merge sort and quicksort run in n·log n.'},
        {t:'About 2,400, three times as many',
         why:'No, the cost of an algorithm does not scale like that.'},
        {t:'It does not change, always 28',
         why:'No, more elements definitely means more work.'},
      ], correct:1 },
  },
  {
    t:'So what makes artificial intelligence different?',
    goal:'You will learn the one fundamental difference between a classical algorithm and machine learning. The whole course turns on it.',
    todo:'Answer the question.',
    kind:'static', viz:'sirala', h:660, xp:40,
    state:{ dizi:[1,2,3,4,5,7,8,9], sirali:0, bitti:true, mesaj:'the rule was written by a HUMAN' },
    body:'<p>In bubble sort a <b>human</b> wrote the rule: "look at the neighbour, swap if they are out of order". The computer only applied it. The rule is fixed and never changes.</p>' +
         '<p>Now think about this job: <b>"is there a cat in this photo?"</b></p>' +
         '<p>Try writing the rule. "If the ears are pointy…", but what if the cat has its back turned? "If it is furry…", what about a hairless cat? "If it has four legs…", what about a dog? There are millions of exceptions and no human can write that rule.</p>' +
         '<p>People did try: from 1970 to 2010 computer vision worked on hand written feature extractors. Decades of work, limited success. Then the approach changed.</p>' +
         '<p><b>The idea behind machine learning:</b> we do not write the rule. We give the computer millions of examples and let it <b>find the rule itself</b>. This entire course is about how that finding is done.</p>',
    learned:'<b>Classical algorithm:</b> a human writes the rule, the computer applies it. The rule is fixed, provable, and always gives the same answer.<br><b>Machine learning:</b> a human supplies examples and a <i>learning procedure</i>, and the computer finds the rule itself. The rule depends on the data, it is approximate, and it makes mistakes.<br><br>In the next lesson we look at what those "examples" actually are.',
    quiz:{
      q:'What is the <b>fundamental</b> difference between bubble sort and a machine learning model?',
      opts:[
        {t:'ML models run faster',
         why:'No, usually the opposite. Training a model can take hours or even months. Speed is not the difference.'},
        {t:'A human writes the rule for bubble sort; an ML model <b>finds its rule from the data</b>',
         why:'Correct. In a classical algorithm the logic is baked into the code and is fixed. In ML the code only describes the <b>learning process</b>; the actual rule (the parameters) comes out of the data. Run the same code on different data and you get a different model, which is impossible with bubble sort.'},
        {t:'ML models do not make mistakes',
         why:'Absolutely not. ML models make mistakes constantly, and a large part of this course is about measuring and reducing that error.'},
        {t:'Bubble sort works on numbers, ML works on text',
         why:'No, both work on any kind of data. The difference is not the type of data, it is where the rule comes from.'},
      ], correct:1 },
  },
  ],
};

DERSLER_EN['ezber'] = {
  ad:'Memorising or finding the rule?',
  alt:'Both models know the training data. One of them has learned, the other has memorised. There is only one way to tell them apart.',
  kaynaklar:[{"y":"Alpaydın, E.","t":"2020","b":"Introduction to Machine Learning, 4th edition, Chapter 2","n":"MIT Press"},
             {"y":"Wolpert, D.","t":"1996","b":"The Lack of A Priori Distinctions Between Learning Algorithms (No Free Lunch)","n":"Neural Computation, 8(7)"}],
  rota:0,
  adimlar:[
  {
    t:'Two rival models',
    goal:'You will see two different approaches to the same data, and notice that both of them look like they are "working".',
    todo:'Compare the two panels.',
    kind:'static', viz:'ezberKural', xp:10, state:{},
    body:'<p><b style="color:#fb923c">On the left, the model that memorises.</b> The only thing it does is find the closest record to the question and repeat its answer. What comes out is a staircase, because the only thing it knows is 10 records.</p>' +
         '<p><b style="color:#22d3a0">On the right, the model that learns a rule.</b> It pulled a single straight line out of the points: <b>ŷ = 7.73·x + 20.8</b>. It passes through none of them exactly, but it caught the trend of all of them.</p>' +
         '<p>Now the critical question: <b>which one is better?</b> You cannot decide by looking at the plot. The memorising model even looks <i>closer</i> to the points.</p>',
    learned:'<b>Two approaches to the same data: memorise, or extract a rule.</b> The memorising model copies the nearest record, the rule learning model reduces everything to one formula: ŷ = 7.73·x + 20.8.<br><br>You cannot decide which one is good by looking at the plot. To decide you need a measurement, and the next step is where we try one.',
  },
  {
    t:'On the training data both are perfect',
    goal:'You will see why testing a model with <b>the data it learned from</b> proves nothing at all.',
    todo:'Use NEXT to walk through the two stages.',
    kind:'phases', viz:'ezberKural', xp:20,
    learned:'<b>On training data, memorising always wins.</b> For x = 4 the memoriser says 51 (the truth is 51) and the rule learner says 51.7. For x = 8 the memoriser says 80 (the truth is 80) and the rule learner says 82.6.<br><br>The memoriser\'s training error is exactly zero. Which means that if you measure a model with the data it learned from, <b>you will always pick the wrong model</b>.',
    phases:[
      {state:{yeni:4},
       body:'<p>Let us ask about a student who <b>is</b> in the table: x = 4 hours. The real score is 51.</p>' +
            '<p><b>Memoriser:</b> 51. Flawless, because it is holding that record in memory already.<br><b>Rule learner:</b> 51.7. Almost right, but not exactly.</p>' +
            '<p>This round the memoriser <b>won</b>. On training data, memorising always wins.</p>'},
      {state:{yeni:8},
       body:'<p>One more: x = 8, real score 80.</p>' +
            '<p><b>Memoriser:</b> 80. Flawless again. <b>Rule learner:</b> 82.6. Approximate again.</p>' +
            '<p>On the training data the memorising model\'s error is <b>exactly zero</b>. The rule learning model is always slightly off.</p>' +
            '<p style="color:#facc15"><b>Watch this:</b> if you had judged the models on training data alone, you would have picked the memoriser. And that would have been a very bad decision.</p>'},
    ],
  },
  {
    t:'Now bring in a student it has never seen',
    goal:'You will understand what generalisation means by putting the two models\' answers to the same new question side by side.',
    todo:'Move the slider <b>in between the whole numbers</b> (try 4.5, 6.5, 7.5). Compare what the two panels answer.',
    kind:'controls', viz:'ezberKural', xp:25,
    body:'<p><b style="color:#fb923c">The memorising model</b> has no idea what to do with a new question. All it can do is copy the closest record. The result: <b>when x changes a little the answer does not change at all</b>, and then it jumps. That is what the staircase means.</p>' +
         '<p><b style="color:#22d3a0">For the rule learning model</b> there is no such thing as a new question. It has a formula: put x in, take the answer out. When x changes smoothly, the answer changes smoothly.</p>' +
         '<p>Take <b>x = 6.5</b>: the memoriser says "66" (the score of the 6 hour student), the rule learner says "71". Which one makes sense? If 6 hours gives 66 and 7 hours gives 78, then answering 66 for 6.5 hours is plainly wrong.</p>',
    learned:'<b>Generalisation means giving a sensible answer to an input you have never seen.</b> For x = 6.5 the memoriser says 66 (it copies the 6 hour student\'s score), the rule learner says 71.<br><br>If 6 hours gives 66 and 7 hours gives 78, then 66 for 6.5 hours is plainly wrong. That is what the memoriser\'s staircase means: it rounds every value in between to the nearest record.',
    controls:[{k:'yeni', lb:'NEW STUDENT · x', min:0.5, max:10.4, step:0.1, val:6.5}],
  },
  {
    t:'It has a name: overfitting',
    goal:'You will learn the standard names for these two behaviours and why both of them are dangerous.',
    todo:'Answer the question.',
    kind:'static', viz:'ezberKural', xp:35, state:{yeni:6.5},
    body:'<p><b>Overfitting:</b> the model takes the training data too seriously and mistakes the noise for the rule. Perfect in training, poor in the real world. The memorising model on the left is the extreme case of this.</p>' +
         '<p><b>Underfitting:</b> the model is too simple and cannot capture even the structure that really is in the data. Poor in training and poor in the real world.</p>' +
         '<p>A good model sits between the two: <b>it catches the signal and not the noise.</b> But there is no shortcut for telling signal from noise, which is why we have to measure.</p>',
    learned:'<b>Success on training data is not success.</b> A model is obliged to know the data it saw; the real question is what it does with data it has not seen.<br><br>This is why we split the data in two from the start: <b>training</b> (the model learns from this) and <b>test</b> (the model never sees this, we only use it to grade).',
    quiz:{
      q:'How do you <b>prove</b> that the memorising model is actually bad?',
      opts:[
        {t:'I look at its error on the training data; if it is low the model is good',
         why:'No. The memorising model\'s training error is <b>zero</b>. By that measure it looks flawless. That is exactly why the measure is misleading.'},
        {t:'I look at how complex the model is',
         why:'Close, but not enough. Complexity is a <i>hint</i>, not proof. Sometimes a complex model really is necessary.'},
        {t:'I split the data in two from the start: I <b>hide</b> part of it from the model and test only on the hidden part',
         why:'Correct. This is called the <b>train/test split</b> and it is the most basic discipline in machine learning. What does the model do on data it has not seen? That is the only honest question, and the memorising model falls apart there.'},
        {t:'I collect more data',
         why:'That can help, but it does not <b>measure</b> the problem. You have to measure it first, then fix it.'},
      ], correct:2 },
  },
  ],
};

DERSLER_EN['nasil-ogrenir'] = {
  ad:'How does a model learn?',
  alt:'Gradient descent, the single most important idea in machine learning. From scratch, step by step, with your own hands.',
  kaynaklar:[{"y":"Cauchy, A.","t":"1847","b":"Méthode générale pour la résolution des systèmes d’équations simultanées","n":"C. R. Acad. Sci. Paris"},
             {"y":"Goodfellow, Bengio, Courville","t":"2016","b":"Deep Learning, Chapters 4 & 8","n":"MIT Press","u":"https://www.deeplearningbook.org/"}],
  rota:0,
  adimlar:[
  {
    t:'A model is a formula',
    goal:'A model\'s "knowledge" is nothing more than a few numbers. Here there are two: <b>w</b> and <b>b</b>. <b>You</b> are going to set them first.',
    todo:'Move the two sliders and fit the line to the points. Target: push the error <b>below 100</b>.',
    kind:'controls', viz:'dogruUydur', xp:40, state:{artik:true},
    body:'<p>The rule: <b>ŷ = w·x + b</b>. That is, "predicted score = slope × hours + base".</p>' +
         '<p><b>w</b> = how many points each extra hour of study is worth. <b>b</b> = the base score somebody who studies nothing would get. Those two numbers are <i>all the knowledge</i> the model has.</p>' +
         '<p>The dashed red lines show how wrong you are for each student. Try to make them short.</p>',
    learned:'You managed it, but did you notice how: <b>by trial and error</b>. With two parameters that is possible. A neural network has <b>billions</b> of them. You cannot move those by hand. Gradient descent is exactly the thing that turns this trial and error into a systematic procedure.',
    controls:[{k:'w', lb:'w · SLOPE', min:0, max:15, step:0.1, val:2},
              {k:'b', lb:'b · INTERCEPT', min:-10, max:50, step:1, val:40}],
  },
  {
    t:'How does the error become a single number?',
    goal:'The one number answer to "how bad is this model?" is the <b>loss function</b>. You will build it step by step.',
    todo:'Use NEXT to walk through the four stages.',
    kind:'phases', viz:'dogruUydur', xp:30,
    learned:'<b>A loss function reduces a model\'s badness to a single number.</b> Without it, "learning" has no definition. MSE is the standard for regression; classification uses cross-entropy, but the logic is exactly the same.',
    quiz:{
      q:'There were two reasons for squaring the errors. Which one was <b>not</b> a reason?',
      opts:[
        {t:'So that positive and negative errors do not cancel each other out',
         why:'That was a <b>real</b> reason. +10 and −10 add up to 0 and the model looks flawless.'},
        {t:'So that large errors are punished disproportionately and the model fixes them first',
         why:'That was a <b>real</b> reason too.'},
        {t:'So that the result stays between 0 and 1',
         why:'This is the right answer, it is <b>not</b> a reason. MSE is unbounded; in this lesson you will see it go past 2000.'},
      ], correct:2 },
    phases:[
      {state:{w:6.5, b:25},
       body:'<p>We have a random model in hand: <b>ŷ = 6.5·x + 25</b>. Not terrible, not perfect either.</p>' +
            '<p>The question: how do we say how "bad" this is <b>with a single number</b>? Because you cannot improve what you cannot measure.</p>'},
      {state:{w:6.5, b:25, artik:true},
       body:'<p><b>1 · Measure the error for every point.</b> The red lines are the gap between the real score and the prediction. The name for this is a <b>residual</b>.</p>' +
            '<p>But we cannot just add them up: some are positive, some negative. Added together they cancel out and the model <b>looks perfect</b>.</p>'},
      {state:{w:6.5, b:25, artik:true, kare:true},
       body:'<p><b>2 · Square every error.</b> Each line turned into a square whose side is that line. The <b>area</b> of the square is error².</p>' +
            '<p>Two gains: everything is positive now (they can no longer cancel out) <b>and</b> large errors are punished disproportionately, an error of 10 counting 100 times an error of 1.</p>'},
      {state:{w:6.5, b:25, artik:true, kare:true, mseGoster:true},
       body:'<p><b>3 · Take the average.</b> Add up all the square areas and divide by the number of samples. The single number that comes out is <b>MSE</b> (mean squared error).</p>' +
            '<p>Now learning has a clear target: <b>make this number smaller.</b> The whole of training is nothing more than that.</p>'},
    ],
  },
  {
    t:'A map of every possibility',
    goal:'Every (w, b) pair has an error. Draw them all at once and you get a <b>map</b>, and learning is the search for the lowest point on that map.',
    todo:'Wander around the map with the sliders. The yellow dots are the places <b>you</b> tried in step 1.',
    kind:'controls', viz:'kayipHarita', xp:30,
    body:'<p>The map on the left: horizontal axis <b>w</b>, vertical axis <b>b</b>. The colour of each pixel is that pair\'s error, <b style="color:#4cc4ff">dark = low error</b>, <b style="color:#f87171">red = high error</b>.</p>' +
         '<p>The green ring is the mathematically best point (w=7.73, b=20.8). The yellow dots are your own attempts by hand.</p>' +
         '<p>The learning problem has shrunk to one sentence: <b>find the lowest point on this map.</b></p>',
    learned:'<b>Learning is the search for the lowest point on the loss map.</b> But the map is invisible. All we have is the <b>slope</b> at the point where we are standing, like walking down a foggy mountain by feeling the ground under your feet.',
    controls:[{k:'w', lb:'w position', min:0.5, max:14.5, step:0.1, val:11},
              {k:'b', lb:'b position', min:-8, max:48, step:1, val:42}],
    quiz:{
      q:'Why can we not draw this map for a real neural network?',
      opts:[
        {t:'Computers cannot display that many colours',
         why:'No, the problem is not visualisation.'},
        {t:'There are billions of parameters, so instead of a 2D map there is a billion dimensional space, and scanning it is impossible',
         why:'Correct. Here we computed about 5000 points, 72×72, for 2 parameters. Doing the same thing with a billion parameters would take longer than the age of the universe. This is why we have to descend <b>without seeing the map</b>, using only the slope under our feet.'},
        {t:'The loss function is undefined for neural networks',
         why:'No, it is perfectly well defined, it just lives in very high dimension.'},
      ], correct:1 },
  },
  {
    t:'A compass in the fog: the derivative',
    goal:'Even when you cannot see the map, you can compute the <b>slope</b> at the point where you stand. That slope gives you a direction.',
    todo:'Move to different points with the sliders and watch how the two arrows turn.',
    kind:'controls', viz:'kayipHarita', xp:30, state:{gradyan:true},
    body:'<p><b style="color:#f87171">The red arrow is the gradient (∇L).</b> The derivative of the loss function with respect to each parameter. It always points <b>straight UPHILL</b>.</p>' +
         '<p><b style="color:#22d3a0">The green arrow is the opposite of the gradient.</b> We want to go down, so this is the way we move. The minus sign in the formula (θ − η∇L) exists for exactly this reason.</p>' +
         '<p><b>The critical part:</b> computing these arrows does not require knowing the map. We only take a few derivatives at the point where we stand. It works the same way in a billion dimensions, and in neural networks the algorithm that does it is called <b>backpropagation</b>.</p>',
    learned:'<b>The derivative is a local compass.</b> Without seeing the whole map, just by looking at the ground under your feet, you know which way to go.',
    controls:[{k:'w', lb:'w position', min:0.5, max:14.5, step:0.1, val:12},
              {k:'b', lb:'b position', min:-8, max:48, step:1, val:42}],
    quiz:{
      q:'If the gradient points straight uphill, why do we go the <b>other</b> way?',
      opts:[
        {t:'Because we want to <b>reduce</b> the error, and going downhill is what that means',
         why:'Correct. Loss is badness. Reducing badness means going down, which means the opposite of the gradient. That is the entire meaning of the minus sign in the formula.'},
        {t:'Because the derivative comes out with the wrong sign',
         why:'No, the derivative gives the right sign. We flip the direction deliberately.'},
        {t:'It is an arbitrary choice, it could have been a plus',
         why:'No. With a plus (gradient <i>ascent</i>) you would increase the error. That is a real method too, but its goal is to maximise a reward, and it is used in reinforcement learning.'},
      ], correct:0 },
  },
  {
    t:'The anatomy of a single step',
    goal:'You will follow <b>one</b> step of gradient descent, line of code by line of code, number by number.',
    todo:'Use NEXT to walk through the five stages. Watch the numbers that change at each one.',
    kind:'phases', viz:'kayipHarita', xp:50,
    learned:'<b>θ ← θ − η·∇L</b>, the single most important line in machine learning. Compute the slope, take a small step against it, repeat. Every model from GPT down to logistic regression is trained with this line.',
    phases:[
      {state:{w:12, b:42},
       body:'<p>Starting point: <b>w=12, b=42</b>. The line sits far above the points and the error is <b>2154</b>. A bad model.</p>'},
      {state:{w:12, b:42},
       body:'<p><b>Learning rate (lr) = 0.01.</b> The setting for "how far do I move in the direction the slope shows". In the last step we will try to break it.</p>'},
      {state:{w:12, b:42, gradyan:'ters'},
       body:'<p><b>Slope in the w direction: 562.20</b>. Positive, so if I <i>increase</i> w the error increases. Which means w has to <b>go down</b>.</p>'},
      {state:{w:12, b:42, gradyan:'ters'},
       body:'<p><b>Slope in the b direction: 89.40</b>. Also positive, so b has to go down as well. The two slopes together fix exactly the direction we move on the map.</p>'},
      {state:{w:6.377999999999999, b:41.106, yol:[[12,42],[6.377999999999999,41.106]]},
       body:'<p><b>The step is taken.</b> w: 12 − 0.01×562.20 = <b>6.38</b> · b: 42 − 0.01×89.40 = <b>41.1</b></p>' +
            '<p>The error goes from <b>2154</b> to <b>186</b>. A <b>91%</b> drop in a single step.</p>' +
            '<p><b>That is the whole of gradient descent.</b> Everything else is repeating this step.</p>'},
    ],
  },
  {
    t:'The same step, 2142 times',
    goal:'You have seen one step. Now you will watch the model <b>actually learn</b> as that step repeats.',
    todo:'Press PLAY. On the left the path is drawn on the map, on the right the line settles onto the points.',
    kind:'play', viz:'kayipHarita', xp:50,
    learned:'<b>Learning is the same small step repeated thousands of times.</b> No magic, no single clever move. You also saw that the first steps are fast and the rest is slow. That is the "valley" problem, and it is the reason modern optimizers exist.',
  },
  {
    t:'Break the learning rate',
    goal:'η is a <b>hyperparameter</b>. The model does not learn it, you choose it. Choose badly and training either crawls or explodes. You will see both.',
    todo:'Try all three regions: <b>0.001</b> (too small) · <b>0.01</b> (good) · <b>0.028+</b> (explosion). The question will not unlock until you have seen all three.',
    kind:'controls', viz:'kayipHarita', xp:60,
    learned:'<b>This is how a model learns:</b> (1) it makes a prediction · (2) it turns the error into a single number · (3) it computes the slope of that number · (4) it takes a small step against the slope · (5) it repeats thousands of times.<br><br>GPT does the same five things as the line you just trained. The only difference is the number of parameters: <b>2</b> here, <b>hundreds of billions</b> there.',
    controls:[{k:'lr', lb:'LEARNING RATE η', min:0.0005, max:0.032, step:0.0005, val:0.01}],
    quiz:{
      q:'<b>Scenario:</b> your team is training a neural network. At epoch 3 the loss became <code>nan</code>. What is your first move?',
      opts:[
        {t:'I collect more data',
         why:'No. <code>nan</code> does not come from a shortage of data, it comes from numerical overflow. Collecting data takes days and does not fix it.'},
        {t:'I make the model bigger, its capacity must be too small',
         why:'No, that is a move in the wrong direction. Making the model bigger usually makes the overflow worse.'},
        {t:'I lower the learning rate (and add gradient clipping)',
         why:'Correct. The most common cause of <code>nan</code> is an η that is far too large. It is the same thing you saw above 0.028 on this screen. First response: divide η by 10 and add gradient clipping.'},
        {t:'I increase the number of epochs',
         why:'No. Running a diverging training run for longer only produces more <code>nan</code>.'},
      ], correct:2 },
    bolgeSayisi:3,
  },
  {
    t:'Write the update line yourself',
    goal:'You will put everything you have learned into a single line, and the algorithm will actually run.',
    todo:'Fill the three boxes and press RUN. It runs even if you write it wrong; you get to see what happens.',
    kind:'controls', viz:'kayipHarita', xp:60,
    body:'<p>This entire lesson comes down to one line: <b>θ ← θ − η·∇L</b>. Now you build it.</p>' +
         '<p>Click the boxes and choose from the bank below. Once all three are filled, RUN unlocks.</p>',
    learned:'<b>θ ← θ − η·∇L</b>, the single most important line in machine learning. Compute the slope, take a small step against it, repeat. Every model from GPT down to logistic regression is trained with this line.',
    controls:[{k:'w', lb:'starting w', min:0.5, max:14.5, step:0.5, val:12},
              {k:'b', lb:'starting b', min:-8, max:48, step:1, val:42}],
    kodlab:{
      q:'Write the core line of gradient descent <b>yourself</b>. Fill the three boxes, then press RUN. The algorithm really runs, and if you wrote it correctly the model learns.',
      satirlar:[
        '<span class="kw">for</span> step <span class="kw">in</span> <span class="fn">range</span>(<span class="st">2000</span>):',
        '    gw, gb = <span class="fn">gradient</span>(w, b)      <span class="cm"># slope: the uphill direction</span>',
        '    w = w <b1> lr <b2> gw',
        '    b = b <b1> lr <b2> gb',
        '    <span class="cm"># lr = <b3></span>'
      ],
      bosluklar:{
        b1:{ secenekler:['+','-'], dogru:'-' },
        b2:{ secenekler:['*','/'], dogru:'*' },
        b3:{ secenekler:['0.01','0.5'], dogru:'0.01' },
      },
      ipucu:'The slope points UPHILL and we are going down. And the size of the step is the learning rate times the slope.',
    },
  },
  ],
};
