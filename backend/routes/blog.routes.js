import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import CircularJSON from 'circular-json';
import { fetchContentBySlug, client } from '../utils/contentful.utils.js';
import { error } from 'console';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();


router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../blog/blog.html'));
});

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
});

router.get('/post/:slug', async (req, res) => {
  try {
    const postSlug = req.params.slug;
    const post = await fetchContentBySlug('pageBlogPost', postSlug);

    // Check if the post was found
    if (!post) {
      return res.status(404).render('error', {
        message: 'Post not found',
        error: {
          status: 404,
          message: error.message,
          stack: error.stack
        }
      });
    }


    // console.log('xyxcategory',post.fields.category);  

    // Safely get the image URL with a fallback to a default image
    const imageUrl = post.fields && post.fields.featuredImage && post.fields.featuredImage.fields && post.fields.featuredImage.fields.file
      ? post.fields.featuredImage.fields.file.url
      : 'https://wealthpsychology.in/global/imgs/logo.webp';

    // Determine the protocol and construct the full URL for the blog post
    const protocol = req.headers['x-forwarded-proto'] || req.protocol;
    const safeProtocol = protocol === 'http' ? 'https' : protocol;
    const fullUrl = `${safeProtocol}://${req.get('host')}${req.originalUrl}`;

    // Render the post.ejs template with the full post content
    res.render('pages/blog-post/blog-post', {
      post: post.fields,
      postTitle: post.fields.title || 'Untitled Post',
      metaDescription: post.fields.excerpt || '',
      metaKeywords: post.fields.tags || ['finance', 'trading', 'investing', 'wealthpsychology', 'blog'],
      imageUrl: imageUrl,
      blogUrl: fullUrl,
      renderPostRichTextHtml: post.fields.renderPostRichTextHtml || '' // Ensure rendered HTML is available
    });
  } catch (error) {
    console.error('Error fetching post:', error);
    res.status(500).render('error', {
      message: 'Error loading post',
      error: { status: 500, stack: process.env.NODE_ENV === 'development' ? error.stack : '' }
    });
  }
});

export default router;