from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.callbacks.manager import get_openai_callback
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import os
import pandas as pd
import pickle

file_name = "filteredNews.pkl"
# Open the file in binary read mode
with open(file_name, "rb") as file:
    # Use pickle to load the list from the file
    filteredNews = pickle.load(file)

print(filteredNews)

# set the environment variable key OPENAI_API_KEY
load_dotenv()
OPENAI_API_KEY = os.environ['OPENAI_API_KEY']

llm = ChatOpenAI(temperature=0, model="gpt-4o", streaming=False, api_key=OPENAI_API_KEY)

# class to capture the ouput from the LLM
class StructuredOutput(BaseModel):
   topic: str = Field(default_factory=dict, description="the topic that the current news falls under")
   isNewTopic: bool = Field(default_factory=bool, description="Is the topic new?")

# Pass the class to the LLM
llm_structured = llm.with_structured_output(StructuredOutput)

# create the prompt
prompt = ChatPromptTemplate.from_messages([
   ('system', """
      As a news company employee, your task is to categorize news articles by topic. You will receive a list of topic names along with the news article. Review the list to determine if the article fits any existing topic. If it does, specify which topic it falls under. If no matching topic exists, create a new one for the article. Limit to just one Topic.
   """),
   ('human', """
      Add the news to their appropriate position in the dictionary from the following source:
    
      {news}
      {topicList}
   """)
])


topicList = ['Red Sea Crisis', 'Russia-Ukraine War', 'US-China Trade Relations']
topicNews = []
for news in filteredNews:
    prompt_text = prompt.invoke({ 
        'news': news,
        'topicList': topicList
    })

    result = llm_structured.invoke(prompt_text)
    result_content = f'Topic: {result.topic}, Is New Topic: {result.isNewTopic}'

    if result.isNewTopic == 'True':
        topicList.append(result.topic)
    news = "Topic: " + result.topic + '\n' + news
    topicNews.append(news)

    print(result_content)
print(topicNews)
