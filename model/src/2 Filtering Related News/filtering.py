from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.callbacks.manager import get_openai_callback
from pydantic import BaseModel, Field
from dotenv import load_dotenv
import os
import pandas as pd
import pickle

# set the environment variable key OPENAI_API_KEY
load_dotenv()
OPENAI_API_KEY = os.environ['OPENAI_API_KEY']

llm = ChatOpenAI(temperature=0, model="gpt-4o", streaming=False, api_key=OPENAI_API_KEY)

# class to capture the ouput from the LLM
class StructuredOutput(BaseModel):
   timestamp: list[str] = Field(default_factory=list, description="When does this news happen")
   tags: list[str] = Field(default_factory=list, description="Tags of this event")
   title: list[str] = Field(default_factory=list, description="A summary title for this event")
   content: list[str] = Field(default_factory=list, description="All relevant content on this particular event")

# Pass the class to the LLM
llm_structured = llm.with_structured_output(StructuredOutput)

# create the prompt
prompt = ChatPromptTemplate.from_messages([
   ('system', """
      As a news company employee, your responsibilities include creating tags for each news type and crafting both the title and summary for each news article. You may include multiple tags when appropriate (multiple tags for one news is allowed). The tagging choice are: Entertainment, Politics, World Events, Technology, Business, Health, Science, Economy, Education, Environment, Culture, Travel, Lifestyle, Opinion, Finance, Crime, Local News, International, Weather, Law & Order.
   """),
   ('human', """
      Find all relevant news from the following sources:
    
      {sourceTitle}
      {sourceContent}
   """)
])

# Load URLs from the input Excel file
input_df = pd.read_excel('scraped_content_clean.xlsx')
final_result = []

for i, row in input_df.iterrows():
   title = row['Title']
   content = row['Content']
   
   prompt_text = prompt.invoke({ 
      'sourceTitle': title,
      'sourceContent': content
   })

   result = llm_structured.invoke(prompt_text)
   result_content = f'{i + 1}:\nDate: {result.timestamp[0]} \nTags: {result.tags[0]} \nTitle: {result.title[0]} \nSummary: {result.content[0]}'
   print(result_content)
   print()
   final_result.append(result_content)

   # # invoke the llm
   # with get_openai_callback() as cb:
   #    # result is DiscussionQuestions class
   #    result = llm_structured.invoke(prompt_text)
   #    result_content = f'{i + 1}:\nDate: {result.timestamp[0]} \nTags: {result.tags[0]} \nTitle: {result.title[0]} \nSummary: {result.content[0]}'
   #    print(result_content)
   #    final_result.append(result_content)

   #    print('\n', cb, '\n')

file_name = "filteredNews.pkl"

# Open the file in binary write mode
with open(file_name, "wb") as file:
    # Use pickle to dump the list into the file
    pickle.dump(final_result, file)

print(f"List has been saved to {file_name}")
