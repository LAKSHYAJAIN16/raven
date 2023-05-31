from bertopic import BERTopic
from sklearn.datasets import fetch_20newsgroups

print("is getting run")
docs = [
    ""
]
print(docs[:40])

topic_model = BERTopic(verbose=True)
topics, probs = topic_model.fit_transform(docs)
print(topic_model.get_topic_info())
print(topic_model.get_topic(0))
foc = topic_model.visualize_topics()  
foc.write_html(r"D:\Projects\v3\raven\foccacia.html")