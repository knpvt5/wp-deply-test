// wpUrlCbRoutes.js
import express from 'express';
import OpenAI from 'openai';
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

dotenv.config();

const router = express.Router();

const client = new OpenAI({
  baseURL: "https://integrate.api.nvidia.com/v1",
  apiKey: process.env.NVIDIA_API,
});

const urls = [
  "https://wealthpsychology.in/index.html",
  "https://wealthpsychology.in/blog/",
  "https://wealthpsychology.in/financial-calculators/",
  "https://wealthpsychology.in/finance-quizzes/",
  "https://wealthpsychology.in/contact-us/",
  "https://wealthpsychology.in/about-us/",
  "https://wealthpsychology.in/our-team/",
  "https://wealthpsychology.in/our-plans/",
];

let websiteTextData = "";

// Initialize SQLite database
const initDb = async () => {
  const wpDataDB = await open({
    filename: './backend/db/wealthpsychologyData.db',
    driver: sqlite3.Database,
  });

  await wpDataDB.exec(`CREATE TABLE IF NOT EXISTS wealthpsychologyData (
    id INTEGER PRIMARY KEY,
    website_data TEXT
  )`);

  return wpDataDB;
};

const saveToDb = async (db, data) => {
  const existingData = await db.get('SELECT id FROM wealthpsychologyData');
  if (existingData) {
    await db.run('UPDATE wealthpsychologyData SET website_data = ? WHERE id = ?', data, existingData.id);
  } else {
    await db.run('INSERT INTO wealthpsychologyData (website_data) VALUES (?)', data);
  }
};

const getFromDb = async (db) => {
  const row = await db.get('SELECT website_data FROM wealthpsychologyData');
  return row?.website_data || null;
};

// Function to scrape website text
const extractAllText = async (urls) => {
  const allData = [];
  try {
    for (const url of urls) {
      try {
        const response = await axios.get(url, {
          headers: {
            'User-Agent':
              'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          },
        });
        const $ = cheerio.load(response.data);
        const text = $('body')
          .text()
          .replace(/\s+/g, ' ')
          .trim();
        allData.push(text);
      } catch (urlError) {
        console.error(`Error scraping ${url}:`, urlError.message);
        // allData.push(`Error scraping ${url}: ${urlError.message}`);
      }
    }
    return allData.join('\n\n');
  } catch (error) {
    console.error('Overall extraction error:', error);
    return null;
  }
};

// Scrape data and handle saving to the database
const scrapeAndSaveData = async (dbPipeline, urls, maxRetries = 5) => {
  let websiteTextData = await extractAllText(urls);
  let retries = 0;

  while ((!websiteTextData || websiteTextData.trim().length === 0) && retries < maxRetries) {
    console.log('No data scraped, retrying...');
    retries++;
    websiteTextData = await extractAllText(urls);
  }

  if (websiteTextData && websiteTextData.trim().length > 0) {
    await saveToDb(dbPipeline, websiteTextData);
    return websiteTextData;
  } else {
    console.log('No data scraped after maximum retries, skipping database update.');
  }

  return null;
};

// Route to scrape text
router.get('/scraped-data', async (req, res) => {
  console.log('Scraping website...');

  const dbPipeline = await initDb();
  websiteTextData = await scrapeAndSaveData(dbPipeline, urls);

  if (websiteTextData && websiteTextData.trim().length > 0) {
    res.json({
      success: true,
      message: 'Website scraped successfully',
      textLength: websiteTextData.length,
      scrapedText: websiteTextData,
    });
  } else {
    res.status(500).json({
      success: false,
      message: 'Failed to scrape website',
    });
  }
});

// Route for streaming AI response
router.post('/wp-ask', async (req, res) => {
  const { question } = req.body;
  console.log('Received question:', question);

  if (!question) {
    res.status(400).json({ error: "No question provided" });
    return;
  }

  const dbPipeline = await initDb();

  if (!websiteTextData) {
    console.log('websiteTextData is empty, retrieving from database...');
    websiteTextData = await getFromDb(dbPipeline);

    if (!websiteTextData) {
      console.log('No data found in the database. Scraping website...');
      websiteTextData = await scrapeAndSaveData(dbPipeline, urls);

      if (!websiteTextData) {
        res.status(400).json({ error: 'Failed to scrape website' });
        return;
      }
    }
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const shortenedText = websiteTextData.slice(0, 5000);
    const stream = await client.chat.completions.create({
      model: "nvidia/llama-3.1-nemotron-70b-instruct",
      messages: [
        { role: "system", content: "You are a helpful assistant. Use the provided website data to answer questions. Do not answer any questions that are not based on the data." },
        { role: "assistant", content: "I will only answer based on this website data only." },
        { role: "system", content: `URL Data:\n${shortenedText}` },
        { role: "user", content: question },
      ],
      temperature: 0.5,
      top_p: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }
    res.write('data: [DONE]\n\n');
    res.end();
  } catch (error) {
    console.error('Error during AI API call:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

export default router;
