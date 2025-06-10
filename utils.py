import os
import requests
from dotenv import load_dotenv

load_dotenv()

HF_API_KEY = os.getenv("HF_API_KEY")

model_url = "https://api-inference.huggingface.co/models/osanseviero/meditron-7b"


def get_medical_response(symptoms: str):
    """
    Sends symptoms to the Meditron model to get AI-based medical suggestions.
    """
    if not HF_API_KEY:
        return "⚠️ API key missing or invalid."

    headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    payload = {
        "inputs": f"You are a helpful medical assistant. A patient reports: {symptoms}\nSuggest possible diagnosis, home care tips, and whether to consult a doctor.",
        "parameters": {
            "max_new_tokens": 200,
            "temperature": 0.7,
            "return_full_text": False,
        },
    }

    try:
        response = requests.post(model_url, headers=headers, json=payload)

        if response.status_code == 200:
            result = response.json()
            return (
                result[0]["generated_text"]
                if result
                else "⚠️ No response from AI assistant."
            )
        else:
            return f"❌ Error {response.status_code}: {response.text}"
    except Exception as e:
        return f"❌ Error during request: {str(e)}"
