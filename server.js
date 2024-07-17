// Step 1: Set up a basic Node.js server using Express
const express = require('express');
const fs = require('fs'); // Import the fs module to use writeFile
const app = express();
const port = 3000;
const path = require('path');
// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Handle POST request to update count
app.post('/update-count', (req, res) => {
  const { count } = req.body;
  fs.writeFile('count.json', JSON.stringify({ count: count }), (err) => {
    if (err) {
      console.error('Error writing file:', err);
      res.status(500).send('Error updating count');
      return;
    }
    res.json({ message: 'Count updated successfully', count: count });
  });
});
app.get('/count', (req, res) => {
  const filePath = path.join(__dirname, 'count.json');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).send('Error getting count');
    }
  });
});
app.get('/hello', (req, res) => {
  res.send('Hello, World!');
});
// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});