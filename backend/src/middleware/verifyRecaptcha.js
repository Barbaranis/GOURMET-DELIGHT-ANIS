// src/middleware/verifyRecaptcha.js
const fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

module.exports = async function verifyRecaptcha(req, res, next) {
  try {
    const token = req.body?.recaptchaToken || '';
    if (!token) {
      return res.status(400).json({ message: 'Token reCAPTCHA manquant.' });
    }

    // En DEV, si pas de secret on bypass pour ne pas bloquer
    if (process.env.NODE_ENV !== 'production' && !process.env.RECAPTCHA_SECRET) {
      console.warn('⚠️ Bypass reCAPTCHA en dev (RECAPTCHA_SECRET manquant)');
      return next();
    }

    const secret = process.env.RECAPTCHA_SECRET;
    // petit log utile pour diagnostiquer
    console.log('🔎 reCAPTCHA token len:', token.length);

    const resp = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token })
    });

    const data = await resp.json();
    if (!data.success || (typeof data.score === 'number' && data.score < 0.5)) {
      console.error('❌ reCAPTCHA invalide:', data);
      return res.status(401).json({ message: 'reCAPTCHA invalide.', details: data });
    }

    return next();
  } catch (e) {
    console.error('❌ verifyRecaptcha error:', e);
    return res.status(500).json({ message: 'Erreur vérification reCAPTCHA.' });
  }
};

