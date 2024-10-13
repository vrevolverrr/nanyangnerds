import json
import math
from datetime import datetime
import parsedatetime as pdt
from geopy.geocoders import Nominatim
from googlesearch import search

def sigmoid_activation(x: float):
    k = -7
    avg = 0.4

    x_norm = max(0, 10 * (x - 0.9))
    return 1 / (1 + math.exp(k * (x_norm - avg)))

def fix_date():
    with open("dataLocation.json", "r") as f:
        data = json.load(f)

    cal = pdt.Calendar()

    for i in range(len(data)):
        res = next(search(data[i]["title"], num_results=1, advanced=True))

        data[i]["url"] = res.url

        timestamp = res.description.split(" — ")[0]
        timestamp = timestamp.replace("Sept", "Sep")

        time_struct, _ = cal.parse(timestamp)
        t = datetime(*time_struct[:6])
        
        t_str = t.strftime("%d-%m-%Y")
        data[i]["timestamp"] = t_str

        print(f"{timestamp} -> {t_str}")

        with open("fixed_date.json", "w") as f:
            json.dump(data, f)

def postprocess():
    with open("dataLocation.json", "r") as f:
        data = json.load(f)

    cal = pdt.Calendar()

    for i in range(len(data)):
        time_struct, _ = cal.parse(data[i]["timestamp"])
        t = datetime(*time_struct[:6])
        
        t_str = t.strftime("%d-%m-%Y")
        data[i]["timestamp"] = t_str

        data[i]["risk"] = sigmoid_activation(data[i]["risk"])

        data[i]["location"] = data[i]["location"].lower()

    with open("parsed_risk_actv.json", "w") as f:
        json.dump(data, f)

# postprocess()
# fix_date()

def add_geodata():
    geolocator = Nominatim(user_agent="nanyangnerds")

    with open("dataCity.json", "r") as f:
        data = json.load(f)

    for i in range(len(data)):
        data[i]["segment"] = data[i]["location"]

        city = data[i]["city"]

        location = geolocator.geocode(city)

        if location is None:
            print(data[i])
            continue

        data[i]["location"] = [location.latitude, location.longitude]

        with open("final_with_latlng", "w") as f:
            json.dump(data, f)
        

add_geodata()