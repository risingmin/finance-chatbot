const axios = require('axios');

// Use the same model constant as in server.js
const DEEPSEEK_MODEL = "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free";
const TOGETHER_API_KEY = '4793ae3bb4dd5229824d39f742bc4a504c3cefde9de93585a6cd4c1fa3ef94c2';

/**
 * Generates a response using the Together.ai API with the DeepSeek model
 * @param {string} prompt - The user's message to process
 * @returns {Promise<Object>} - The AI model's response
 */
const getResponse = async (prompt) => {
  try {
    console.log(`Generating response using model: ${DEEPSEEK_MODEL}`);
    
    // Check for API key
    if (!process.env.TOGETHER_API_KEY) {
      console.error('TOGETHER_API_KEY environment variable is not set');
      throw new Error('Missing Together.ai API key');
    }

    // Make API call to Together.ai
    const response = await axios.post('https://api.together.xyz/v1/completions', {
      model: DEEPSEEK_MODEL,
      prompt: prompt,
      max_tokens: 1024,
      temperature: 0.7,
      top_p: 0.9,
      frequency_penalty: 0,
      presence_penalty: 0
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`
      }
    });

    console.log('API response status:', response.status);
    
    if (response.data && response.data.choices && response.data.choices.length > 0) {
      return response.data.choices[0].text.trim();
    } else {
      console.error('Unexpected response format:', JSON.stringify(response.data));
      throw new Error('Invalid response format from Together.ai API');
    }
  } catch (error) {
    console.error('Error generating response:', error);
    if (error.response) {
      console.error('Response error data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw error;
  }
};

module.exports = {
  getResponse,
  MODEL_NAME: DEEPSEEK_MODEL // Export the model name for use elsewhere
};