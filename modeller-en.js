/* Model catalogue · English overlay. Same ids and same order as modeller.js; only text fields. */
const GOREVLER_EN = {
  reg:   {ad:'Regression',               ac:'predict a number'},
  sin:   {ad:'Classification',           ac:'predict a category'},
  kume:  {ad:'Clustering',               ac:'find groups without labels'},
  boyut: {ad:'Dimensionality reduction', ac:'compress / visualize'},
  anom:  {ad:'Anomaly',                  ac:'catch the outlier'},
  uret:  {ad:'Generative',               ac:'create new content'},
  dil:   {ad:'Language / LLM',           ac:'work with text'},
};

const MODELLER_EN = {
/* ─────────────── BASICS ─────────────── */
linreg: {
  ad:'Linear Regression',
  bir:'Fits a straight line (or plane) to the data and predicts a numeric value.',
  nasil:'It gives each feature a weight and adds everything up. The weights are chosen to minimize the sum of squared errors between prediction and truth. There is a closed-form solution, and you can also find it with gradient descent.',
  neZaman:['When the relationship is roughly linear','When you want to interpret the coefficients ("each extra hour adds 7.7 points")','When you build a baseline: it should be the first model you try on every project'],
  neZamanDegil:['When the relationship is curved (you need feature engineering or polynomial terms first)','When there are many outliers (squared error blows them up → use Huber)','When features are near copies of each other (multicollinearity → Ridge/Lasso)'],
  kod:`from sklearn.linear_model import LinearRegression
model = LinearRegression().fit(X_train, y_train)
print(model.coef_, model.intercept_)   # interpretable coefficients
y_pred = model.predict(X_test)`,
  hiper:[['fit_intercept','whether to learn the constant term (b)'],['-','no hyperparameters to tune; simplicity is its advantage']],
  tuzak:'Assuming the relationship is linear because R² is high. Always plot the residuals. If you see a pattern, the model is wrong.',
},
ridge: {
  ad:'Ridge / Lasso / ElasticNet',
  bir:'Linear regression plus a penalty that forces the weights to stay small. It suppresses overfitting.',
  nasil:'The size of the weights is added to the loss function. Ridge penalizes the square (L2) → weights shrink. Lasso penalizes the absolute value (L1) → some weights become exactly zero, so it does feature selection.',
  neZaman:['When the number of features is close to or larger than the number of samples','When features are correlated with each other (Ridge)','When you want automatic feature selection (Lasso)'],
  neZamanDegil:['When you have few features and plenty of data (plain linear is enough)',"When you haven't scaled the features, the penalty works incorrectly"],
  kod:`from sklearn.linear_model import Ridge, Lasso
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

# SCALING IS A MUST, otherwise the penalty unfairly punishes large-scale features
model = make_pipeline(StandardScaler(), Ridge(alpha=1.0)).fit(X, y)`,
  hiper:[['alpha','penalty strength. Larger = simpler model, more bias'],['l1_ratio',"L1/L2 mixing ratio in ElasticNet"]],
  tuzak:'Forgetting to scale. Ridge/Lasso are scale sensitive; without StandardScaler the result is meaningless.',
},
logreg: {
  ad:'Logistic Regression',
  bir:'Separates two (or more) classes with a linear boundary and outputs probabilities.',
  nasil:'It passes the weighted sum through a sigmoid → a probability between 0 and 1. It uses cross-entropy as the loss and is trained with gradient descent. The name says "regression", but the job is classification.',
  neZaman:['When you need calibrated probabilities ("73% chance of fraud")','When you need to interpret coefficients: credit, healthcare, auditing','As a fast, solid baseline'],
  neZamanDegil:['When the boundary is curved (like a ring inside a ring)','When interactions between features matter (you have to add them by hand)'],
  kod:`from sklearn.linear_model import LogisticRegression
model = LogisticRegression(max_iter=1000, class_weight='balanced').fit(X, y)
proba = model.predict_proba(X_test)[:, 1]   # raw probability, YOU pick the threshold
import numpy as np
y_pred = (proba > 0.3).astype(int)          # 0.5 is not a sacred number`,
  hiper:[['C','the INVERSE of penalty strength. Small C = strong penalty'],['class_weight','set to "balanced" for imbalanced classes'],['solver','lbfgs (default), liblinear (small data), saga (L1 + large data)']],
  tuzak:'Accepting the 0.5 threshold without question. On imbalanced data, pick the right threshold from the ROC/PR curve.',
},
knn: {
  ad:'k-Nearest Neighbors',
  bir:'Looks at the k closest neighbors of a new sample and goes with whatever the majority says.',
  nasil:'It does no training and keeps all the data in memory. At prediction time it computes distances, finds the k closest points and lets them vote. This is called "lazy learning".',
  neZaman:['As a quick baseline on small datasets','When the decision boundary is very irregular and local','For finding similar items in recommender systems'],
  neZamanDegil:['When the data is large, every prediction scans the whole dataset','When dimensionality is high, distance loses its meaning (curse of dimensionality)','When features are on different scales (scaling is mandatory)'],
  kod:`from sklearn.neighbors import KNeighborsClassifier
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

model = make_pipeline(
    StandardScaler(),                       # distance based → scaling is a MUST
    KNeighborsClassifier(n_neighbors=5, weights='distance')
).fit(X, y)`,
  hiper:[['n_neighbors','k. Small = sensitive to noise, large = blurry boundary'],['weights','uniform / distance (closer neighbors get more votes)'],['metric','euclidean, manhattan, cosine']],
  tuzak:'Picking an even k and ending up with ties; and skipping scaling. With income in dollars and age in years, income crushes everything.',
},
nb: {
  ad:'Naive Bayes',
  bir:'Computes probabilities with Bayes\' rule; it assumes all features are independent of each other.',
  nasil:'P(class | features) ∝ P(class) × ∏ P(feature | class). The "naive" part comes from the independence assumption in that product. It is almost never true in practice, yet it works surprisingly well.',
  neZaman:['Text classification: spam, sentiment analysis, topic tagging','Very high dimensionality with little data','When you need instant training (one pass is enough)'],
  neZamanDegil:['When features are strongly correlated','When you need calibrated probabilities, NB gives extreme values (0.99 / 0.01)'],
  kod:`from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

model = make_pipeline(TfidfVectorizer(), MultinomialNB(alpha=1.0)).fit(texts, labels)`,
  hiper:[['alpha','Laplace smoothing, so a word unseen in training does not zero out the probability'],['GaussianNB / MultinomialNB / BernoulliNB','pick based on continuous / count / binary data']],
  tuzak:"Trusting NB's probabilities as a decision threshold. Its ranking is good, its calibration is bad.",
},
/* ─────────────── TREES ─────────────── */
tree: {
  ad:'Decision Tree (CART)',
  bir:'Splits the data by asking a series of yes/no questions; each leaf gives a prediction.',
  nasil:'At each node it scans every possible threshold and picks the split that "purifies" the most (Gini or entropy). It is greedy: it takes the best option right now and does not think ahead. It uses no derivatives.',
  neZaman:['When you have to explain the decision to a person in plain sentences','When features are of mixed types (numeric + categorical)',"When you don't want to scale: trees are insensitive to scale"],
  neZamanDegil:['When you want accuracy from a single tree: it is unstable, a small change in the data can change the whole tree','When the boundary is diagonal/linear: a tree only cuts vertically and horizontally, so it builds a staircase'],
  kod:`from sklearn.tree import DecisionTreeClassifier, export_text
model = DecisionTreeClassifier(max_depth=4, min_samples_leaf=20).fit(X, y)
print(export_text(model, feature_names=list(X.columns)))   # read the rules`,
  hiper:[['max_depth','depth. If you leave it unlimited, the tree memorizes every sample'],['min_samples_leaf','minimum samples per leaf, the most effective brake against overfitting'],['criterion','gini / entropy, the difference is small in practice']],
  tuzak:'Not limiting depth. An unlimited tree gets 100% training accuracy and has learned nothing.',
},
rf: {
  ad:'Random Forest',
  bir:'Grows hundreds of different trees and lets them all vote. It removes the instability of a single tree.',
  nasil:'Each tree is trained on a random sample of the data (bootstrap) and on a random subset of features at every split. These two sources of randomness make the trees different from each other; averaging them lowers variance. This is called bagging.',
  neZaman:['As your first serious model on tabular data: it works well without tuning','When you want to see feature importance','When you need natural resistance to overfitting'],
  neZamanDegil:['When you have to present a single rule as justification (interpretability is lost)','When memory/speed is critical: 500 trees take up space','When the relationship is linear (unnecessary complexity)'],
  kod:`from sklearn.ensemble import RandomForestClassifier
model = RandomForestClassifier(
    n_estimators=500, max_features='sqrt',
    min_samples_leaf=2, n_jobs=-1, random_state=42).fit(X, y)

import pandas as pd
print(pd.Series(model.feature_importances_, index=X.columns).sort_values(ascending=False))`,
  hiper:[['n_estimators','number of trees. More does not hurt, it only slows things down'],['max_features','how many features to try at each split, the source of diversity'],['min_samples_leaf','the one brake; at 1 every tree memorizes (but averaging saves you)']],
  tuzak:'Treating feature_importances_ values as causation. They inflate high-cardinality features; use permutation importance or SHAP.',
},
gbm: {
  ad:'Gradient Boosting (XGBoost / LightGBM / CatBoost)',
  bir:'Adds trees one after another; each new tree tries to fix the errors of the previous ones.',
  nasil:'Random Forest grows trees in parallel and independently; boosting grows them in sequence. At each step a tree is fitted to the gradient of the remaining error (residual). The error goes down slowly, step by step.',
  neZaman:["When you want the highest accuracy on tabular data: Kaggle's king model",'On real-world data with mixed types and missing values (LightGBM/CatBoost handle them directly)','On medium-sized data (a thousand to a few million rows)'],
  neZamanDegil:['On raw image/audio/text data, deep learning does better','When you have very little data, it memorizes easily',"When you don't have time to tune (RF is more forgiving)"],
  kod:`import lightgbm as lgb
model = lgb.LGBMClassifier(
    n_estimators=2000, learning_rate=0.03,
    num_leaves=31, subsample=0.8, colsample_bytree=0.8).fit(
    X_tr, y_tr,
    eval_set=[(X_val, y_val)],
    callbacks=[lgb.early_stopping(100)])   # EARLY STOPPING IS A MUST`,
  hiper:[['learning_rate','smaller = better but slower. Between 0.01 and 0.1'],['n_estimators','inversely related to learning_rate; use it together with early stopping'],['num_leaves / max_depth','model complexity, the main source of overfitting'],['subsample / colsample','row and column sampling, a form of regularization']],
  tuzak:'Training without early stopping. If boosting never stops, it will memorize; early_stopping on a validation set is non-negotiable.',
},
softtree: {
  ad:'Soft Decision Tree',
  bir:'Replaces the hard threshold of a decision tree with a sigmoid, so the tree can be trained with gradient descent.',
  nasil:'A classic node says "x > t ? right : left", and its derivative is zero. A soft node returns σ((x−t)/T): every sample goes down both branches with a weight. The temperature T is a dial: as T→0 you get a classic tree, and as T grows it moves toward a neural network.',
  neZaman:['When you need both justification and flexibility: regulated industries (banking, healthcare)','When hard jumps at the threshold edge are a problem','When you want to plug a tree end to end into a neural network pipeline'],
  neZamanDegil:['When you only care about accuracy (GBM usually wins)','When you need an exact list of hard rules (the soft structure is probabilistic)'],
  kod:`# pip install neural-trees
from neural_trees import SoftDecisionTree
model = SoftDecisionTree(depth=4, temperature=0.5, lr=0.01)
model.fit(X_train, y_train, epochs=200)

# compare with a classic tree STATISTICALLY, don't just look at accuracy
from neural_trees.stats import cv52_f_test
f, p = cv52_f_test(model, DecisionTreeClassifier(max_depth=4), X, y)`,
  hiper:[['temperature (T)','interpretability ↔ flexibility dial. Small T = close to a tree'],['depth','tree depth, the parameter count grows with 2^depth'],['lr','gradient descent step size']],
  tuzak:'Setting T too high and losing interpretability. At that point you are really just training an MLP.',
},
svm: {
  ad:'Support Vector Machine',
  bir:'Looks for the boundary that separates the classes with the widest gap; with the kernel trick that boundary can be curved.',
  nasil:'It only pays attention to the samples closest to the boundary (the support vectors). The RBF kernel conceptually lifts the data into a higher dimension and separates it there with a flat plane. It never actually goes to that dimension; it only computes inner products.',
  neZaman:['Medium-sized data (< ~100k rows) + high dimensionality','Text classification (linear SVM is still very strong)','When there is a clear margin'],
  neZamanDegil:['On large data, training scales as O(n²) to O(n³)','When you need probabilities (SVM does not produce them natively)','When you need interpretability'],
  kod:`from sklearn.svm import SVC
from sklearn.pipeline import make_pipeline
from sklearn.preprocessing import StandardScaler

model = make_pipeline(StandardScaler(),
    SVC(kernel='rbf', C=1.0, gamma='scale')).fit(X, y)`,
  hiper:[['C','error tolerance. Large C = no tolerance for training error = overfitting risk'],['gamma','RBF width. Large gamma = every point builds its own little island'],['kernel','linear (text), rbf (general), poly']],
  tuzak:'Using it without scaling, and not searching C and gamma together. The two interact, so grid search is a must.',
},
/* ─────────────── UNSUPERVISED ─────────────── */
kmeans: {
  ad:'k-Means',
  bir:'Splits the data into k groups: each point is assigned to the nearest center, the centers move to the middle of their points, and this repeats.',
  nasil:'Two steps alternate: assign, update. It minimizes the sum of squared within-cluster distances (inertia). It can get stuck in a local optimum, so it is run many times from different starting points.',
  neZaman:['Customer segmentation, document grouping','When clusters are roughly spherical and of similar size','As a quick exploration tool'],
  neZamanDegil:['When clusters are elongated, ring-shaped or nested (use DBSCAN)',"When you don't know k (you need the elbow method + silhouette)",'When there are outliers, they pull the centers'],
  kod:`from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score

for k in range(2, 9):
    km = KMeans(n_clusters=k, n_init=10, random_state=42).fit(X)
    print(k, km.inertia_, silhouette_score(X, km.labels_))   # THIS is how you pick k`,
  hiper:[['n_clusters','k. You have to provide it, the model does not find it'],['n_init','how many different starts to try. 10 is reasonable, 1 is dangerous'],['init','k-means++ (default) deliberately picks centers far apart']],
  tuzak:'Running with n_init=1. With a bad start, one center stays dead and the algorithm never notices.',
},
dbscan: {
  ad:'DBSCAN',
  bir:"Treats dense regions as clusters and marks the sparse leftovers as noise. You don't give it the number of clusters.",
  nasil:'A point becomes a "core point" if it has at least min_samples neighbors within radius eps. Core points chain together to form clusters. Points that cannot reach any cluster get the label −1.',
  neZaman:['When clusters have odd shapes (crescent, ring, long strip)',"When you don't know the number of clusters",'When you also want outlier detection: you get it for free'],
  neZamanDegil:['When cluster densities differ a lot (try HDBSCAN)','When dimensionality is high, eps loses its meaning',"When you have no intuition for eps (you need to plot a k-distance graph)"],
  kod:`from sklearn.cluster import DBSCAN
import numpy as np
db = DBSCAN(eps=0.4, min_samples=8).fit(X)
print('clusters:', len(set(db.labels_)) - (1 if -1 in db.labels_ else 0))
print('noise:', np.sum(db.labels_ == -1))`,
  hiper:[['eps','neighborhood radius, the most critical setting'],['min_samples','neighbors needed to be a core point; usually 2×dimensions']],
  tuzak:'Picking eps blindly. Plot a k-distance graph first and take the value at the elbow.',
},
pca: {
  ad:'PCA (Principal Component Analysis)',
  bir:'Reduces dimensionality by rotating the data onto new axes where the variance is largest.',
  nasil:'It finds the eigenvectors of the covariance matrix. The first component is the direction in which the data spreads the most, the second is the most spread direction perpendicular to it, and so on. The first few components usually carry most of the variance.',
  neZaman:['When there are many features and a lot of noise','When reducing to 2 or 3 dimensions for visualization','When you want to speed things up before modeling'],
  neZamanDegil:['When you need to interpret features: components are mixtures with no meaning of their own','When the relationship is not linear (UMAP/t-SNE or kernel PCA)',"When you haven't scaled, a large-scale feature takes over every component"],
  kod:`from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
Xs = StandardScaler().fit_transform(X)
p = PCA(n_components=0.95).fit(Xs)      # keep 95% of the variance
print(p.n_components_, p.explained_variance_ratio_[:5])`,
  hiper:[['n_components','give a whole number and you get that many components; give 0.95 and you keep that much variance']],
  tuzak:'Fitting PCA on all the data and then splitting into train/test. That is data leakage; PCA is fit on the training set only.',
},
tsne: {
  ad:'t-SNE / UMAP',
  bir:'Reduces high-dimensional data to 2 dimensions while preserving neighborhood relationships. It is for visualization only.',
  nasil:'It searches for a layout where points that are close in high dimensions stay close in low dimensions. It is not a linear transform like PCA; the result can change from run to run.',
  neZaman:['When you want to see an embedding space with your own eyes','When checking whether clusters really separate'],
  neZamanDegil:['As model input: the DISTANCES between clusters are not meaningful','When drawing quantitative conclusions from the result','With t-SNE on large data (it is slow → use UMAP)'],
  kod:`import umap                      # pip install umap-learn
emb = umap.UMAP(n_neighbors=15, min_dist=0.1).fit_transform(X)
import matplotlib.pyplot as plt
plt.scatter(emb[:,0], emb[:,1], c=y, s=5)`,
  hiper:[['n_neighbors / perplexity','whether local or global structure stands out'],['min_dist','how tightly the points get packed']],
  tuzak:'Interpreting cluster sizes and the distances between clusters in a t-SNE plot. Both are meaningless; the plot only answers "do they separate?".',
},
iforest: {
  ad:'Isolation Forest',
  bir:'Catches outliers because they are "easy to isolate" with random splits.',
  nasil:'It splits the data on a random feature at a random threshold, again and again. Normal points need many splits to be isolated; outliers end up alone after a few. The average depth is the anomaly score.',
  neZaman:['Unlabeled anomaly detection: fraud, faults, log analysis','On high-dimensional data','When it has to be fast (it scales linearly)'],
  neZamanDegil:['When the anomaly rate is very high (>20%)','When anomalies hide "in the middle of normal"'],
  kod:`from sklearn.ensemble import IsolationForest
det = IsolationForest(contamination=0.02, random_state=42).fit(X)
score = -det.score_samples(X)     # higher = more anomalous
outlier = det.predict(X) == -1`,
  hiper:[["contamination","expected anomaly rate; if you can't estimate it, threshold the scores yourself"],['n_estimators','number of trees']],
  tuzak:'Setting contamination at random. It directly decides how many samples count as anomalies; choose it with domain knowledge.',
},
/* ─────────────── DEEP LEARNING ─────────────── */
mlp: {
  ad:'MLP (Multilayer Perceptron)',
  bir:'Stacks layers of neurons; thanks to activation functions it can learn curved boundaries.',
  nasil:'Each layer: weighted sum + bias + activation. Without nonlinearity between layers, any number of layers would collapse into a single straight line. It is trained with backpropagation.',
  neZaman:['When the relationship is complex and nonlinear','When you have plenty of data','As an entry point to deep learning: CNNs and Transformers are built on top of it'],
  neZamanDegil:['On tabular data by itself: GBM almost always wins','On little data (it memorizes easily)','When you need interpretability'],
  kod:`import torch.nn as nn
model = nn.Sequential(
    nn.Linear(n_features, 64), nn.ReLU(), nn.Dropout(0.2),
    nn.Linear(64, 32), nn.ReLU(),
    nn.Linear(32, 1))                     # for classification use BCEWithLogitsLoss

opt = torch.optim.AdamW(model.parameters(), lr=1e-3, weight_decay=1e-2)`,
  hiper:[['number of layers / width','capacity'],['lr','the most critical setting; if it is wrong, training either crawls or blows up'],['dropout / weight_decay','regularization'],['batch_size','noise ↔ speed trade-off']],
  tuzak:'Not normalizing the input and picking the learning rate blindly. Run an lr sweep (lr finder) first.',
},
cnn: {
  ad:'CNN (Convolutional Neural Network)',
  bir:'Slides small filters across every part of an image; it catches the same pattern regardless of position.',
  nasil:'A kernel such as 3×3 slides over the image, does a multiply-and-sum at each position and produces a feature map. The same 9 parameters are used everywhere (parameter sharing). As layers get deeper, the network learns edges → textures → parts → objects.',
  neZaman:['Images, video, spectrograms (audio)','Any data where spatial neighborhood has meaning','Even with little data, thanks to transfer learning'],
  neZamanDegil:['On sequential/text data (Transformers do better)','On tabular data (neighborhood is meaningless)','When you have too little data to train from scratch: use a pretrained model'],
  kod:`import timm, torch
model = timm.create_model('resnet18', pretrained=True, num_classes=3)
# don't train from scratch: use pretrained weights, replace the last layer
for p in model.parameters(): p.requires_grad = False
for p in model.fc.parameters(): p.requires_grad = True`,
  hiper:[['kernel size','3×3 is the modern standard'],['stride / padding','determine the output size'],['number of channels','layer capacity'],['augmentation','flip/crop/color, the most effective regularization on small data']],
  tuzak:'Trying to train from scratch. In almost every case a pretrained model + fine-tuning is better and 100× cheaper.',
},
rnn: {
  ad:'RNN / LSTM / GRU',
  bir:'Reads sequential data step by step and carries a "memory" state.',
  nasil:'At each time step it combines the input with the previous hidden state to produce a new hidden state. LSTM and GRU add gates that keep long-range dependencies from fading away (vanishing gradient).',
  neZaman:['Time series forecasting','Short sequences + little data (cheaper than a Transformer)','Online prediction on streaming data'],
  neZamanDegil:['On long text: Transformers have won on almost every task',"When you need parallel training (an RNN is sequential and can't saturate a GPU)"],
  kod:`import torch.nn as nn
class Estimator(nn.Module):
    def __init__(s, g=1, h=64):
        super().__init__()
        s.lstm = nn.LSTM(g, h, num_layers=2, batch_first=True, dropout=0.2)
        s.fc = nn.Linear(h, 1)
    def forward(s, x):
        o, _ = s.lstm(x)
        return s.fc(o[:, -1])        # last time step`,
  hiper:[['hidden_size','memory capacity'],['num_layers','depth'],['gradient clipping','guards against exploding gradients, almost mandatory for LSTMs']],
  tuzak:'Splitting a time series into train/test at random. That is looking into the future; you must split by time.',
},
ae: {
  ad:'Autoencoder',
  bir:'Squeezes the input through a narrow bottleneck and tries to rebuild it; the bottleneck learns a compressed representation.',
  nasil:'The encoder shrinks the input into a small vector, and the decoder tries to rebuild the original from it. Loss = reconstruction error. No labels are needed; it supervises itself.',
  neZaman:['Learning representations without labels','Anomaly detection: an abnormal sample is reconstructed poorly','Denoising (denoising AE)'],
  neZamanDegil:['When you only want dimensionality reduction (PCA is simpler and faster)','When you want to generate new samples: you need a VAE or diffusion'],
  kod:`loss = ((model(x) - x) ** 2).mean(dim=1)      # reconstruction error per sample
threshold = train_loss.quantile(0.99)
anomaly = loss > threshold`,
  hiper:[['bottleneck size','too large = it learns to copy, too small = information loss'],['architecture','encoder and decoder do not have to be symmetric']],
  tuzak:'Leaving the bottleneck too wide. The network learns to copy the input as is and has learned nothing.',
},
transformer: {
  ad:'Transformer',
  bir:'Lets every element "look at" every other element at the same time. The backbone of modern AI.',
  nasil:"Self-attention: each token produces a query (Q), which is multiplied with the keys (K) of all tokens; the weights go through softmax and are used to take a weighted sum of the values (V). No sequential reading, one matrix multiplication, fully parallel.",
  neZaman:['Text, code, proteins, multimodal, any sequential data','When long-range dependencies matter','When you have scale (data + compute)'],
  neZamanDegil:['Training from scratch on very little data','On very long sequences with plain attention: the cost is O(n²)'],
  kod:`from transformers import AutoModelForSequenceClassification, AutoTokenizer
name = 'bert-base-uncased'
tok = AutoTokenizer.from_pretrained(name)
model = AutoModelForSequenceClassification.from_pretrained(name, num_labels=3)
# don't train from scratch, ALWAYS start from a pretrained model`,
  hiper:[['d_model','representation size'],['n_heads','number of parallel attention heads'],['n_layers','number of blocks'],['context length','how many tokens it can see at once']],
  tuzak:'Treating attention as "an explanation of what the model is looking at". Attention weights are not explanations; there is a large debate about this in the literature.',
},
diffusion: {
  ad:'Diffusion Model',
  bir:'Starts from pure noise and removes it step by step until an image appears.',
  nasil:'During training, noise is gradually added to images and the network is trained to "predict this noise". At generation time the process is reversed: you start from random noise, the network removes a bit of noise at each step, and the image emerges in 20 to 50 steps.',
  neZaman:['Generating images, audio, video','Conditional generation (text to image)','Inpainting, super-resolution'],
  neZamanDegil:['When you need instant generation: it takes many steps and is slow','For discriminative tasks like classification'],
  kod:`from diffusers import StableDiffusionPipeline
import torch
pipe = StableDiffusionPipeline.from_pretrained(
    'runwayml/stable-diffusion-v1-5', torch_dtype=torch.float16).to('cuda')
image = pipe('a cat, oil painting', num_inference_steps=30, guidance_scale=7.5).images[0]`,
  hiper:[['num_inference_steps','number of steps, quality ↔ speed'],['guidance_scale','how closely to follow the prompt; too high = oversaturated and artificial']],
  tuzak:'Trying to improve quality by raising guidance_scale. Above 12 the colors blow out and diversity dies.',
},
/* ─────────────── LLM APPLICATIONS ─────────────── */
embed: {
  ad:'Embedding Models',
  bir:'Turns text into a vector of numbers where texts with similar meaning land close to each other.',
  nasil:"A Transformer encoder reduces a sentence to a fixed-size vector (usually 384 to 3072 dimensions). Similarity is measured with cosine distance. It is the foundation of search, recommendation and RAG.",
  neZaman:['Semantic search: matching meaning, not words','Retrieving documents in a RAG pipeline','Clustering, duplicate detection, recommendation'],
  neZamanDegil:['When you need exact matches (product codes, SKUs → classic search)',"When the model doesn't support your language: pick a multilingual model for non-English text"],
  kod:`from sentence_transformers import SentenceTransformer
m = SentenceTransformer('intfloat/multilingual-e5-large')   # supports Turkish
V = m.encode(documents, normalize_embeddings=True)
q = m.encode(['what is the return policy'], normalize_embeddings=True)
score = V @ q.T                     # if normalized, inner product = cosine`,
  hiper:[['model choice','size ↔ quality ↔ speed trade-off'],['normalize_embeddings','set to True for cosine'],['chunk size','how you split the document directly determines retrieval quality']],
  tuzak:'Embedding non-English documents with an English-only model. The scores look reasonable, but retrieval quality quietly collapses.',
},
rag: {
  ad:'RAG (Retrieval-Augmented Generation)',
  bir:"Finds the relevant documents and puts them into the LLM's context before it answers. The main way to reduce hallucination.",
  nasil:"Documents are chunked, embedded and written to a vector database. When a question comes in, it is embedded, the k closest chunks are retrieved and added to the prompt, and the LLM is asked to answer only from that context.",
  neZaman:["When working with private or up-to-date information the model doesn't know",'When you have to cite sources','When it needs to be cheaper than fine-tuning and easy to update'],
  neZamanDegil:['When the knowledge is already in the model (unnecessary complexity)','When the task is mostly reasoning: RAG brings in knowledge, it does not teach thinking'],
  kod:`# 1 chunk → 2 embed → 3 retrieve → 4 query
chunks = split(document, size=500, overlap=80)      # OVERLAP MATTERS
V = embed(chunks)
relevant = nearest(V, embed(question), k=5)
prompt = f"""Use only the context below. If it is not in the context, say "I don't know".
CONTEXT:\\n{relevant}\\n\\nQUESTION: {question}"""`,
  hiper:[['chunk_size / overlap','the most critical setting: small chunks lose context, large chunks bring noise'],['k','how many chunks to retrieve'],['reranker','re-ranking after the first retrieval, the single addition that improves quality the most']],
  tuzak:'Blaming the LLM without measuring retrieval. Most bad RAG is a retrieval failure; measure "did the right chunk come back?" first.',
},
finetune: {
  ad:'Fine-tuning / LoRA',
  bir:'Trains a pretrained model a bit more on your own data to adapt it to a style or a task.',
  nasil:"Full fine-tuning updates all the weights, which is expensive. LoRA attaches small low-rank add-ons to the weight matrices and trains only those: ~0.1% of the parameters for most of the result.",
  neZaman:['When you need a specific format, style or tone','Adapting to domain language (medicine, law, code)','To shorten your prompts'],
  neZamanDegil:["To teach the model NEW KNOWLEDGE: that is RAG's job",'With little, low-quality data','When prompt engineering is enough (exhaust that first)'],
  kod:`from peft import LoraConfig, get_peft_model
cfg = LoraConfig(r=16, lora_alpha=32, lora_dropout=0.05,
                 target_modules=['q_proj','v_proj'])
model = get_peft_model(base_model, cfg)
model.print_trainable_parameters()   # ~0.1%`,
  hiper:[['r','LoRA rank, the capacity. 8 to 64 is typical'],['lora_alpha','scaling, usually 2×r'],['target_modules','which layers to attach it to']],
  tuzak:'Treating fine-tuning as knowledge injection. The model learns style, it does not reliably memorize facts, and it can forget what it knew (catastrophic forgetting).',
},
reranker: {
  ad:'Cross-Encoder Reranker',
  bir:'Reads each retrieved candidate together with the question and re-ranks them. The single component that improves RAG quality the most.',
  nasil:'An embedding model encodes the question and the document separately (fast but coarse). A cross-encoder reads them together and produces one relevance score: much more accurate, but slow. That is why you first retrieve 50 candidates and then the reranker picks the best 5.',
  neZaman:['When RAG quality is not good enough: the first improvement to try','When the candidate pool is large'],
  neZamanDegil:['When latency is very critical','When there are already very few candidates'],
  kod:`from sentence_transformers import CrossEncoder
ce = CrossEncoder('BAAI/bge-reranker-v2-m3')
pairs = [(question, p) for p in candidates]          # 50 candidates
score = ce.predict(pairs)
best = [candidates[i] for i in score.argsort()[::-1][:5]]`,
  hiper:[['number of candidates','retrieve 50 to 100, keep 3 to 8'],['model','pick a multilingual one (m3 for Turkish)']],
  tuzak:'Increasing k without adding a reranker. More chunks = more noise; the fix is ranking quality, not quantity.',
},
};
