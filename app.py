import streamlit as st
from utils import get_medical_response
from matcher import find_likely_diseases


# ⚙️ Set page config FIRST
st.set_page_config(
    page_title="MedMind - Your Health Companion", page_icon="🧠", layout="wide"
)

# 🎉 Welcome Screen
st.title("🧠 Welcome to MedMind")

st.markdown("""
### 🩺 AI-powered Symptom Checker & Health Guide

Welcome to **MedMind**, your intelligent health assistant.  
Use the sidebar to navigate:

- 🔍 **Home** – Enter symptoms and check possible conditions.
- 📘 **About MedMind** – Learn how it works and its purpose.
- 👥 **About Us** – Meet the team behind this project.

> ⚠️ Note: This app is not a substitute for professional medical advice.
""")

# Optional animations or image
st.image(
    "https://cdn.pixabay.com/photo/2021/06/03/13/04/health-6307004_1280.png", width=600
)
