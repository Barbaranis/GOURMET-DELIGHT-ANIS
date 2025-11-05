// 📁 utils/verifyRecaptcha.js
const axios = require('axios');


const verifyRecaptcha = async (token) => {
  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const res = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
      params: {
        secret: secretKey,
        response: token
      }
    });
    return res.data.success;
  } catch (error) {
    return false;
  }
};


module.exports = verifyRecaptcha;

