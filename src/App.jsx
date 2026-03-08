import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'

// 简单的受保护路由组件
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('authToken')
  const expiry = localStorage.getItem('tokenExpiry')
  const isValid = token && expiry && (Date.now() - parseInt(expiry) < 24 * 60 * 60 * 1000)
  
  if (!isValid) {
    return <Navigate to="/" replace />
  }
  return children
}

// 简单的仪表盘占位组件
function Dashboard() {
  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('tokenExpiry')
    localStorage.removeItem('userInfo')
    window.location.href = '/'
  }
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  
  return (
    <div style={{ padding: '20px' }}>
      <h1>欢迎{userInfo.username ? `，${userInfo.username}` : ''}！</h1>
      <p>登录成功</p>
      <button onClick={handleLogout}>退出登录</button>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
