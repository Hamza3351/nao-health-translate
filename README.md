# Nao Health Translate

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?logo=openai)](https://openai.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A prototype **healthcare translation web app** built with **Next.js + React**, enabling real-time **speech-to-text, translation, and text-to-speech** for multilingual medical communication.  

Deployed on **Vercel** for easy access.

---

## 📖 User Guide  

### 🌟 Features
- 🎙 **Speech-to-Text** → Speak in one language, get instant transcript.  
- 🌐 **Translation** → Converts transcript into target language.  
- 🔊 **Text-to-Speech** → Listen to the translated result.  
- 📱 **Responsive UI** → Works on desktop & mobile.  

### 🚀 How to Use
1. Open the app in your browser.  
2. Select **Input Language** and **Output Language**.  
3. Click **Start Speaking** → your speech is transcribed in real time.  
4. Translation appears instantly below the transcript.  
5. Tap **🔊 Speak** to hear the translation aloud.  

---

## 🛠 Code Documentation  

### 📂 Project Structure
```bash
/src
  /app
    /api
      /translate/route.ts   # API route for translation (calls OpenAI API)
  /components
      Transcriber.tsx       # Speech recognition + transcript display
      Translator.tsx        # Handles translation + audio playback
  /app/page.tsx             # Main UI entry point
  /app/layout.tsx           # Global layout + metadata
next.config.ts              # Next.js config (ESLint/TypeScript handling)
```

### ⚙️ Core APIs & Tools
- **Speech Recognition** → Web Speech API  
- **Translation** → OpenAI API (`gpt-4o-mini` or similar)  
- **Text-to-Speech** → Web Speech Synthesis API  
- **Deployment** → Vercel (serverless hosting)  

### 🔐 Security & Privacy
- ✅ **No storage of transcripts** → everything stays in browser memory.  
- ✅ **HTTPS enforced** → secure communication via Vercel.  
- ✅ **Environment variables** protect API keys (not in client code).  
- ✅ **Minimal logging** → requests only processed, not stored.  

---

- UI is component-based (Transcriber.tsx + Translator.tsx).
- Next.js 15.5.2 with Turbopack used for fast builds.
- ESLint/TS errors ignored in production to speed prototyping.

### 📌 Disclaimer

This is a prototype demo for educational purposes.
It is not HIPAA-compliant and should not be used for real medical decision-making.
