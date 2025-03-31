import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import dotenv from 'dotenv';
import pagesRoutes from './backend/routes/pages.routes.js';
import servicesRoutes from './backend/routes/services.routes.js';
import blogRoutes from './backend/routes/blog.routes.js';
import newsRoutes from './backend/routes/finnews.routes.js';
import wealthSensedbRoutes from './backend/routes/wealthSensedb.routes.js';
import wpUrlCbRoutes from './backend/routes/wpUrlCb.routes.js'

import pkg from 'express-openid-connect';
const { auth, requiresAuth } = pkg;


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 55555;

// Enable CORS for all routes
app.use(cors());

// Middleware to remove unnecessary headers
app.use((req, res, next) => {
  res.removeHeader('X-XSS-Protection');
  res.removeHeader('X-Powered-By');
  next();
});

// Middleware to parse JSON request bodies
app.use(express.json());


const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BASE_URL || 'http://localhost:55555',
  clientID: process.env.AUTH0_CLIENT_ID,
  issuerBaseURL: 'https://dev-ze43n30i2zjn5fuz.us.auth0.com',

  routes: {
    login: false,
    logout: false
  },

  afterCallback: (req, res, session, state) => {
    session.returnTo = state.returnTo || '/';
    return session;
  }
};

// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(config));


// Custom login route
app.get('/login', (req, res) => {
  res.oidc.login({
    returnTo: '/'
  });
});

// Custom logout route
app.get('/logout', (req, res) => {
  res.oidc.logout({
    returnTo: '/'
  });
});

// Auth status endpoint - as the string
/* app.get('/auth-status', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
}); */

// Auth status endpoint - as JSON- boolean
app.get('/auth-status', (req, res) => {
  res.json({ isAuthenticated: req.oidc.isAuthenticated() });
});



// Protected profile route
app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// A route to get profile data for the frontend
app.get('/user-data', requiresAuth(), (req, res) => {
  res.json(req.oidc.user);
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'backend', 'views'));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Use route files for routing
app.use('/', pagesRoutes);
app.use('/', servicesRoutes);
app.use('/blog', blogRoutes);
app.use('/finance-news', newsRoutes);
app.use('/wealth-sense', wealthSensedbRoutes);
app.use('/wp-url-cb', wpUrlCbRoutes);


// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
