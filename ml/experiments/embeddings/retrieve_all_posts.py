import requests

def retrieve_all_posts():
    URL = "http://localhost:5000/get/posts"
    r = requests.get(url = URL)
    data = r.json()
    ret = []
    for x in data["data"]:
        tol = []
        tol.append(x["_id"])
        tol.append(x["text"])
        ret.append(tol)

    return ret

def retrieve_all_posts_texts():
    URL = "http://localhost:5000/get/posts"
    r = requests.get(url = URL)
    data = r.json()
    ret = []
    for x in data["data"]:
        ret.append(x["text"])

    return ret