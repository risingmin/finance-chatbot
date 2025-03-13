const express = require('express');
const app = express();

// ...existing code...

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ...existing code...

module.exports = app;