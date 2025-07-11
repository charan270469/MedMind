# MedMind - AI-Powered Health Assistant

[![Hugging Face Space](https://img.shields.io/badge/Live%20Demo-HuggingFace-blue?logo=huggingface)](https://huggingface.co/spaces/Charan2369/MedMind_App)

MedMind is an AI-powered health assistant web app that helps users analyze symptoms, find nearby hospitals, and chat with an AI health bot. It supports English, Hindi, and Telugu for broader accessibility and is designed to bridge healthcare gaps with advanced technology.

---

## Features

- **AI-Powered Symptom Checker**: Enter your symptoms and receive a preliminary analysis with possible conditions, urgency, and recommended actions.
- **Multilingual Support**: Use the app in English, Hindi, or Telugu.
- **Nearby Hospital Finder**: Locate hospitals near you using geolocation and OpenStreetMap data.
- **AI Health Chatbot**: Chat with an empathetic AI assistant for health questions and guidance.
- **Privacy Focused**: Your health information is processed securely and locally in your browser.

---

## Live Demo

👉 [Try MedMind on Hugging Face Spaces](https://huggingface.co/spaces/Charan2369/MedMind_App)

---

## Screenshots

<!-- Add screenshots here if available -->

---

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)
- npm

### Installation

```bash
# Clone the repository
https://huggingface.co/spaces/Charan2369/MedMind_App
cd MedMind

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```
Visit [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

---

## Project Structure

- `src/components/` — React components (SymptomChecker, HospitalFinder, ChatBot, Sidebar, About)
- `src/services/` — AI service integration (Google Gemini API)
- `src/utils/` — Translations and mock data
- `src/types/` — TypeScript types
- `src/index.css` — Tailwind CSS entry

---

## Technologies Used

- [React](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (build tool)
- [Tailwind CSS](https://tailwindcss.com/) (styling)
- [Google Gemini API](https://ai.google.dev/) (AI health analysis & chat)
- [OpenStreetMap/Overpass API](https://overpass-api.de/) (hospital data)

---

## Environment & API Key

- The Google Gemini API key is currently hardcoded in `src/services/geminiService.ts` for demonstration purposes. For production, use environment variables or a secure backend proxy.

---

## Medical Disclaimer

> **This app is for informational purposes only. It does not provide medical diagnosis or treatment. Always consult a healthcare professional for medical advice.**

---

## License

[MIT](LICENSE) 