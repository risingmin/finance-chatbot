import axios from 'axios';

const LLM_API_URL = process.env.LLM_API_URL || 'http://localhost:5000/api/llama';

export const generateResponse = async (prompt) => {
    try {
        const response = await axios.post(LLM_API_URL, { prompt });
        return response.data;
    } catch (error) {
        console.error('Error generating response from Llama model:', error);
        throw error;
    }
};