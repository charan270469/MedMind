import streamlit as st
import pandas as pd
from utils import get_medical_response
from matcher import find_likely_diseases

# Must be first
st.set_page_config(page_title="MedMind - Home", page_icon="🧠", layout="wide")

# Load disease data
@st.cache_data
def load_disease_data():
    df = pd.read_csv("diseases.csv")
    df["Symptoms List"] = df["Symptoms"].str.lower().str.split(", ")
    return df

df = load_disease_data()

st.title("🧠 MedMind - Your AI Symptom Checker")

st.markdown("### 👇 Enter your symptoms (comma separated):")
user_input = st.text_input("", placeholder="e.g., fever, cough, headache")

# Submit button
if st.button("✅ Check Health", type="primary", use_container_width=True):
    if not user_input.strip():
        st.warning("Please enter at least one symptom.")
    else:
        user_symptoms = [sym.strip().lower() for sym in user_input.split(",") if sym.strip()]

        def match_score(disease_symptoms, user_symptoms):
            return len(set(disease_symptoms).intersection(user_symptoms))

        df["Match Score"] = df["Symptoms List"].apply(lambda s: match_score(s, user_symptoms))
        matched = df[df["Match Score"] > 0].sort_values(by="Match Score", ascending=False)

        if matched.empty:
            st.info("No matching diseases found. Try different symptoms or consult a doctor.")
        else:
            st.subheader("🔍 Possible Conditions Found:")
            for _, row in matched.head(5).iterrows():
                st.markdown(f"### 🩺 {row['Disease']} (Match Score: {row['Match Score']})")
                st.markdown(f"**Severity:** {row['Severity'].capitalize()}")
                st.markdown(f"**Description:** {row['Description']}")
                st.markdown(f"**Symptoms:** {row['Symptoms']}")
                st.markdown(f"**Precautions:** {row['Precautions'].replace(';', ' ; ')}")
                st.markdown("---")

            if any(matched["Severity"].str.lower() == "severe"):
                st.error("⚠️ Some possible diseases are severe. Please consult a doctor immediately.")

# Divider
st.markdown("---")

# Common diseases dropdown
st.subheader("📂 Browse Common Diseases")
common_diseases = df["Disease"].unique().tolist()
selected = st.selectbox("Select a common disease to view details:", options=common_diseases, key="common_disease_dropdown")

if selected:
    disease_row = df[df["Disease"] == selected].iloc[0]
    st.markdown(f"### 🩺 {disease_row['Disease']}")
    st.markdown(f"**Severity:** {disease_row['Severity'].capitalize()}")
    st.markdown(f"**Description:** {disease_row['Description']}")
    st.markdown(f"**Symptoms:** {disease_row['Symptoms']}")
    st.markdown(f"**Precautions:** {disease_row['Precautions'].replace(';', ' ; ')}")

