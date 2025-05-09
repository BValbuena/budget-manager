const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Aquí puedes reemplazar por una consulta real a la base de datos
  if (email === 'admin@apolo.com' && password === '123456') {
    return res.json({ token: 'adminToken123' });
  }

  return res.status(401).json({ message: 'Credenciales incorrectas' });
});

module.exports = router;
