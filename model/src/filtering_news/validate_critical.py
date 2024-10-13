import pickle

with open("backup_copy.pkl", "rb") as f:
    data = pickle.load(f)

for i in range(len(data)):
    if data[i]["critical"].lower() == "no" or data[i]["critical"].lower() == "false":
        continue

    event = data[i]

    print("Title: " + event["title"])
    print("Date: " + event["timestamp"])
    print("Content: " + event["content"])
    
    x = input("\nIs this a critical event? ").strip()

    if x != "":
        data[i]["critical"] = "Yes"

with open("backup_updated.pkl", "wb") as f:
    pickle.dump(data, f)