import React, { useState } from 'react';
import api from '../services/api';

// ...existing code...

const handleSendMessage = async (message) => {
  try {
    // This will correctly use https://finance-chatbot-api.onrender.com/chat
    const response = await api.post('/chat', { message });
    // ...handle response
  } catch (error) {
    console.error('Error sending message:', error);
  }
};

// ...existing code...