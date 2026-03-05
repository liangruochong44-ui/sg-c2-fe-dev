const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

// 加密密码
async function hashPassword(password) {
  return bcrypt.hash(password, SALT_ROUNDS);
}

// 验证密码
async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

module.exports = { hashPassword, verifyPassword };
