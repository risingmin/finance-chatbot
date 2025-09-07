const axios = require('axios');

const MODEL_NAME = "gemini-1.5-flash";

const getResponse = async (prompt) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyBB8eg_6VCS9OJWC_aBHL4b1n2UOv8b9qo';
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }

    console.log('Making request to Gemini API with model:', MODEL_NAME);
    console.log('API Key available:', !!apiKey);

    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
      contents: [{
        parts: [{
          text: `You are a helpful personal finance assistant. Provide clear, practical advice about budgeting, saving, investing, and financial planning. Keep responses concise and actionable.

User question: ${prompt}`
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 30000
    });

    console.log('Gemini API response status:', response.status);
    console.log('Response data structure:', Object.keys(response.data || {}));

    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text.trim();
    } else {
      console.error('Unexpected response format:', JSON.stringify(response.data, null, 2));
      throw new Error('Invalid response format from Gemini API');
    }
  } catch (error) {
    console.error('Gemini API error:', error.message);
    if (error.response) {
      console.error('API response status:', error.response.status);
      console.error('API response data:', error.response.data);
    } else if (error.request) {
      console.error('No response received from Gemini API');
    }
    throw error;
  }
};

module.exports = {
  getResponse,
  MODEL_NAME
};