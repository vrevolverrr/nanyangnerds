import torch
import json
from transformers import BertTokenizer, BertForSequenceClassification, Trainer, TrainingArguments
from datasets import load_dataset
import pickle

file_name = "cleaned500.pkl"
# Open the file in binary read mode
with open(file_name, "rb") as file:
    # Use pickle to load the list from the file
    filteredNews = pickle.load(file)

cleanedNews = []

for news in filteredNews:
    n_data = {
        "text": news["content"], 
        "label": 1 if (news["critical"].lower() == "yes" or news["critical"].lower() == "true") else 0
    }

    cleanedNews.append(n_data)

with open("your_data.json", "w") as jsonF:
    json.dump(cleanedNews, jsonF)

# Load the pre-trained BERT tokenizer
tokenizer = BertTokenizer.from_pretrained('bert-large-uncased-whole-word-masking')

# Load the pre-trained BERT model for sequence classification
model = BertForSequenceClassification.from_pretrained('bert-large-uncased-whole-word-masking', num_labels=2)

# Load your dataset (must be in a suitable format)
# Make sure your dataset has columns 'text' (the news article) and 'label' (0 or 1)
dataset = load_dataset('json', data_files='your_data.json')

# Tokenize the input text
def tokenize_function(examples):
    return tokenizer(examples['text'], padding="max_length", truncation=True)

# Apply tokenization to the dataset
tokenized_dataset = dataset.map(tokenize_function, batched=True)

# # test if it's already split into train and test 
# print(tokenized_dataset)

# Fine-tuning arguments
training_args = TrainingArguments(
    output_dir="./results",        # Directory to save checkpoints
    num_train_epochs=3,            # Train for 3 epochs (increase if validation losses are high or not stabalize meaning that losses still dropping and accuracy still increasing)
    per_device_train_batch_size=8, # Batch size for training
    per_device_eval_batch_size=8,  # Batch size for evaluation
    eval_strategy="epoch",   # Evaluate after each epoch
    save_total_limit=2,            # Save only the last 2 checkpoints
)

# Split the dataset into training and validation sets (80% train, 20% validation)
train_dataset = tokenized_dataset['train'].train_test_split(test_size=0.2)['train']
eval_dataset = tokenized_dataset['train'].train_test_split(test_size=0.2)['test']

# Initialize the Trainer for fine-tuning
trainer = Trainer(
    model=model,
    args=training_args,
    train_dataset=train_dataset,
    eval_dataset=eval_dataset,
)

# Fine-tune the model
trainer.train()

# Save the fine-tuned model
model.save_pretrained('./fine_tuned_bert_model')
tokenizer.save_pretrained('./fine_tuned_bert_model')

# # Load the fine-tuned model
# model = BertForSequenceClassification.from_pretrained('./fine_tuned_bert_model')

# # Load the tokenizer associated with the fine-tuned model
# tokenizer = BertTokenizer.from_pretrained('./fine_tuned_bert_model')

# Set the model to evaluation mode (for inference)
model.eval()

def preprocess_input(text, tokenizer, max_len=512):
    # Tokenize the input text
    inputs = tokenizer.encode_plus(
        text,                  # Input text to tokenize
        add_special_tokens=True,  # Add '[CLS]' and '[SEP]'
        max_length=max_len,       # Maximum length of the sequence
        padding='max_length',     # Pad the sequence to the max length
        truncation=True,          # Truncate if it's longer than max length
        return_tensors='pt'       # Return as PyTorch tensors
    )
    return inputs['input_ids'], inputs['attention_mask']

def predict_disruptive_event(news_article, model, tokenizer):
    # Preprocess the news article
    input_ids, attention_mask = preprocess_input(news_article, tokenizer)

    # Pass inputs through the model (no gradient calculation needed for inference)
    with torch.no_grad():
        outputs = model(input_ids, attention_mask=attention_mask)
    
    # Get the prediction (logits)
    logits = outputs.logits
    
    # Apply softmax to get probabilities
    probabilities = torch.softmax(logits, dim=1)

    # Get the predicted label (0 = No disruptive event, 1 = Disruptive event)
    predicted_label = torch.argmax(probabilities).item()
    
    return predicted_label, probabilities[0][1].item()  # Return label and probability of disruptive event

# Example news article
news_article = "The Egyptian Suez Canals annual revenue dropped by about 23.4 per cent in the fiscal year 2023/2024 due to the Red Sea crisis, according to Mr Osama Rabie, chairman of the Suez Canal Authority (SCA). Revenues fell to US$7.2 billion in the fiscal year 2023/2024 that ended in June from US$9.4 billion a year earlier. The number of crossing ships fell to 20,048 in the fiscal year 2023/2024, compared with 25,911 in the fiscal year 2022/2023. The decline in revenues is attributed to the security challenges in the Red Sea, which led many vessel owners and operators to take alternative routes. The ongoing tensions in the Red Sea affect not only the Suez Canal but also the maritime transportation market, trade movement, and international supply chains, as taking alternative routes increases the voyage time and the operation costs. Since November 2023, Yemens Houthi group has been targeting ships in the Red Sea that it claims are connected to Israel as a demonstration of solidarity with Palestinians facing Israeli assaults in the Gaza Strip. The canal, carrying 12 per cent of global trade, is a crucial source of foreign currency for Egypt, a country still grappling with persistent economic woes."

# Make a prediction
prediction, prob = predict_disruptive_event(news_article, model, tokenizer)

# Print the result
if prediction == 1:
    print(f"The news article is likely to cause a disruptive event. Probability: {prob:.2f}")
else:
    print(f"The news article is unlikely to cause a disruptive event. Probability: {prob:.2f}")
