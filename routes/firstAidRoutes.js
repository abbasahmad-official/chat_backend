const express = require('express');
const router = express.Router();
const FirstAid = require('../models/FirstAid');
const {OpenAI}  = require("openai");
require('dotenv').config();
// const {openai} = require("../app");
const openai = new OpenAI({apiKey: process.env.OPENAI_API_KEY});

// GET /api/firstaid?q=burn
router.get('/firstaid', async (req, res) => {
  const query = req.query.q?.toLowerCase() || '';

  try {
    const entry = await FirstAid.findOne({
      keyword: { $regex: query, $options: 'i' }
    });

    if (entry) {
      res.json({ advice: entry.advice });
    } else {
      const aiResponse = await getOpenAiAdvice(query);
      res.json({ advice: aiResponse });
    //   res.json({ advice: null });
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch advice' });
  }
});

// Function to interact with OpenAI and get advice
const getOpenAiAdvice = async (query) => {
  try {
    const prompt = `Provide clear first aid advice for: ${query}. Include steps if possible.`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Or 'gpt-4o', 'gpt-3.5-turbo'
      messages: [
        { role: "user", content: prompt }
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    const message = response.choices?.[0]?.message?.content;

    if (!message) {
      throw new Error("OpenAI response missing expected content.");
    }

    return message.trim();

  } catch (err) {
    console.error('Error while fetching OpenAI advice:', err);
    return '⚠️ Could not fetch advice from OpenAI at this time.';
  }
};


// POST /api/firstaid
router.post('/firstaid', async (req, res) => {
  const { keyword, advice } = req.body;

  if (!keyword || !advice) {
    return res.status(400).json({ error: 'Keyword and advice required' });
  }

  try {
    const entry = await FirstAid.findOneAndUpdate(
      { keyword: keyword.toLowerCase() },
      { advice },
      { upsert: true, new: true }
    );

    res.json(entry);
  } catch (err) {
    res.status(500).json({ error: 'Failed to save advice' });
  }
});

router.get('/keywords', async (req, res) => {
  
  const listKeywords = async() => {
    const keywords = await FirstAid.find({}, 'keyword');
    if(keywords){
      console.log(keywords);
      res.status(200).json(keywords);
    } else{
      res.status(200).json({message: "no keywords found"});
    }
  }
  listKeywords();

});


module.exports = router;
