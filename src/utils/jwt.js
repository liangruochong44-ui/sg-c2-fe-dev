const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

// 生成 Token
function generateToken(payload, remember = false) {
  const expiresIn = remember ? '30d' : '7d';
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

// 验证 Token
function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

module.exports = { generateToken, verifyToken, JWT_SECRET };
