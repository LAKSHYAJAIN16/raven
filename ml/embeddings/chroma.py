import chromadb
import json
import pandas as pd
import string
import random
from chromadb.utils import embedding_functions
from retrieve_all_posts import retrieve_all_posts

chroma_client = chromadb.Client()

collection = chroma_client.create_collection(
    name="messages", embedding_function=embedding_fn)

# some test data
data = retrieve_all_posts()

for k in data:
    id=k[0]
    # add it baby!
    collection.add(
        documents=[k[1]],
        ids=[id],
    )

def post(text, id):
    collection.add(
        documents=[text],
        ids=[id]
    )

    vals = collection.get(id)
    return json.dumps(vals)

def get_post(query, n):

    # Noice $#!7
    results = collection.query(
        query_texts=[query],
        n_results=n
    )

    return json.dumps(results)


while True:
    x = input("Enter search string")
    n = int(input("Enter number of results"))
    print(get_post(x, n))