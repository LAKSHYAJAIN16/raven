import os
import gensim
import json
import random
import pandas as pd
import numpy as np
from gensim import corpora
from nltk.corpus import stopwords

# Vars
DATASET = "Million News Headlines"
stop_words = set(stopwords.words('english'))


class NpEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.integer):
            return int(obj)
        if isinstance(obj, np.floating):
            return float(obj)
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return super(NpEncoder, self).default(obj)


def retrieve_all_posts_texts(n):
    data = pd.read_csv(
        r'D:\Projects\v3\raven\ml\experiments\topic-modelling\data\abcnews-date-text.csv')
    docs = data["headline_text"][:n]
    ret = []
    for x in docs:
        # tokenize text
        ret.append(x)

    return ret


def create_fp(n, k):
    return r"D:\Projects\v3\raven\ml\graphs\lda\lda-topics-" + str(n) + "-" + str(k) + r"-clusters.json"

def create_model_fp(n, k):
    os.mkdir(r"D:\Projects\v3\raven\ml\models\bad-lda-topics-" + str(n) + "-" + str(k) + r"-clusters")
    return r"D:\Projects\v3\raven\ml\models\bad-lda-topics-" + str(n) + "-" + str(k) + r"-clusters\model"

def main(n, k):
    print("FUNCTION WAS CALLED WITH", n, "DOCS AND", k, "CLUSTERS")
    documents = retrieve_all_posts_texts(n)

    # Preprocess the documents by tokenizing and removing stopwords
    stopwords = set('for a of the and to in'.split())
    tokenized_docs = [[word for word in document.lower().split() if word not in stop_words]
                      for document in documents]

    # Create a dictionary from the preprocessed documents
    dictionary = corpora.Dictionary(tokenized_docs)

    # Convert tokenized documents into a document-term matrix
    corpus = [dictionary.doc2bow(doc) for doc in tokenized_docs]

    # Build the LDA model
    num_topics = k
    lda_model = gensim.models.LdaModel(
        corpus=corpus, id2word=dictionary, num_topics=num_topics, iterations=200)

    # Print the topics and their corresponding words
    for idx, topic in lda_model.print_topics(num_topics=-1, num_words=10):
        print(f'Topic #{idx} : {topic}')

    # Get the topic distribution for a new document
    new_doc = documents[random.randint(0, len(documents) - 1)]
    new_doc_tokens = [word for word in new_doc.lower().split()
                      if word not in stopwords]
    new_doc_bow = dictionary.doc2bow(new_doc_tokens)
    topic_distribution = lda_model.get_document_topics(new_doc_bow)

    # Print the topic distribution
    print("Topic Distribution for the new document:")
    for topic in topic_distribution:
        print(f"Topic #{topic[0]}: {topic[1]}")

    topics = lda_model.show_topics(num_topics=-1)
    perplexity = lda_model.log_perplexity(corpus)

    # disable model save
    # lda_model.save(create_model_fp(len(documents), num_topics))

    # now, find the number of empty topics (i.e all probs are zero)
    empty_topics = []
    for f in range(len(topics)):
        targ = topics[f][1]
        offsets = targ.split(' + ')
        n = 0
        t = 0
        for g in offsets:
            fin = float(g.split("*")[0])
            if fin <= 0.000000000000000000000001:
                n += 1
            t += 1

        if n/t >= 0.6:
            empty_topics.append(topics[f])

    return_obj = {
        "meta": {
            "nDocuments": len(documents),
            "dataset": DATASET,
            "k": num_topics,
            "perplexity": perplexity,
            "empty_amount": len(empty_topics),
        },
        "topics": topics,
        "empty_topics": empty_topics,
    }
    file = open(create_fp(len(documents), k), "w")
    file.write(json.dumps(return_obj, cls=NpEncoder))
    file.close()
    print("PERPLEXITY", perplexity)


MAX_N = 1000000
MAX_K = 50
MIN_N = 100000
MIN_K = 5
K_STEP = 5
N_STEP = 10000
nn = MIN_N

while nn < MAX_N:
    nk = MIN_K
    while nk < MAX_K:
        main(nn, nk)
        nk += K_STEP
    nn += N_STEP
