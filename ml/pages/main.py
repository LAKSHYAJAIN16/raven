import chromadb
import time
import string
import random
import os
import math
import json
from nltk import word_tokenize, pos_tag, RegexpParser
from nltk.corpus import stopwords
from chromadb.config import Settings
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from components.embed import embed_text, embedding_fn

# init flask
app = Flask(__name__)
CORS(app)

# init chroma
chroma_client = chromadb.Client(Settings(
    chroma_db_impl="duckdb+parquet"
))
embedding_function = embedding_fn()
collection = chroma_client.create_collection(
    name="posts", embedding_function=embedding_function)

# init nltk
grammar = """
    NP: {<DT|PRP\$>?<JJ.*>*<NN.*>+}       # chunk determiner (optional), adjectives (optional), and one or more nouns
"""
stop_words = set(stopwords.words('english'))
cp = RegexpParser(grammar)


@app.route("/")
@cross_origin()
def home():
    return "Hello, World!"


@app.route("/embed")
def embed():
    id = ""

    # first, embed text
    dat = request.args.to_dict()
    txt = dat["t"]
    try:
        id = dat["id"]
    except:
        id = ''.join(random.choices(string.ascii_uppercase +
                                    string.digits, k=20))
    embeddings = embed_text(txt, embedding_function)

    # now, add to chroma
    collection.add(
        ids=id,
        documents=[txt],
        embeddings=embeddings,
        metadatas=[
            {
                "uID" : dat["uID"],
                "username" : dat["name"],
                "type" : dat["type"],
                "uPfpic" : dat["pfpic"],
            }
        ]
    )

    # We also need to convert it into keywords
    tokens = word_tokenize(txt)
    filtered_sentence = [w for w in tokens if not w.lower() in stop_words]
    tag = pos_tag(filtered_sentence)
    result = cp.parse(tag)

    # Parse result so we only get nouns and noun phrases
    return_res = []
    for k in range(len(result) - 1):
        if type(result[k][0]) == str:
            pos = result[k][1]
            if pos == "NNP" or pos == "VBG" or pos == "NN":
                return_res.append(result[k][0])
        else:
            s = ""
            for f in range(len(result[k]) - 1):
                pos = result[k][f][1]
                if pos == "NN" or pos == "VBG":
                    return_res.append(result[k][f][0])
                elif pos == "NNP":
                    s += result[k][f][0]
                    s += " "

            if len(s) != 0:
                return_res.append(s)

    print(return_res)
    return jsonify({"chroma": collection.get(dat["id"]), "embeddings": embeddings, "keywords": return_res})


@app.route("/byEmbeddings", methods=["POST"])
@cross_origin()
def byEmbeddings():
    start_time = time.time()
    dat = request.get_json()

    # First, query all embeddings
    embed_results = []
    for m in dat["embeddings"]:
        res = collection.query(
            query_embeddings=[m["embeddings"]],
            n_results=math.floor(dat["n"]["embeddings"]*m["weight"])
        )
        embed_results.append(res)

    # Then, our weighted centre
    res2 = collection.query(
        query_embeddings=[dat["centre"]],
        n_results=dat["n"]["centre"]
    )
    exec_time = time.time() - start_time
    result = {
        "centre": res2,
        "embedding_single": embed_results,
        "exec_time": exec_time,
    }
    return jsonify(result)


@app.route("/byKeywords")
@cross_origin()
def byKeywords():
    start_time = time.time()
    dat = request.args.to_dict()
    keywords = json.dumps(dat["keywords"])
    n = int(dat["n"])
    
    # Query individually
    results = []
    for m in keywords:
        res = collection.query(
            query_texts=[m],
            n_results=n
        )
        results.append(res)
    exec_time = time.time() - start_time
    result = {
        "vals": results,
        "exec_time": exec_time,
    }
    return jsonify(result)


if __name__ == "__main__":
    app.run(debug=True, port=1010)
