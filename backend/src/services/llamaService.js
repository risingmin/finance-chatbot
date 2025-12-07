const axios = require('axios');
const llmConfig = require('../config/llmConfig');

/**
 * Call the LLM with a single user message
 * (for backward compatibility)
 */
const getResponse = async (userMessage) => {
  return getResponseWithMessages([
    { role: 'user', content: userMessage }
  ]);
};

/**
 * Call the LLM (Ollama only) with a full messages array
 * Uses the OpenAI-compatible /chat/completions endpoint
 */
const getResponseWithMessages = async (messages) => {
  try {
    if (llmConfig.provider !== 'ollama') {
      throw new Error(`Only Ollama is supported. Current provider: ${llmConfig.provider}`);
    }

    console.log(`📤 [Ollama] Calling: ${llmConfig.endpoint}`);
    console.log(`📝 Model: ${llmConfig.model}`);
    console.log(`💬 Messages: ${messages.length} message(s)`);
    
    // Build request headers
    const headers = {
      'Content-Type': 'application/json',
    };

    // Call Ollama's OpenAI-compatible /chat/completions endpoint
    const response = await axios.post(
      llmConfig.endpoint,
      {
        model: llmConfig.model,
        messages: [
          {
            role: 'system',
            content: 'You are a friendly personal finance coach. Give concrete advice on budgeting, saving, debt payoff, and investing. Be realistic and practical.'
          },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1000,
        stream: false
      },
      {
        headers,
        timeout: 120000, // 120s timeout for Ollama (first call can be slow)
      }
    );

    const data = response.data || {};
    console.log(`✅ Ollama response received (status: ${response.status})`);
    
    // Extract reply from OpenAI-compatible response: choices[0].message.content
    const reply = data.choices?.[0]?.message?.content;
    if (reply) {
      console.log(`✅ Extracted reply (${reply.length} chars)`);
      return reply.toString().trim();
    }
    
    // If we got here, response structure was unexpected
    console.error('❌ Invalid response structure from Ollama');
    console.error('📋 Expected: choices[0].message.content');
    console.error('📋 Received:', JSON.stringify(data, null, 2));
    throw new Error('Invalid response format from Ollama');
  } catch (error) {
    // Log detailed error information for debugging
    const status = error.response?.status;
    const errorData = error.response?.data;
    const message = error.message;
    
    console.error(`❌ [Ollama] LLM API error`);
    console.error(`   Status: ${status || 'network error'}`);
    console.error(`   Message: ${message}`);
    
    if (errorData) {
      console.error(`   Response: ${JSON.stringify(errorData)}`);
    }

    // Check if Ollama is running
    if (status === 404 || message.includes('ECONNREFUSED')) {
      console.error('❌ Ollama is not running or not accessible at', llmConfig.baseUrl);
      const err = new Error('Ollama service is not running. Please start it with: ollama serve');
      err.status = 503;
      throw err;
    }

    // Re-throw with context for the route handler
    const err = new Error(message);
    err.status = status || 500;
    err.details = errorData;
    throw err;
  }
};

module.exports = {
  getResponse,
  getResponseWithMessages
};