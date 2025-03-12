import { useState, useCallback } from 'react';
import config from '../config';

const API_URL = import.meta.env.VITE_API_URL || '';

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
            // For demo/development, simulate API response if API_URL is not set
            if (!API_URL) {
                console.log('No API URL set, using simulated response');
                await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
                
                // Generate a simulated response based on the message content
                let botResponse;
                if (message.toLowerCase().includes('budget')) {
                    botResponse = "Creating a budget is a great first step to financial wellness. Start by tracking your income and expenses for a month, then categorize your spending and identify areas where you can save.";
                } else if (message.toLowerCase().includes('invest')) {
                    botResponse = "For investing, I recommend starting with an emergency fund and retirement accounts like a 401(k) or IRA. Then consider low-cost index funds for long-term growth.";
                } else if (message.toLowerCase().includes('debt')) {
                    botResponse = "To tackle debt effectively, use either the avalanche method (paying highest interest first) or the snowball method (paying smallest balance first). Both work, but the avalanche method saves more money over time.";
                } else if (message.toLowerCase().includes('save')) {
                    botResponse = "To increase savings, try automating transfers to your savings account on payday, following the 50/30/20 rule, and reducing unnecessary expenses like subscriptions you rarely use.";
                } else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
                    botResponse = "Hello! I'm your personal finance assistant. I can help with budgeting, investing, debt management, and savings strategies. What would you like to discuss today?";
                } else {
                    botResponse = "That's an interesting question about personal finance. Would you like to know more about budgeting, investing, debt management, or saving strategies?";
                }
                
                setMessages(prev => [...prev, { text: botResponse, sender: 'bot' }]);
            } else {
                // Real API implementation
                const response = await fetch(`${API_URL}/api/chat`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message }),
                });
                
                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }
                
                const data = await response.json();
                setMessages(prev => [...prev, { text: data.response || data.reply, sender: 'bot' }]);
            }
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