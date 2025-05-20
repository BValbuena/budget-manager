const jwt = require('jsonwebtoken');

const adminEmail = 'admin@apolo.com';
const adminPassword = 'admin123';

exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  if (email === adminEmail && password === adminPassword) {
    const token = jwt.sign(
      { id: 1, email, role: 'admin' },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '2h' }
    );

    return res.json({ token });
  } else {
    return res.status(401).json({ message: 'Credenciales incorrectas' });
  }
};

exports.register = (req, res) => {
  return res.status(403).json({ message: 'Registro deshabilitado' });
};
