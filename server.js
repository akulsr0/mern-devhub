const express = require('express');
const connectDB = require('./config/db');

const app = express();
const port = process.env.PORT || 5000;

// Connect Database
connectDB();

app.get('/', (req, res) => {
  res.send('Welcome to DevHub');
});

app.listen(port, () => console.log(`Server is running at port ${port}...`));
