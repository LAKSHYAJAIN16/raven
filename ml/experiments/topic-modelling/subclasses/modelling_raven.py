import requests
from bertopic import BERTopic
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

stop_words = set(stopwords.words('english'))

def retrieve_all_posts_texts():
    URL = "http://localhost:5000/get/posts"
    r = requests.get(url = URL)
    data = r.json()
    ret = []
    for x in data["data"]:
        # tokenize text
        tokens = word_tokenize(x["text"])
        filtered_sentence = [w for w in tokens if not w.lower() in stop_words]
        final = " ".join(filtered_sentence)
        ret.append(final)

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
foc.write_html(r"D:\Projects\v3\raven\ml\graphs\tm-raven-1.html")
foc2.write_html(r"D:\Projects\v3\raven\ml\graphs\tm-raven-2.html")
foc3.write_html(r"D:\Projects\v3\raven\ml\graphs\tm-raven-3.html")
foc5.write_html(r"D:\Projects\v3\raven\ml\graphs\tm-raven-5.html")
foc6.write_html(r"D:\Projects\v3\raven\ml\graphs\tm-raven-6.html")

while True:
    x = input("Enter search string")
    topics, probs= topic_model.transform([x])
    print(topics)
    print(probs)