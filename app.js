const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const {OpenAI}  = require("openai")
const firstAidRoutes = require('./routes/firstAidRoutes');
const morgan = require('morgan');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));
// OpenAI configuration
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});


// Routes
app.use('/api', firstAidRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})
.catch((err) => console.error('❌ MongoDB connection error:', err));
