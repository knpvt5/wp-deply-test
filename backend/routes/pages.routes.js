import path from 'path';
import { Router } from 'express';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();


router.get('/finance-news', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/finance-news/finance-news.html'));
});

router.get('/blog', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/blog/blog.html'));
});

router.get('/financial-calculators', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/financial-calculators/financial-calculators.html'));
});

router.get('/finance-quizzes', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/quizzes/quizzes.html'));
});
router.get('/frontend/quizzes/', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/quizzes/quizzes.html'));
});

router.get('/contact-us', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/contact-us/contact-us.html'));
});

router.get('/about-us', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/about-us/about-us.html'));
});

router.get('/our-team', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/our-team/our-team.html'));
});

router.get('/privacy-policy', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/privacy-policy/privacy-policy.html'));
});

router.get('/terms-of-use', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/terms-of-use/terms-of-use.html'));
});

router.get('/our-plans', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/our-plans/our-plans.html'));
});

router.get('/wise-investing', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/wealth-sense/wise-investing/wise-investing.html'));
});

router.get('/smart-trading', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/wealth-sense/smart-trading/smart-trading.html'));
});

router.get('/wp-url-cb', (req, res) => {
  res.sendFile(path.join(__dirname, '../../frontend/wp-chatbots/wp-url-cb/wp-url-cb.html'));
});



export default router;
