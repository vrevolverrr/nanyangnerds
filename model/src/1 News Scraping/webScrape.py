import pandas as pd
import requests
from bs4 import BeautifulSoup
import time
import random

def scrape_url(url):
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
        'Upgrade-Insecure-Requests': '1',
        'Cache-Control': 'max-age=0',
    }

    try:
        response = requests.get(url)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        # Extract the content you want here. For this example, we'll just get the title and body text
        title = soup.title.string if soup.title else "No title found"
        body = soup.body.get_text(separator=" ", strip=True) if soup.body else "No body content found"
        return title, body
    except Exception as e:
        return f"Error: {str(e)}", ""

# Load URLs from the input Excel file
input_df = pd.read_excel('News.xlsx')

# Create a list to store results
results = []

# Iterate through URLs and scrape content
for index, row in input_df.iterrows():
    url = row['URL']
    # url = row['URL']  # Assuming the column name is 'URL'
    title, content = scrape_url(url)
    results.append({'URL': url, 'Title': title, 'Content': content})

    # Add a random delay between requests
    delay = random.uniform(1, 5)  # Random delay between 1 and 5 seconds
    print(f"Scraped {url}. Waiting {delay:.2f} seconds before next request...")
    time.sleep(delay)

# Create a DataFrame from the results
output_df = pd.DataFrame(results)

# Remove rows where the title starts with "Error:"
output_df_clean = output_df[~output_df['Title'].str.startswith('Error:', na=False)]

# Save the cleaned results to a new Excel file
output_df_clean.to_excel('scraped_content_clean.xlsx', index=False)

print("Web scraping completed. Results saved to 'scraped_content_clean.xlsx'.")