# OmniSense by Nanyang Nerds
## Description
OmniSense is a predictive tool that analyzes the most current news using a fine-tuned BERT model to forecast the likelihood of trade disruptions. It’s the final piece of the puzzle in PSA’s ecosystem, not just reacting to disruptions but predicting them before they happen—much like weather forecasting, but for trade disruptions. By utilizing data and AI, OmniSense helps PSA enhance port resilience and efficiency across its global network, minimizing delays, fuel consumption, and emissions. It achieves this by analyzing historical events and drawing parallels to anticipate future disruptions.

## Installation Instructions
### 1. Clone the repository
### 2. Install the required dependencies

### 3. Creating .env file
Create a .env file in the root directory and add the following variables:

```
OPENAI_API_KEY=<your_openai_api_key>
```

## Usage
OmniSense continuously scrapes news articles, summarizes them using OpenAI’s LLM, and feeds the summaries into our fine-tuned BERT model. It predicts the probability of disruptions in global trade and provides actionable insights for PSA to prevent delays and optimize operations.
- Ensure your API keys are correctly set up for news data ingestion and OpenAI access.
- Run the tool to automatically process real-time news, generate summaries, and predict disruptions.
- Access the results, which include disruption probabilities and key insights for each relevant trade route.

## Features
- Ingesting Massive Data Streams: OmniSense processes vast amounts of data, from news articles and social media posts to government reports and weather updates, identifying critical insights impacting global trade.
- News Filtering and Tagging: It filters and tags news reports based on specific trade routes, detecting significant events near ports instantly.
- Summarization with LLM: Using a Large Language Model (LLM), OmniSense quickly summarizes news, extracting key takeaways and filtering out irrelevant information.
- Timeline Construction: Summaries are organized into timelines, allowing PSA to track events and their progression over time for each route.
- Event Sequence Analysis: Instead of looking at isolated events, OmniSense analyzes event sequences to understand how disruptions escalate and develop.
- Historical Event Comparison using BERT Model: The tool utilize BERT model approach to compare current events with historical disruptions, identifying patterns and parallels.
Risk Scoring with BERT Model: OmniSense generates a risk score for each trade route segment, enabling PSA to assess the likelihood of disruptions and take preventive action to reduce delays and emissions.

## Contributors
This project is built by the Nanyang Nerds team:
- Bryan
- Eldon
- Kevin

