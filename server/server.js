// server.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();
require('dotenv').config();
const port = process.env.PORT || 3000;

// Enable CORS for  React app
app.use(cors());

// API key 
const API_KEY = process.env.FOOTBALL_API_KEY;


app.get('/api/competitions', async (req, res) => {
  try {
    const response = await axios.get('https://api.football-data.org/v4/competitions', {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('API Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  }
});

app.get('/api/competitions/:id/standings', async (req, res) => {
  try {
    const response = await axios.get(`https://api.football-data.org/v4/competitions/${req.params.id}/standings`, {
      headers: {
        'X-Auth-Token': API_KEY
      }
    });
    res.json(response.data);
  } catch (error) {
    console.error('API Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Failed to fetch data', details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Proxy server running on port ${port}`);
});