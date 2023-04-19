import pandas as pd
import matplotlib.pyplot as plt
import string
import random
from bertopic import BERTopic

# some test data
dat = pd.read_csv(r"D:\Projects\v3\raven\ml\data\articles1.csv")
data = dat["content"]
print(data.head())

model = BERTopic(verbose=True,embedding_model='paraphrase-MiniLM-L3-v2', min_topic_size= 7)
headline_topics, _ = model.fit_transform(data)
foc = model.visualize_topics()  
foc_2 = model.visualize_barchart()
foc_3 = model.visualize_hierarchy()
foc_3.write_html(r"D:\Projects\v3\raven\foccacia_3.html")
foc_2.write_html(r"D:\Projects\v3\raven\foccacia_2.html")
foc.write_html(r"D:\Projects\v3\raven\foccacia.html")