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
