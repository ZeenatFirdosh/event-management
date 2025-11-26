// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongodbConnect = require('./lib/db');
const profileRoutes = require('./routes/profileRoutes');
const eventRoutes = require('./routes/eventRoutes');
const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

mongodbConnect();

app.use('/api/profiles', profileRoutes);
app.use('/api/events', eventRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: err.message || 'Internal server error' 
  });
});
    
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});