# VenueIQ — Smart Venue Operating System 🏟️

**VenueIQ** is a next-generation stadium operations dashboard powered by **Google Gemini 1.5/2.0 Flash**. It transforms raw venue telemetry into actionable intelligence, empowering staff to manage massive crowd flows, eliminate bottlenecks, and trigger autonomous security protocols through an **Agentic AI** interface.

---

## 🎯 Chosen Vertical
**Smart City / Operations & Event Management (Sports Tech)**
VenueIQ focuses on large-scale public venues (stadiums, arenas, concert halls). This is a critical aspect of smart city infrastructure where real-time crowd dynamics, safety, and rapid decision-making are paramount to prevent stampedes and ensure optimal operational efficiency.

## 🧠 Approach and Logic
Our approach merges **Real-Time Data Simulation** with **Agentic AI**:
1. **IoT Telemetry Simulation:** We simulate a live data stream representing real-world stadium sensors (gate traffic, wait times, heatmap density, security anomalies). 
2. **Context-Aware AI:** Instead of treating the AI as a plain chatbot, we continuously feed the live, stringified JSON telemetry stream into Gemini's context window alongside every query.
3. **Agentic UI Control:** When an operator issues a natural language command (e.g., "Lockdown Gate A"), the LLM evaluates the intent using a strict system prompt and outputs hidden machine-readable action tags (e.g., `[ACTION:LOCKDOWN]`). The frontend parses these tags to autonomously trigger DOM changes and UI state updates, moving beyond text generation into UI orchestration.

## ⚙️ How the Solution Works
1. **The Dashboard:** A high-contrast, zero-shadow vanilla JavaScript single-page application (SPA) visualizes the live stadium state using Chart.js and CSS-based dynamic heatmaps.
2. **The "Neu-Chat" Agent:** Operators interact with a customized chat interface. Their prompts, interwoven with the JSON state of the venue, are dispatched to the Node.js+Express backend.
3. **API Integration:** The backend proxies the request to the Google Gemini REST API. The AI evaluates the prompt against the current metrics to provide hyper-contextual insights (e.g., knowing Gate A is crowded before the operator explains it).
4. **Action Execution:** If an action is formulated by the AI, it returns the necessary action flags. The frontend utility interceptors catch these flags, execute the required UI manipulations (flashing red, dispatching staff), and surface only the conversational response to the operator.

## 📝 Assumptions Made
1. **Hardware Infrastructure In-Place:** We assume the venue is already equipped with necessary IoT peripherals (CCTV density estimators, turnstile counters, node sensors) that aggregate into a unified data lake/JSON feed.
2. **Network Resilience:** The solution relies on a secure, low-latency network connection between the venue's local hub and the cloud-based LLM.
3. **Data Privacy & Anonymization:** It is assumed that the ingested crowd telemetry is edge-anonymized and does not contain any Personally Identifiable Information (PII) when streamed to the AI context matrix.
4. **Operator Role:** Operators are assumed to be command-level staff needing macroscopic control over the venue, utilizing NLP to bypass complex menus during high-stress scenarios.

---

## 🚀 Key Features
* **Agentic UI Control:** Issue natural language commands like `"Initiate emergency lockdown"` or `"Deploy staff to Gate A"`. Gemini parses the intent and issues hidden tags that dynamically manipulate the DOM and UI state.
* **Context-Aware Analytics:** The AI dynamically reads a simulated real-time IoT JSON stream, meaning it knows exactly which stadium sector is overcrowded before you even ask it.
* **Live Spatial Telemetry:** Monitors crowd density at perimeter gates and wait times at sanitation/food nodes.
* **Ultra-Minimal SaaS Design:** A custom "oxygen-style" zero-shadow, high-contrast dashboard built purely with CSS and Chart.js.

## 🛠️ Technical Stack
* **Frontend:** Vanilla HTML5, CSS3, JavaScript (No heavy frameworks for speed)
* **Backend:** Node.js + Express
* **Data Vis:** Chart.js (CDN)
* **AI Engine:** Google Gemini Flash (REST API Integration)
* **Security:** Server-side Gemini API calls with environment-based secret management
* **Testing:** Jest unit tests for core utility logic

## 💡 How to Run Locally
1. Clone this repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Add your Gemini key in `.env`:
   ```bash
   GEMINI_API_KEY=your_google_gemini_api_key
   ```
4. Start the backend:
   ```bash
   node server.js
   ```
5. Open `http://localhost:3000`.
6. Authenticate from the modal (or type `hackathon` for developer bypass), then use **Neu-Chat**.

## ✅ Run Tests
```bash
npm test
```

---
*Built for the Google AI Hackathon.*
*Built by Abhishek Nagar.*
