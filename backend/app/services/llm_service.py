import os
import json
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))


def evaluate_ad(query: str, ad_title: str, ad_description: str, locale: str = "SG"):
    prompt = f"""
You are evaluating the relevance of a search advertisement.

User query: {query}
Locale: {locale}
Ad title: {ad_title}
Ad description: {ad_description}

Return JSON only with this format:
{{
  "intent": "Commercial | Informational | Navigational",
  "relevance_label": "Highly Relevant | Partially Relevant | Irrelevant",
  "score": 1 to 5,
  "reason": "short explanation"
}}

Consider user intent, ad relevance, and local context.
"""

    response = client.chat.completions.create(
        model="gpt-4.1-mini",
        messages=[
            {"role": "system", "content": "You are a precise search ads evaluator."},
            {"role": "user", "content": prompt},
        ],
        temperature=0
    )

    content = response.choices[0].message.content
    return json.loads(content)