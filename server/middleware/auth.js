const jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
  let token = null;
  const authHeader = req.headers.authorization || '';
  if (authHeader.startsWith('Bearer ')) {
    token = authHeader.slice(7);
  } else if (req.headers.cookie) {
    const cookies = req.headers.cookie.split(';').map(c => c.trim());
    for (const c of cookies) {
      if (c.startsWith('token=')) {
        token = c.substring(6);
        break;
      }
    }
  }

  if (!token) return res.status(401).json({ message: 'No token provided' });
  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
}

module.exports = { verifyToken, requireAdmin };
