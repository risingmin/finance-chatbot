// ...existing code...

// Add a root route if missing
app.get('/', (req, res) => {
  res.send('Finance Chatbot API is running');
});

// ...existing code...