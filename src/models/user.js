// 用户模型 (Mock)
// TODO: 后续接入真实数据库

const users = new Map();

const User = {
  // 创建用户
  async create(userData) {
    const { username, password, email } = userData;
    
    // 检查用户是否已存在
    for (const [id, user] of users) {
      if (user.username === username) {
        throw new Error('用户名已存在');
      }
      if (user.email === email) {
        throw new Error('邮箱已被注册');
      }
    }
    
    const id = `user_${Date.now()}`;
    const user = { id, username, email, createdAt: new Date().toISOString() };
    users.set(id, { ...user, password }); // 密码应该加密存储
    return user;
  },
  
  // 根据用户名查找用户
  async findByUsername(username) {
    for (const [id, user] of users) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  },
  
  // 根据 ID 查找用户
  async findById(id) {
    return users.get(id) || null;
  }
};

module.exports = User;
