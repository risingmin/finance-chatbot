const axios = require('axios');

// Generic LLM caller. Configure via env to work with hosted LLaMA or similar.
const LLM_API_URL = process.env.LLM_API_URL;
const LLM_API_KEY = process.env.LLM_API_KEY;

/**
 * Call the configured LLM endpoint and return text.
 * Expects the provider to accept { prompt } and respond with { reply } or { text }.
 */
const getResponse = async (prompt) => {
  if (!LLM_API_URL) throw new Error('LLM_API_URL is not set');
  if (!LLM_API_KEY) throw new Error('LLM_API_KEY is not set');

  try {
    const response = await axios.post(
      LLM_API_URL,
      { prompt },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${LLM_API_KEY}`
        },
        timeout: 30000
      }
    );

    const data = response.data || {};
    const reply = data.reply || data.text || data.response || data.message;
    if (!reply) {
      throw new Error('Invalid response format from LLM API');
    }
    return reply.toString().trim();
  } catch (error) {
    const status = error.response?.status;
    const details = error.response?.data;
    console.error('LLM API error:', status || error.message);
    if (details) console.error('LLM response body:', details);
    throw error;
  }
};

module.exports = {
  getResponse
};