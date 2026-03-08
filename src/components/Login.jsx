import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'

const API_BASE = import.meta.env.VITE_API_BASE || ''

function Login() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const validate = () => {
    const newErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = '用户名不能为空'
    } else if (formData.username.length < 3) {
      newErrors.username = '用户名至少3个字符'
    }
    
    if (!formData.password) {
      newErrors.password = '密码不能为空'
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6个字符'
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

  // 存储 Token 到 localStorage
  const storeToken = (token) => {
    localStorage.setItem('authToken', token)
    localStorage.setItem('tokenExpiry', Date.now().toString())
  }

  // 检查 Token 是否有效
  const isTokenValid = () => {
    const expiry = localStorage.getItem('tokenExpiry')
    if (!expiry) return false
    // Token 24小时内有效
    return Date.now() - parseInt(expiry) < 24 * 60 * 60 * 1000
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch(`${API_BASE}/api/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        // 存储 Token
        if (data.token) {
          storeToken(data.token)
        }
        // 存储用户信息
        if (data.user) {
          localStorage.setItem('userInfo', JSON.stringify(data.user))
        }
        console.log('登录成功:', data)
        alert('登录成功！')
        // 登录成功后跳转
        navigate('/dashboard')
      } else {
        setErrors({ submit: data.message || '登录失败，请检查用户名和密码' })
      }
    } catch (error) {
      console.error('登录请求失败:', error)
      setErrors({ submit: '网络错误，请稍后重试' })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>用户登录</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">用户名</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="请输入用户名"
              disabled={isLoading}
            />
            {errors.username && <span className="error">{errors.username}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="password">密码</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="请输入密码"
              disabled={isLoading}
            />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          
          {errors.submit && <div className="error submit-error">{errors.submit}</div>}
          
          <button type="submit" className="login-btn" disabled={isLoading}>
            {isLoading ? '登录中...' : '登录'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
