const config = {
    PORT: process.env.PORT || 5000,
    LLM_API_URL: process.env.LLM_API_URL || 'https://api.together.ai/llama',
    LLM_API_KEY: process.env.LLM_API_KEY || '',
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost:27017/finance-chatbot',
};

module.exports = config;