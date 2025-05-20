const express = require('express');
const axios = require('axios');
const router = express.Router();

router.post('/verify-captcha', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false });

  try {
    const secretKey = process.env.RECAPTCHA_SECRET_KEY;
    const { data } = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`
    );
    res.json({ success: data.success });
  } catch (error) {
    console.error('Captcha verification error:', error);
    res.status(500).json({ success: false });
  }
});

module.exports = router;
