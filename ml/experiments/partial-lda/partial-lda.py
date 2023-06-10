import gensim
import pandas as pd
from gensim import corpora

def retrieve_all_posts_texts(n):
    data = pd.read_csv(
        r'D:\Projects\v3\raven\ml\experiments\topic-modelling\data\abcnews-date-text.csv')
    docs = data["headline_text"][:n]
    ret = []
    for x in docs:
        # tokenize text
        ret.append(x)

    return ret

# Sample document set
documents = retrieve_all_posts_texts(100)

# Our topic atlas
topic_atlas = []

# Generate LDA model for each document in document set
for doc in documents:
    # Preprocess the documents by tokenizing and removing stopwords
    stopwords = set('for a of the and to in'.split())
    tokenized_docs = [[word for word in doc.lower().split() if word not in stopwords]]
    print(tokenized_docs)
    
    # Create a dictionary from the preprocessed documents
    dictionary = corpora.Dictionary(tokenized_docs)
    
    # Convert tokenized documents into a document-term matrix
    corpus = [dictionary.doc2bow(docum) for docum in tokenized_docs]
    
    # Build the LDA model
    num_topics = 1
    lda_model = gensim.models.LdaModel(corpus=corpus, id2word=dictionary, num_topics=num_topics)

    # Get the actual topic
    topics = lda_model.show_topics(-1, formatted=False)[1]
    topic_atlas.append(topics)