const { verifyToken } = require('../utils/jwt');

// Token 验证中间件
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: '未提供认证令牌' });
  }
  
  const token = authHeader.substring(7);
  const decoded = verifyToken(token);
  
  if (!decoded) {
    return res.status(401).json({ error: '令牌无效或已过期' });
  }
  
  req.user = decoded;
  next();
}

module.exports = authMiddleware;
