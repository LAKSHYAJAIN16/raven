import chromadb
import json
from flask import Flask
from flask import request
from components.embed import embed_text, embedding_fn

# init flask
app = Flask(__name__)

# init chroma
chroma_client = chromadb.Client()
embedding_function = embedding_fn()
collection = chroma_client.create_collection(
    name="posts", embedding_function=embedding_function)

@app.route("/")
def home():
    return "Hello, World!"

@app.route("/embed", methods=["POST"])
def embed():
    # first, embed text
    dat = request.get_json()
    txt = dat["t"]
    embeddings = embed_text(txt, embedding_function)
    print(embeddings)
    
    # now, add to chroma
    collection.add(
        ids=[dat["id"]],
        documents=[txt],
        embeddings=embeddings
    )

    return json.dumps({"chroma" : collection.get(dat["id"]), "embeddings" : embeddings})

if __name__ == "__main__":
    app.run(debug=True, port=1010)
