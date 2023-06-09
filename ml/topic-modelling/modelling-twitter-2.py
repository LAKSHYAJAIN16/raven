from bertopic import BERTopic
import pandas as pd

data = pd.read_csv(r'D:\Projects\v3\raven\ml\topic-modelling\lol.csv', delimiter=',')
data.columns = ['sentiment', 'id', 'date', 'query', 'user_id', 'text']
df = data.drop(['id', 'date', 'query', 'user_id'], axis=1)

topic_model = BERTopic(verbose=True)
topics, probs = topic_model.fit_transform(data)

foc = topic_model.visualize_topics()  
foc2 = topic_model.visualize_heatmap()
foc.write_html(r"D:\Projects\v3\raven\foccacia.html")
foc2.write_html(r"D:\Projects\v3\raven\foccacia_2.html")

while True:
    x = input("Enter search string")
    topics, probs= topic_model.transform([x])
    print(topics)
    print(probs)