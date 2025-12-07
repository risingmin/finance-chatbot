import { useState, useCallback } from 'react';

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
            // Build API URL
            // In development: Vite proxy forwards /api/chat to http://localhost:8000/api/chat
            // In production: use VITE_API_URL environment variable
            let url;
            if (import.meta.env.PROD && import.meta.env.VITE_API_URL) {
                // Production: use configured API URL
                const baseUrl = import.meta.env.VITE_API_URL.endsWith('/') 
                    ? import.meta.env.VITE_API_URL.slice(0, -1) 
                    : import.meta.env.VITE_API_URL;
                url = `${baseUrl}/api/chat`;
            } else {
                // Development: use relative URL (Vite proxy handles it)
                url = '/api/chat';
            }
            
            console.log(`📤 Sending message to: ${url}`);
            console.log(`💬 Message: "${message}"`);
            
            // Build messages array for the backend (only send user messages)
            const messagesArray = [
                { role: 'user', content: message }
            ];
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ messages: messagesArray }),
                signal: AbortSignal.timeout(120000) // 120s timeout for Ollama (first call can be slow)
            });

            console.log(`📥 Response status: ${response.status}`);

            // Handle HTTP errors
            if (!response.ok) {
                let errorMsg = `HTTP ${response.status}`;
                try {
                    const errorData = await response.json();
                    errorMsg = errorData.message || errorMsg;
                    console.error('❌ API error response:', errorData);
                } catch (e) {
                    const errorText = await response.text();
                    console.error('❌ API error (non-JSON):', errorText);
                }
                throw new Error(errorMsg);
            }

            // Parse response
            const data = await response.json();
            console.log('✅ Response data:', data);
            
            // Check if we got a reply
            if (!data.reply) {
                console.error('❌ No reply in response:', data);
                throw new Error('Received empty response from server');
            }

            console.log(`✅ Received reply (${data.reply.length} chars)`);
            setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
        } catch (err) {
            console.error('❌ Error in chat API:', err.message);

            // Build a helpful error message
            let friendly = 'Unable to reach the assistant. ';
            
            if (err.name === 'AbortError') {
                friendly += 'The request took too long (120s timeout). This might mean Ollama is not running or is overloaded. Try a simpler question or restart Ollama.';
            } else if (err.message.includes('HTTP 503')) {
                friendly += 'Ollama service is not available. Make sure you\'ve started it with: ollama serve';
            } else if (err.message.includes('HTTP 500')) {
                friendly += 'Server error. Check the backend logs for details.';
            } else if (err.message.includes('HTTP 404')) {
                friendly += 'API route not found. Make sure the backend is running on port 8000.';
            } else if (err.message.includes('HTTP')) {
                friendly += `Server error: ${err.message}`;
            } else if (err.message.includes('Failed to fetch')) {
                friendly += 'Network error. Make sure the backend is running on http://localhost:8000';
            } else {
                friendly += err.message || 'Check your connection and try again.';
            }

            console.error('⚠️  Final error message:', friendly);
            setError(friendly);
            // Also surface in the chat stream
            setMessages(prev => [...prev, { text: friendly, sender: 'error' }]);
        } finally {
            setLoading(false);
        }
    }, []);

    return { messages, loading, error, sendMessage };
};

export default useChatApi;