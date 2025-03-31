/* import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import CircularJSON from 'circular-json';
import { fetchContentBySlug, client } from '../utils/contentful.utils.js';



const router = express.Router();

router.get('/posts', async (req, res) => {
    console.log('Received request for /blog');
    try {
      // console.log('Attempting to fetch entries from Contentful');
      const response = await client.getEntries({
        content_type: 'pageBlogPost',
        order: '-fields.publishedDate'
      });
  
      // Use a custom serializer to handle circular references
      const safeResponse = CircularJSON.stringify(response.items);
      res.send(safeResponse);
    } catch (error) {
      console.error('Detailed error:', error);
      res.status(500).json({
        error: 'Failed to fetch blog articles',
        details: error.message,
        stack: error.stack
      });
    }
  }); */