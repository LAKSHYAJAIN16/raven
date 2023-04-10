import chromadb
import json
import pandas as pd
import string
import random
from flask import Flask, request
from chromadb.utils import embedding_functions

chroma_client = chromadb.Client()
app = Flask(__name__)

# openai_ef = embedding_functions.OpenAIEmbeddingFunction(
#     api_key="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",
#     model_name="text-embedding-ada-002"
# )

collection = chroma_client.create_collection(
    name="messages")

# some test data
dat = pd.read_csv(r"D:\Projects\v3\raven\ml\data\dataaaa.csv")
data = dat.iloc[:, 0][:1000]
for k in data:
    id=''.join(random.choices(string.ascii_uppercase +
                             string.digits, k=10))
    # add it baby!
    collection.add(
        documents=[k],
        ids=[id]
    )

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


@app.route("/create/post_embedding", methods=["POST"])
def post():
    data = json.loads(request.data)

    # Get the data
    text = data["text"]
    id = data["id"]

    collection.add(
        documents=[text],
        ids=[id]
    )

    vals = collection.get(id)
    return json.dumps(vals)


@app.route("/get/post", methods=["POST"])
def get_post():
    dat = json.loads(request.data)
    query = dat["q"]
    n = dat["n"]

    # Noice $#!7
    results = collection.query(
        query_texts=[query],
        n_results=n
    )

    return json.dumps(results)
