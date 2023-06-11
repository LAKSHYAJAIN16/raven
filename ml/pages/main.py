import chromadb
import json
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
from components.embed import embed_text, embedding_fn

# init flask
app = Flask(__name__)
CORS(app)

# init chroma
chroma_client = chromadb.Client()
embedding_function = embedding_fn()
collection = chroma_client.create_collection(
    name="posts", embedding_function=embedding_function)

@app.route("/")
@cross_origin()
def home():
    return "Hello, World!"

@app.route("/embed")
def embed():
    # first, embed text
    dat = request.args.to_dict()
    txt = dat["t"]
    embeddings = embed_text(txt, embedding_function)
    print(len(embeddings))
    
    # now, add to chroma
    collection.add(
        ids=[dat["id"]],
        documents=[txt],
        embeddings=embeddings
    )

    return jsonify({"chroma" : collection.get(dat["id"]), "embeddings" : embeddings})

@app.route("/query/byEmbeddings", methods=["POST"])
@cross_origin()
def byEmbeddings():
    dat = request.get_json()

    # # First, query all embeddings
    # res = collection.query(
    #     query_embeddings=[dat["embeddings"]]
    # )

    # Then, our weighted centre
    res2 = collection.query(
        query_embeddings=[dat["centre"]],
        n_results=2
    )
    return jsonify({"centre" : res2})

if __name__ == "__main__":
    app.run(debug=True, port=1010)
