//src/routes/csrf.routes.js


const express = require('express');
const csrf = require('csurf');
const router = express.Router();

// Middleware CSRF (stocké dans les cookies)
const csrfProtection = csrf({ cookie: true });

router.get('/csrf-token', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

module.exports = router;

