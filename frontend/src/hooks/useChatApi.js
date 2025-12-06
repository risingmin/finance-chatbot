import { useState, useCallback } from 'react';
import api from '@/services/api';

const useChatApi = () => {
    const [messages, setMessages] = useState([
        { text: "Hello! I'm your personal finance assistant. How can I help you today?", sender: 'bot' }
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const sendMessage = useCallback(async (message) => {
        setLoading(true);
        setError(null);
        
        // Add user message immediately to the UI
        setMessages(prev => [...prev, { text: message, sender: 'user' }]);
        
        try {
            const response = await api.post('/api/chat', { message }, {
                headers: { 'Content-Type': 'application/json' },
                timeout: 45000
            });
            
            const data = response.data || {};
            const botText = data.reply || data.response || data.message || data.text || 'I could not generate a response.';
            setMessages(prev => [...prev, { text: botText, sender: 'bot' }]);
        } catch (err) {
            console.error('Error in chat API:', err);

            const status = err.response?.status;
            const detail = err.response?.data?.error || err.response?.data?.details;
            const friendly = status
              ? `The assistant is unavailable (status ${status}). ${detail || 'Please try again shortly.'}`
              : 'Unable to reach the assistant. Check your connection or try again in a moment.';

            setError(friendly);
            // Also surface in the chat stream
            setMessages(prev => [...prev, { text: friendly, sender: 'bot' }]);
        } finally {
            setLoading(false);
        }
    }, []);

    return { messages, loading, error, sendMessage };
};

export default useChatApi;