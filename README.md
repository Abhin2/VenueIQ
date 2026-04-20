# VenueIQ — Smart Venue Operating System 🏟️

**VenueIQ** is a next-generation stadium operations dashboard powered by **Google Gemini 1.5/2.0 Flash**. It transforms raw venue telemetry into actionable intelligence, empowering staff to manage massive crowd flows, eliminate bottlenecks, and trigger autonomous security protocols through an **Agentic AI** interface.

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
