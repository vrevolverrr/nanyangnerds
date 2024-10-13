import os
import torch
import math
from newsplease import NewsPlease
import requests
from bs4 import BeautifulSoup
from transformers import BertTokenizer, BertForSequenceClassification
from geopy.geocoders import Nominatim
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_community.callbacks.manager import get_openai_callback
from pydantic import BaseModel, Field
from dotenv import load_dotenv
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments

device = torch.device("cuda")

class NewsRiskClassificationModel:
    def __init__(self, path: str): 
        self.model = BertForSequenceClassification.from_pretrained(path).to(device) 
        self.tokenizer = BertTokenizer.from_pretrained(path) 
         
        self.model.eval() 
 
    def preprocess_input(self, text, max_len=512): 
        inputs = self.tokenizer.encode_plus( 
            text,                  # Input text to tokenize 
            add_special_tokens=True,  # Add '[CLS]' and '[SEP]' 
            max_length=max_len,       # Maximum length of the sequence 
            padding='max_length',     # Pad the sequence to the max length 
            truncation=True,          # Truncate if it's longer than max length 
            return_tensors='pt'       # Return as PyTorch tensors 
        ).to(device) 
 
        return inputs['input_ids'], inputs['attention_mask'] 
 
    def predict(self, news_article): 
        # Preprocess the news article 
        input_ids, attention_mask = self.preprocess_input(news_article) 
 
        # Pass inputs through the model (no gradient calculation needed for inference) 
        with torch.no_grad(): 
            outputs = self.model(input_ids, attention_mask=attention_mask) 
         
        # Get the prediction (logits) 
        logits = outputs.logits 
         
        # Apply softmax to get probabilities 
        probabilities = torch.softmax(logits, dim=1).to(device) 
 
        # Get the predicted label (0 = No disruptive event, 1 = Disruptive event) 
        predicted_label = torch.argmax(probabilities).to(device).item() 
         
        return predicted_label, probabilities[0][1].item()  # Return label and probability of disruptive event
    
# class to capture the ouput from the LLM
class StructuredOutput(BaseModel):
    content: str = Field(default_factory=dict, description="A summary of what happened. Include all neccessary information.")
    segment: str = Field(default_factory=dict, description="Which segment might be affected due to this news.")
    title: str = Field(default_factory=dict, description="Title of the news")
    city: str = Field(default_factory=dict, description="city that the news news happens")
    date: str = Field(default_factory=dict, description="date of this news")

class Pipeline:
    def __init__(self):
        self.nrcm = NewsRiskClassificationModel("./model/fine_tuned_bert_model")
        
        load_dotenv()
        OPENAI_API_KEY = os.environ['OPENAI_API_KEY']
        llm = ChatOpenAI(temperature=0, model="gpt-4o", streaming=False, api_key=OPENAI_API_KEY)
        self.llm_structured = llm.with_structured_output(StructuredOutput)

        self.prompt = ChatPromptTemplate.from_messages([
        ('system', """
            You are a supply chain operations specialist. Your task is to:
            1.Craft a summary of the news, ensuring all key details are included.
            2.Create a title that accurately reflects the main content of the news.
            3.Identify the city where the news occurred.
            4.You will also be provided with a list of freight route segments. Your job is to analyze the news and determine which segments may be affected by it.
            5.Provide the date of this news in the format of dd-mm-yyyy.
            Make sure all the necessary information is clearly captured, and ensure the output is concise and accurate.
        """),
        ('human', """
            Find all the required information of this news.
            The list of segments is ["across panama canal", "near caribbean sea", "across the Atlantic", "towards the Strait of Gibraltar", "Strait of Gibraltar entry", "across the Mediterranean", "towards Suez Canal", "entering Suez Canal", "Suez Canal midpoint", "exiting Suez Canal into the Red Sea", "Red Sea southern end", "Bab el Mandeb", "Gulf of Aden", "Arabian Sea entry", "Arabian Sea midpoint", "entering the Indian Ocean", "near Sumatra", "into Straits of Malacca", "into Singapore"]
            
            {news}
        """)
        ])

    def sigmoid_activation(self, x: float):
        k = -7
        avg = 0.4

        x_norm = max(0, 10 * (x - 0.9))
        return 1 / (1 + math.exp(k * (x_norm - avg)))

    def scrape(self, url):
        try:
            response = requests.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            # Extract the content you want here. For this example, we'll just get the title and body text
            title = soup.title.string if soup.title else "No title found"
            body = soup.body.get_text(separator=" ", strip=True) if soup.body else "No body content found"
            return title, body
        
        except Exception as e:
            return ""
        
    def summarise(self, news):
        prompt_text = self.prompt.invoke({ 
            'news': news,
        })

        result = self.llm_structured.invoke(prompt_text)

        return result

    def add_geocode(self, city):
        geolocator = Nominatim(user_agent="nanyangnerds")
        location = geolocator.geocode(city)

        if location == None:
            return 0, 0

        return location.latitude, location.longitude

    def process(self, url):
        title, body = self.scrape(url)
        result = self.summarise(body)

        data = {}
        data['title'] = title
        data['content'] = result.content
        data['segment'] = result.segment
        data['city'] = result.city
        data['url'] = url
        data['date'] = result.date
        data['location'] = self.add_geocode(data['city'])

        nature, prob = self.nrcm.predict(data['content'])

        data["disruptive"] = True if nature else False
        data["risk"] = self.sigmoid_activation(prob)

        print(data)

        return data

    def persist_firebase(self):
        ...

p = Pipeline()
p.process("https://www.nst.com.my/news/nation/2024/10/1119232/pm-anwar-unity-govt-mps-attend-dewan-rakyat-pre-sitting-briefing")