// Define the DeepSeek model name as a constant for consistent usage across the app
const DEEPSEEK_MODEL = "deepseek-ai/DeepSeek-R1-Distill-Llama-70B-free";

const config = {
    PORT: process.env.PORT || 5000,
    LLM_API_URL: process.env.LLM_API_URL || 'https://api.together.ai/v1/completions',
    LLM_API_KEY: process.env.TOGETHER_API_KEY || process.env.LLM_API_KEY || '', // Prioritize TOGETHER_API_KEY
    MODEL_NAME: DEEPSEEK_MODEL,
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/finance-chatbot',
};

// Log API key status (not the actual key) to make it clear if it's missing
console.log(`API Key status: ${config.LLM_API_KEY ? 'Set' : '⚠️ NOT SET - INSERT KEY HERE ⚠️'}`);
console.log(`Using model: ${config.MODEL_NAME}`);

module.exports = config;