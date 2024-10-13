import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import json
from google.cloud.firestore import GeoPoint

cred = credentials.Certificate("/Users/bryansoong/Projects/nanyangnerds/credentials.json")
firebase_admin.initialize_app(cred)

db = firestore.client()

with open("final_with_latlng.json", "r") as file:
    data = json.load(file)

seen = []

for i in range(len(data)):
    timestamp = data[i]["timestamp"].replace("-", "")

    if data[i]["title"] in seen:
        continue

    seen.append(data[i]["title"])

    db.collection(timestamp).document(data[i]["title"]).set({
        "title": data[i]["title"],
        "timestamp": data[i]["timestamp"],
        "disruptive": data[i]["disruptive"],
        "risk": data[i]["risk"],
        "segment": data[i]["segment"],
        "location": GeoPoint(data[i]["location"][0], data[i]["location"][1]),
        "city": data[i]["city"],
        "content": data[i]["content"],
        "url": data[i]["url"]
    })
