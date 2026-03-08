import { useState } from 'react'
import { Link } from 'react-router-dom'
import './Register.css'

const API_BASE = import.meta.env.VITE_API_BASE || ''

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // 密码强度计算
  const calculatePasswordStrength = (password) => {
    if (!password) return { level: 0, text: '', color: '' }
    
    const hasNumber = /\d/.test(password)
    const hasLetter = /[a-zA-Z]/.test(password)
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password)
    const length = password.length
    
    // 弱：仅数字或仅字母，少于8位
    if ((hasNumber && !hasLetter && !hasSpecial) || (hasLetter && !hasNumber && !hasSpecial) || length < 8) {
      return { level: 1, text: '弱', color: '#e74c3c' }
    }
    
    // 强：字母+数字+特殊字符，10位以上
    if (hasLetter && hasNumber && hasSpecial && length >= 10) {
      return { level: 3, text: '强', color: '#27ae60' }
    }
    
    // 中：字母+数字，8位以上
    if (hasLetter && hasNumber && length >= 8) {
      return { level: 2, text: '中', color: '#f39c12' }
    }
    
    // 默认返回弱
    return { level: 1, text: '弱', color: '#e74c3c' }
  }
  
  const passwordStrength = calculatePasswordStrength(formData.password)

  const validate = () => {
    const newErrors = {}
    
    // 用户名验证（必填，3-20字符）
    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空'
    } else if (formData.username.length < 3 || formData.username.length > 20) {
      newErrors.username = '用户名需要3-20个字符'
    }
    
    // 邮箱验证（必填，格式验证）
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = '邮箱不能为空'
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = '请输入有效的邮箱格式'
    }
    
    // 密码验证（必填，至少8位）
    if (!formData.password) {
      newErrors.password = '密码不能为空'
    } else if (formData.password.length < 8) {
      newErrors.password = '密码至少需要8个字符'
    }
    
    // 确认密码验证
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码'
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = '两次输入的密码不一致'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // 清除对应字段的错误
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch(`${API_BASE}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        console.log('注册成功:', data)
        alert('注册成功！请登录。')
        // 注册成功后跳转至登录页
        window.location.href = '/'
      } else {
        setErrors({ submit: data.message || '注册失败，请稍后重试' })
      }
    } catch (error) {
      console.error('注册请求失败:', error)
      setErrors({ submit: '网络错误，请稍后重试' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-box">
        <h1>用户注册</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="请输入用户名（3-20字符）"
              disabled={isLoading}
            />
            {errors.username && <span className="error">{errors.username}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">邮箱</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="请输入邮箱"
              disabled={isLoading}
            />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="请输入密码（至少8位）"
              disabled={isLoading}
            />
            {formData.password && (
              <div className="password-strength">
                <div className="strength-bar">
                  <div 
                    className={`strength-fill level-${passwordStrength.level}`}
                    style={{ 
                      width: passwordStrength.level === 1 ? '33%' : passwordStrength.level === 2 ? '66%' : '100%',
                      backgroundColor: passwordStrength.color
                    }}
                  ></div>
                </div>
                <span className="strength-text" style={{ color: passwordStrength.color }}>
                  强度：{passwordStrength.text}
                </span>
              </div>
            )}
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">确认密码</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="请再次输入密码"
              disabled={isLoading}
            />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>
          
          {errors.submit && <div className="error submit-error">{errors.submit}</div>}
          
          <button type="submit" className="register-btn" disabled={isLoading}>
            {isLoading ? '注册中...' : '注册'}
          </button>
        </form>
        
        <div className="login-link">
          已有账号？<Link to="/">立即登录</Link>
        </div>
      </div>
    </div>
  )
}

export default Register
