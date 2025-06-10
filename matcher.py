import pandas as pd

def find_likely_diseases(user_input, csv_path="diseases.csv", top_n=5):
    # Load the CSV file
    df = pd.read_csv(csv_path)

    # Process user symptoms
    user_symptoms = set(sym.strip().lower() for sym in user_input.split(",") if sym.strip())

    results = []
    for _, row in df.iterrows():
        disease_symptoms = set(sym.strip().lower() for sym in row["Symptoms"].split(","))
        match_score = len(user_symptoms & disease_symptoms)
        if match_score > 0:
            results.append({
                "Disease": row["Disease"],
                "Score": match_score,
                "Description": row["Description"],
                "Severity": row["Severity"],
                "Symptoms": row["Symptoms"],
                "Precautions": row["Precautions"]
            })

    # Sort diseases by match score in descending order
    results.sort(key=lambda x: x["Score"], reverse=True)

    return results[:top_n]
