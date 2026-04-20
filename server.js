require('dotenv').config();

const path = require('path');
const express = require('express');

const app = express();
const port = process.env.PORT || 3000;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_PROMPT_LENGTH = 4000;
const MAX_CONTEXT_LENGTH = 4000;

app.use(express.json({ limit: '1mb' }));

const rootDir = __dirname;
const sendRootFile = (res, filename) => res.sendFile(path.join(rootDir, filename));

app.get('/', (_req, res) => sendRootFile(res, 'index.html'));
app.get('/app.js', (_req, res) => sendRootFile(res, 'app.js'));
app.get('/style.css', (_req, res) => sendRootFile(res, 'style.css'));
app.get('/utils.js', (_req, res) => sendRootFile(res, 'utils.js'));

app.post('/api/chat', async (req, res) => {
  try {
    const message = String(req.body?.message || '').trim().slice(0, MAX_MESSAGE_LENGTH);
    const prompt = String(req.body?.prompt || '').slice(0, MAX_PROMPT_LENGTH);
    const context = String(req.body?.context || '').slice(0, MAX_CONTEXT_LENGTH);

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
          generationConfig: { temperature: 0.7, maxOutputTokens: 300 }
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
    console.error('Error handling /api/chat:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
  if (require.main === module) {
  app.listen(port, () => {
    console.log(`VenueIQ backend running on http://localhost:${port}`);
  });
}

module.exports = app;
});

app.listen(port, () => {
  console.log(`VenueIQ backend running on http://localhost:${port}`);
});
