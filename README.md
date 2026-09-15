# PC BUILDER 2026 🖥️⚡

[![Gemini AI](https://img.shields.io/badge/AI-Google%20Gemini%20Pro-4285F4?logo=google)](https://ai.google.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js)](https://nodejs.org/)
[![Vite](https://img.shields.io/badge/Vite-Bundler-646CFF?logo=vite)](https://vitejs.dev/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-black?logo=vercel)](https://vercel.com/)

A next-generation, interactive web PC configurator and hardware optimization suite powered by **Google Gemini Pro AI**, featuring live Polish retailer pricing (Ceneo, Morele, x-kom), deep hardware compatibility validation, and real-time gaming FPS benchmarking.

---

## 🌟 Key Features

1. **Interactive Component Architecture & Visual Slots:**
   - **10 Hardware Categories:** CPU, Motherboard, Cooler, RAM, GPU, SSD, HDD, PSU, Case, and Monitor.
   - **Engineering Tooltips `(?)`:** Instant technical insights explaining component roles, socket matching, and form factors.
   - **Direct Store Comparison:** One-click price and stock lookup across retailers (Ceneo, Morele, x-kom, Amazon).

2. **🤖 Gemini Pro AI Hardware Consultant:**
   - **Natural Language Chat:** Conversational assistant that understands custom user criteria (e.g., all-white aesthetic, competitive esports, 4K rendering, ultra-silent SFF builds).
   - **Live Configurator Control:** Components recommended by the AI can be placed directly onto the build canvas on the fly.

3. **⚖️ Synergy & Bottleneck Analysis:**
   - **CPU ↔ GPU Balance Matrix:** Instant calculation of pairing bottlenecks across 1080p, 1440p, and 4K resolutions.
   - **«✨ AI Deep Audit»:** Rigorous checks of motherboard VRM power stages, PCIe bus lane allocation, thermal headroom, and predicted 1% Low FPS stability.

4. **⚡ Gaming FPS Benchmark Engine:**
   - Accurate real-time frame rate estimations in demanding modern titles (*Cyberpunk 2077, Counter-Strike 2, GTA V, Dota 2, Red Dead Redemption 2, etc.*) across multiple resolutions.

5. **📖 Hardware Guide & Tech Encyclopedia:**
   - Interactive pop-up guides covering modern x86-64 microarchitectures, AMD 3D V-Cache, VRM phase topologies, ATX 3.0 standards, and PCIe 5.0 12V-2x6 power connections.

6. **🔒 Privacy & Transparency:**
   - Client-side persistence using browser `LocalStorage`.
   - Comprehensive FAQ addressing component choices (DDR4 vs. DDR5, SSD NVMe vs. SATA, airflow dynamics).

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or newer)
- Git

### 1. Clone the repository
```bash
git clone https://github.com/draconua/pc-builder.git
cd pc-builder
```

### 2. Install dependencies (Optional)
```bash
npm install
```

### 3. Launch local development server
```bash
node tools/dev_server.js
```
*Or using Vite:*
```bash
npm run dev
```

### 4. Open in browser
Navigate to: [http://localhost:3000](http://localhost:3000)

---

## ⚙️ Google Gemini AI Configuration (Optional)

To enable the interactive AI Consultant and Deep Synergy Audit features, provide your Google Gemini API key in `gemini_config.json`:

```json
{
  "GEMINI_API_KEY": "YOUR_GEMINI_API_KEY_HERE"
}
```

> **Tip:** You can obtain a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).

---

## 📁 Project Structure

```text
pc-builder/
├── api/                  # Serverless API handlers (price sync & status)
├── css/                  # Modular styles (theme, layout, animations)
├── data/                 # Hardware specifications database & cached prices
├── js/                   # Frontend logic (builder, validation, benchmarks)
├── tools/                # Development server, price scraper & Gemini engine
├── gemini_config.json    # Gemini API configuration
├── index.html            # Main application UI
├── package.json          # Project dependencies & scripts
└── vercel.json           # Vercel deployment configuration
```

---

## 📄 License & Credits
© 2026 PC Builder. Designed and engineered for gamers, creators, and PC enthusiasts.
