import chromadb
import json
import pandas as pd
import string
import random
from chromadb.utils import embedding_functions

chroma_client = chromadb.Client()

openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    api_key="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",
    model_name="text-embedding-ada-002"
)

collection = chroma_client.create_collection(
    embedding_function=openai_ef,
    name="messages")

# some test data
data = [
    "hello world!",
    "i love myself some good taylor swift! you got it girl!",
    "she played the fiddle in an irish band, but she fell in love with an englishman",
    "omg, elon!"
]

for k in data:
    id=''.join(random.choices(string.ascii_uppercase +
                             string.digits, k=10))
    # add it baby!
    collection.add(
        documents=[k],
        ids=[id]
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


print(get_post("omg! taylor! me love taylor swift!", 3))