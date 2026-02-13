const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET || 'clave-secreta-desarrollo';

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

function requiereAdmin(req, res, next) {
  if (req.usuario.nivel !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores pueden realizar esta acción.' });
  }
  next();
}

module.exports = {
  verificarToken,
  requiereAdmin,
  SECRET_KEY
};
