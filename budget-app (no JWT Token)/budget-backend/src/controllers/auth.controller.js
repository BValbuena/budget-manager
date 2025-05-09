const jwt = require('jsonwebtoken');
const SECRET = process.env.JWT_SECRET || 'secret';

exports.login = (req, res) => {
  const { email, password } = req.body;

  // Usuario hardcoded
  if (email === 'admin@apolo.com' && password === '123456') {
    const token = jwt.sign({ role: 'admin' }, SECRET, { expiresIn: '2h' });
    return res.json({ token });
  }

  res.status(401).json({ message: 'Credenciales inválidas' });
};
