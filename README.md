# VenueIQ — Smart Venue Operating System 🏟️

**VenueIQ** is a next-generation stadium operations dashboard powered by **Google Gemini 1.5/2.0 Flash**. It transforms raw venue telemetry into actionable intelligence, empowering staff to manage massive crowd flows, eliminate bottlenecks, and trigger autonomous security protocols through an **Agentic AI** interface.

---

## 🎯 Chosen Vertical
**Smart City / Operations & Event Management (Sports Tech)**  
VenueIQ focuses on large-scale public venues (stadiums, arenas, concert halls). This is a critical aspect of smart city infrastructure where real-time crowd dynamics, safety, and rapid decision-making are paramount.

---

## 🧠 Approach and Logic
Our approach merges **Real-Time Data Simulation** with **Agentic AI**:

1. **IoT Telemetry Simulation:** We simulate a live data stream representing real-world stadium sensors (gate traffic, wait times, heatmap density, security anomalies).
2. **Context-Aware AI:** Instead of treating the AI as a plain chatbot, we continuously feed the live telemetry context into Gemini alongside every query.
3. **Agentic UI Control:** When an operator issues a natural language command (e.g., “Lockdown Gate A”), the LLM outputs hidden machine-readable action tags (e.g., `[ACTION: LOCKDOWN]`). The frontend parses these tags and triggers UI actions.

---

## ⚙️ How the Solution Works
1. **Dashboard UI:** High-contrast vanilla JS single-page UI visualizes the venue state using Chart.js + CSS heatmaps.
2. **Neu-Chat Agent:** Operator prompts (plus live venue context) are sent to the Node.js + Express backend.
3. **Google Gemini Integration:** Backend proxies the request to the Gemini REST API and returns text output.
4. **Action Execution:** If action tags are present, the UI triggers actions like Dispatch / Lockdown / Report.

---

## 📝 Assumptions Made
1. **Hardware infrastructure exists** (turnstiles, CCTV density estimators, sensors) producing a unified telemetry stream.
2. **Network is stable** enough for low-latency operator workflows.
3. **Privacy:** telemetry is assumed to be anonymized / non-PII.
4. **Operator persona:** command-level staff in high-stress scenarios needing fast, natural-language control.

---

## 🚀 Key Features
- **Agentic UI Control:** Natural language commands trigger hidden action tags which drive UI actions.
- **Context-Aware Analytics:** The agent considers a live, simulated IoT telemetry context.
- **Live Spatial Telemetry:** Crowd density / wait times visualization.
- **Minimal SaaS-style UI:** CSS + Chart.js for speed and simplicity.

---

## 🛠️ Technical Stack
- **Frontend:** Vanilla HTML5, CSS3, JavaScript
- **Backend:** Node.js + Express
- **Data Visualization:** Chart.js (CDN)
- **AI Engine:** Google Gemini Flash (REST API)
- **Testing:** Jest (+ Supertest for API tests)

---

## 🎮 Demo Mode (Hackathon)
This project includes a **demo-only** bypass:
- Click **“Skip & Run Demo Data”** to explore the UI without Gemini.
- Type **`hackathon`** in the auth modal to enable a simulated agent response flow for demo purposes.

> Note: `hackathon` bypass is intended **only for hackathon demo** (local usage).

---

## 🔐 Security Notes (Local Demo)
- Gemini API key is read from server environment (`.env`) and is **not stored in frontend code**.
- The API route has basic input size limits (message/prompt/context).
- LLM safety: actions are constrained to a small set of whitelisted action tags.

---

## 💡 How to Run Locally
1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create `.env` (you can copy from `.env.example`) and set:
   ```bash
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. Start backend:
   ```bash
   node server.js
   ```
5. Open:
   - `http://localhost:3000`

---

## ✅ Run Tests
```bash
npm test
```

**What tests cover:**
- Utility functions (clamp, randomIntInRange, action-tag parsing)
- `/api/chat` API validations (via Supertest with mocked fetch)

---

*Built for the Google AI Hackathon.*  
*Built by Abhishek Nagar.*
