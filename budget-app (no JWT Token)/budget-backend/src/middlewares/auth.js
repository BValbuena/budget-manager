const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  // ✅ Modo desarrollo: token simulado
  if (token === 'mock-token') {
    req.user = { id: 0, email: 'admin@dev.local', role: 'admin' };
    return next();
  }

  if (!token) return res.sendStatus(401); // No token

  jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret', (err, user) => {
    if (err) return res.sendStatus(403); // Token inválido
    req.user = user;
    next();
  });
}

function authorizeRoles(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.sendStatus(403); // No autorizado
    }
    next();
  };
}

module.exports = { authenticateToken, authorizeRoles };
