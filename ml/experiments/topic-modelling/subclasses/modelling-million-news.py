import pandas as pd
from bertopic import BERTopic
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

INSTANCE="20k"
stop_words = set(stopwords.words('english'))

def create_fp(index):
    return r"D:\Projects\v3\raven\ml\graphs\tm-n-" + str(INSTANCE) + "-" + str(index) + r".html"

def retrieve_all_posts_texts():
    data = pd.read_csv(r'D:\Projects\v3\raven\ml\experiments\topic-modelling\data\abcnews-date-text.csv')
    docs = data["headline_text"][:20000]
    ret = []
    i = 0
    for x in docs:
        # tokenize text
        tokens = word_tokenize(x)
        filtered_sentence = [w for w in tokens if not w.lower() in stop_words]
        final = " ".join(filtered_sentence)
        ret.append(final)
        i += 1
        if i % 1000 == 0:
            print("Epoch",i,"successful")

    return ret

# retrieve all posts
docs = retrieve_all_posts_texts()
print("len", len(docs))

# create model
topic_model = BERTopic(verbose=True, calculate_probabilities=True)
topics, probs = topic_model.fit_transform(docs)
print(topic_model.get_topic_info())

# a bunch of visualizations for debugging
foc = topic_model.visualize_topics()  
foc2 = topic_model.visualize_heatmap()
foc3 = topic_model.visualize_barchart()
foc5 = topic_model.visualize_documents(docs)
foc6 = topic_model.visualize_hierarchy()
foc.write_html(create_fp("1"))
foc.write_
foc2.write_html(create_fp("2"))
foc3.write_html(create_fp("3"))
foc5.write_html(create_fp("4"))
foc6.write_html(create_fp("5"))

while True:
    x = input("Enter search string")
    topics, probs= topic_model.transform([x])
    print(topics)
    print(probs)