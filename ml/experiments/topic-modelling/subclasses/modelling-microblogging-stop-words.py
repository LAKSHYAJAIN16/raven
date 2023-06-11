import pandas as pd
from bertopic import BERTopic
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

def main(instance, n):
    def create_fp(index):
        return r"D:\Projects\v3\raven\ml\graphs\modelling\tm-mb-stop-words-" + str(instance) + "k-" + str(index) + r".html"
    
    def retrieve_all_posts_texts():
        data = pd.read_csv(r'D:\Projects\v3\raven\ml\experiments\topic-modelling\data\dataset.csv')
        docs = data["text"][:n]
        ret = []
        i = 0
        for x in docs:
            # tokenize text
            ret.append(x)
            i += 1
            if i % 1000 == 0:
                print("Epoch",i,"successful")
    
        return ret
    
    # retrieve all posts
    print("STARTING",instance,"NOW")
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
    foc2.write_html(create_fp("2"))
    foc3.write_html(create_fp("3"))
    foc5.write_html(create_fp("4"))
    foc6.write_html(create_fp("5"))
    
    # while True:
    #     x = input("Enter search string")
    #     topics, probs= topic_model.transform([x])
    #     print(topics)
    #     print(probs)

    # reccursion
    print("INSTANCE",instance,"DONE")
    main(instance + 1, n + 1000)

main(1,1000)