import os
import json
import pickle
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.callbacks.manager import get_openai_callback
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import pandas as pd

RAW_NEWS_PATH = "./model/data/raw/straitstimes.com"
FILTERED_NEWS_PATH = "./model/data/filtered/straitstimes.com"
DISCARDED_NEWS_PATH = os.path.join(RAW_NEWS_PATH, "discarded")
DISCARDED_TAGS = ["sport", "life", "authors", "multimedia"]

def should_discard_by_tag(filename: str):
    for tag in DISCARDED_TAGS:
        if filename.startswith(tag):
            return True
        
    return False

if not os.path.exists(DISCARDED_NEWS_PATH):
    os.mkdir(os.path.join(RAW_NEWS_PATH, "discarded"))

if not os.path.exists(FILTERED_NEWS_PATH):
    os.mkdir(os.path.join(FILTERED_NEWS_PATH))


class NewsData:
    def __init__(self, title: str, tags: str, content: str, timestamp: str):
        self.title = title
        self.tags = tags
        self.content = content
        self.timestamp = timestamp

    def filename(self):
        return self.tags.lower() + "_" + "_".join(self.title.lower().split(" "))

    def dump(self):
        return f"{self.title},{self.timestamp},{self.content}"
    
    def dumpJSON(self):
        return json.dumps({
            "title": self.title,
            "tags": self.tags,
            "timestamp": self.timestamp,
            "content": self.content
        })

def clean_data():
    for file in os.listdir(RAW_NEWS_PATH):
        if file.endswith(".html"):
            os.remove(os.path.join(RAW_NEWS_PATH, file))

        if file.endswith("copy.html.json"):
            os.remove(os.path.join(RAW_NEWS_PATH, file))

        if should_discard_by_tag(file):
            os.rename(os.path.join(RAW_NEWS_PATH, file), os.path.join(DISCARDED_NEWS_PATH, file))

    for clean_file in os.listdir(RAW_NEWS_PATH):
        if not os.path.isfile(os.path.join(RAW_NEWS_PATH, clean_file)): 
            continue

        try:
            with open(os.path.join(RAW_NEWS_PATH, clean_file), "r") as f:
                data = json.load(f)

            news = NewsData(title=data["title"], tags=clean_file.split("/")[-1].split("_")[0], content=data["maintext"], timestamp=data["date_publish"].split(" ")[0])
            
            with open(os.path.join(FILTERED_NEWS_PATH, news.filename()), "w") as f:
                f.write(news.dumpJSON())
        except:
            pass

# clean_data()
# print(len(os.listdir(os.path.join(FILTERED_NEWS_PATH))))

class StructuredOutput(BaseModel):
   timestamp: list[str] = Field(default_factory=list, description="When does this news happen")
   tags: list[str] = Field(default_factory=list, description="Tags of this event")
   title: list[str] = Field(default_factory=list, description="A summary title for this event")
   content: list[str] = Field(default_factory=list, description="All relevant content on this particular event")
   critical: list[str] = Field(default_factory=list, description="All relevant content on this particular event")

def summarise_and_filter():
    load_dotenv("./model/.env")
    OPENAI_API_KEY = os.environ['OPENAI_API_KEY']

    llm = ChatOpenAI(temperature=0, model="gpt-4o", streaming=False, api_key=OPENAI_API_KEY)

    # Pass the class to the LLM
    llm_structured = llm.with_structured_output(StructuredOutput)

    # create the prompt
    prompt = ChatPromptTemplate.from_messages([
    ('system', """
        As a news company employee, your responsibilities include creating tags for each news type and crafting both the title and summary for each news article. You may include multiple tags when appropriate (multiple tags for one news is allowed). The tagging choice are: Entertainment, Politics, World Events, Technology, Business, Health, Science, Economy, Education, Environment, Culture, Travel, Lifestyle, Opinion, Finance, Crime, Local News, International, Weather, Law & Order. You also need to identify and flag news articles that are critical. Critical articles are articles that are related to the following topics: War and Conflict, Presidential Elections, Maritime and Shipping, Trade, Strikes, Militants, Global Economy, or any other topics that may possibly affect the global supply chain network, especially maritime logistics.
    """),
    ('human', """
        Find all relevant news from the following sources:
        
        {sourceTitle}
        {sourceContent}
    """)
    ])

    if os.path.exists(os.path.join("/Users/bryansoong/Projects/nanyangnerds/backup.pkl")):
        with open("/Users/bryansoong/Projects/nanyangnerds/backup.pkl", "rb") as f:
            final_result = pickle.load(f)
    else:
        final_result = []

    count = len(final_result)
    total = len(os.listdir(FILTERED_NEWS_PATH))

    for filename in os.listdir(FILTERED_NEWS_PATH):
        if not os.path.isfile(os.path.join(FILTERED_NEWS_PATH, filename)):
            continue

        with open(os.path.join(FILTERED_NEWS_PATH, filename), "r") as f:
            row = json.load(f)

        title = row['title']
        content = row['content']

        for r in final_result:
            if title == r["title"]:
                continue
        
        prompt_text = prompt.invoke({ 
            'sourceTitle': title,
            'sourceContent': content
        })

        result = llm_structured.invoke(prompt_text)
        result_parsed = {
            'timestamp': result.timestamp[0] if len(result.timestamp) > 0 else "",
            'tags': result.tags[0] if len(result.tags) > 0 else "",
            'critical': result.critical[0] if len(result.critical) > 0 else "",
            'title': result.title[0] if len(result.title) > 0 else "",
            'content': result.content[0] if len(result.content) > 0 else ""
        }
        
        final_result.append(result_parsed)

        with open("backup.pkl", "wb") as pfile:
            pickle.dump(final_result, pfile)

        print(f"Date: {result_parsed['timestamp']} \nTags: {result_parsed['tags']} \nCritical: {result_parsed['critical']} \nTitle: {result_parsed['title']} \nSummary: {result_parsed['content']}\n")

        count += 1
        print(f"Completed {count} of {total}")

    with open("final_data.json", "w") as f:
        json.dump(final_result, f)
        
# summarise_and_filter()

def finalise():
    with open("backup.pkl", "rb") as pfile:
        final_result = pickle.load(pfile)

    with open("final_data.json", "w") as f:
        json.dump(final_result, f)

finalise()