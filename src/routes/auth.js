const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { hashPassword, verifyPassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

// POST /api/auth/register - 用户注册
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body;
    
    // 验证必填字段
    if (!username || !password || !email) {
      return res.status(400).json({ error: '请填写所有必填字段' });
    }
    
    // 验证密码强度
    if (password.length < 6) {
      return res.status(400).json({ error: '密码长度至少 6 位' });
    }
    
    // 加密密码
    const hashedPassword = await hashPassword(password);
    
    // 创建用户
    const user = await User.create({
      username,
      password: hashedPassword,
      email
    });
    
    // 生成 Token
    const token = generateToken({ id: user.id, username: user.username });
    
    res.status(201).json({
      message: '注册成功',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    if (error.message.includes('已存在')) {
      return res.status(409).json({ error: error.message });
    }
    console.error('注册错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// POST /api/auth/login - 用户登录
router.post('/login', async (req, res) => {
  try {
    const { username, password, remember } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ error: '请输入用户名和密码' });
    }
    
    // 查找用户
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    // 验证密码
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ error: '用户名或密码错误' });
    }
    
    // 生成 Token (如果记住我，则 30 天过期，否则 7 天)
    const token = generateToken({ id: user.id, username: user.username }, remember);
    
    res.json({
      message: '登录成功',
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

// GET /api/auth/me - 获取当前用户信息 (需要认证)
router.get('/me', require('../middleware/auth'), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: '用户不存在' });
    }
    
    res.json({
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '服务器错误' });
  }
});

module.exports = router;
