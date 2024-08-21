const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Sample route
app.get('/api/greeting', (req, res) => {
  res.json({ message: 'Hello from the backend!' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
