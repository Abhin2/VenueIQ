require('dotenv').config();

const express = require('express');
const { clamp } = require('./utils');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));
app.use(express.static(__dirname));

app.post('/api/chat', async (req, res) => {
  try {
    const message = String(req.body?.message || '').trim().slice(0, 5000);
    const prompt = String(req.body?.prompt || '').slice(0, 4000);
    const context = String(req.body?.context || '').slice(0, 4000);

    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Gemini API key is not configured on the server.' });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: prompt + context }] },
          contents: [{ role: 'user', parts: [{ text: message }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: clamp(300, 1, 2048) }
        })
      }
    );

    if (!response.ok) {
      const details = await response.text();
      return res.status(502).json({ error: 'Gemini API request failed', details });
    }

    const data = await response.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      return res.status(502).json({ error: 'Gemini response did not include text output.' });
    }

    return res.json({ text });
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`VenueIQ backend running on http://localhost:${port}`);
});
