import gensim
from gensim import corpora

# Sample document set
documents = ["This is the first document",
             "This document is the second document",
             "And this is the third one",
             "Is this the first document"]

# Preprocess the documents by tokenizing and removing stopwords
stopwords = set('for a of the and to in'.split())
tokenized_docs = [[word for word in document.lower().split() if word not in stopwords]
                  for document in documents]
print(tokenized_docs)

# Create a dictionary from the preprocessed documents
dictionary = corpora.Dictionary(tokenized_docs)

# Convert tokenized documents into a document-term matrix
corpus = [dictionary.doc2bow(doc) for doc in tokenized_docs]

# Build the LDA model
num_topics = 3
lda_model = gensim.models.LdaModel(corpus=corpus, id2word=dictionary, num_topics=num_topics)

# Print the topics and their corresponding words
for idx, topic in lda_model.print_topics():
    print(f'Topic #{idx}: {topic}')

# Get the topic distribution for a new document
new_doc = "This is a new document"
new_doc_tokens = [word for word in new_doc.lower().split() if word not in stopwords]
new_doc_bow = dictionary.doc2bow(new_doc_tokens)
topic_distribution = lda_model.get_document_topics(new_doc_bow)

# Print the topic distribution
print("Topic Distribution for the new document:")
for topic in topic_distribution:
    print(f"Topic #{topic[0]}: {topic[1]}")
