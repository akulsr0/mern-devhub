const express = require('express');
const connectDB = require('./config/db');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json({ extended: false }));

// Connect Database
connectDB();

app.get('/', (req, res) => {
  res.send('Welcome to DevHub');
});

// Routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));

app.listen(port, () => console.log(`Server is running at port ${port}...`));
