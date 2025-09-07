import { useState, useCallback } from 'react';
import api from '@/services/api';

const useChatApi = () => {
    const [messages, setMessages] = useState([]);
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
            const botText = data.response || data.reply || data.message || data.text || 'I could not generate a response.';
            setMessages(prev => [...prev, { text: botText, sender: 'bot' }]);
        } catch (err) {
            console.error('Error in chat API:', err);
            setError(err.message || 'An error occurred while sending your message');
        } finally {
            setLoading(false);
        }
    }, []);

    return { messages, loading, error, sendMessage };
};

export default useChatApi;