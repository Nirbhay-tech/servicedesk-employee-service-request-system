const jwt = require('jsonwebtoken');
function authenticate(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  try { req.user = jwt.verify(token, process.env.JWT_SECRET); next(); }
  catch { return res.status(401).json({ error: 'Invalid or expired token.' }); }
}
function allowRoles(...roles) { return (req, res, next) => roles.includes(req.user?.role) ? next() : res.status(403).json({ error: 'You do not have permission to perform this action.' }); }
module.exports = { authenticate, allowRoles };
