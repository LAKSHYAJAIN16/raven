from chromadb.utils import embedding_functions

def embed_text(text, fn):
    x = fn.__call__([text])
    return x

def embedding_fn():
    return embedding_functions.SentenceTransformerEmbeddingFunction()