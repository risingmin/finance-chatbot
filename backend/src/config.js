// Define the DeepSeek model name as a constant for consistent usage across the app
const DEEPSEEK_MODEL = "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free";

// Set a fallback API key for development - this should match the one in llamaService.js
const FALLBACK_API_KEY = '4793ae3bb4dd5229824d39f742bc4a504c3cefde9de93585a6cd4c1fa3ef94c2';

const config = {
    PORT: process.env.PORT || 5000,
    LLM_API_URL: process.env.LLM_API_URL || 'https://api.together.ai/v1/completions',
    LLM_API_KEY: process.env.TOGETHER_API_KEY || process.env.LLM_API_KEY || FALLBACK_API_KEY,
    MODEL_NAME: DEEPSEEK_MODEL,
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/finance-chatbot',
};

// Log API key status (not the actual key) to make it clear if it's missing
if (!config.LLM_API_KEY) {
    console.error('⚠️ API KEY MISSING - INSERT KEY HERE ⚠️');
} else {
    console.log(`API Key status: Set (using ${process.env.TOGETHER_API_KEY ? 'environment variable' : 'fallback key'})`);
}
console.log(`Using model: ${config.MODEL_NAME}`);

module.exports = config;