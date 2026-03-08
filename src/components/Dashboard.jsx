import { useState } from 'react'

// 仪表盘组件
function Dashboard() {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
  const loginTime = localStorage.getItem('loginTime')
  
  // 格式化登录时间
  const formatLoginTime = () => {
    if (!loginTime) return '未知'
    const date = new Date(parseInt(loginTime))
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }
  
  // 模拟最近活动数据
  const recentActivities = [
    { id: 1, action: '登录系统', time: formatLoginTime() },
    { id: 2, action: '访问首页', time: '刚刚' },
  ]
  
  const handleLogout = () => {
    localStorage.removeItem('authToken')
    localStorage.removeItem('tokenExpiry')
    localStorage.removeItem('userInfo')
    localStorage.removeItem('loginTime')
    window.location.href = '/'
  }
  
  const confirmLogout = () => {
    setShowLogoutConfirm(true)
  }
  
  const handleConfirmLogout = () => {
    setShowLogoutConfirm(false)
    handleLogout()
  }
  
  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }
  
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <button style={styles.logoutBtn} onClick={confirmLogout}>
          退出登录
        </button>
      </header>
      
      <main style={styles.main}>
        {/* 用户信息卡片 */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>用户信息</h2>
          <div style={styles.userInfo}>
            <div style={styles.avatar}>
              {userInfo.username ? userInfo.username.charAt(0).toUpperCase() : '?'}
            </div>
            <div style={styles.userDetails}>
              <p style={styles.username}>{userInfo.username || '未设置用户名'}</p>
              <p style={styles.loginTime}>登录时间: {formatLoginTime()}</p>
            </div>
          </div>
        </section>
        
        {/* 功能导航 */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>功能导航</h2>
          <div style={styles.navGrid}>
            <button style={styles.navBtn} onClick={() => alert('OCR/图像理解功能开发中')}>
              <span style={styles.navIcon}>🔍</span>
              <span>视觉工具</span>
            </button>
            <button style={styles.navBtn} onClick={() => alert('文档管理功能开发中')}>
              <span style={styles.navIcon}>📁</span>
              <span>文档管理</span>
            </button>
            <button style={styles.navBtn} onClick={() => alert('设置功能开发中')}>
              <span style={styles.navIcon}>⚙️</span>
              <span>设置</span>
            </button>
          </div>
        </section>
        
        {/* 最近活动 */}
        <section style={styles.card}>
          <h2 style={styles.cardTitle}>最近活动</h2>
          <ul style={styles.activityList}>
            {recentActivities.map(activity => (
              <li key={activity.id} style={styles.activityItem}>
                <span style={styles.activityAction}>{activity.action}</span>
                <span style={styles.activityTime}>{activity.time}</span>
              </li>
            ))}
          </ul>
        </section>
      </main>
      
      {/* 退出登录确认对话框 */}
      {showLogoutConfirm && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>确认退出</h3>
            <p style={styles.modalContent}>确定要退出登录吗？</p>
            <div style={styles.modalActions}>
              <button style={styles.cancelBtn} onClick={cancelLogout}>
                取消
              </button>
              <button style={styles.confirmBtn} onClick={handleConfirmLogout}>
                确定退出
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// 样式对象
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 40px',
    backgroundColor: '#fff',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
  },
  title: {
    margin: 0,
    fontSize: '24px',
    color: '#333',
    fontWeight: 600,
  },
  logoutBtn: {
    padding: '10px 20px',
    backgroundColor: '#ff4d4f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s',
  },
  main: {
    padding: '30px 40px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 12px rgba(0, 0, 0, 0.04)',
  },
  cardTitle: {
    margin: '0 0 20px 0',
    fontSize: '18px',
    color: '#333',
    fontWeight: 600,
    paddingBottom: '12px',
    borderBottom: '1px solid #f0f0f0',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  avatar: {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    backgroundColor: '#1890ff',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 600,
  },
  userDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  username: {
    margin: 0,
    fontSize: '20px',
    color: '#333',
    fontWeight: 500,
  },
  loginTime: {
    margin: 0,
    fontSize: '14px',
    color: '#888',
  },
  navGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
  },
  navBtn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px 20px',
    backgroundColor: '#fafafa',
    border: '2px solid #f0f0f0',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    gap: '12px',
    fontSize: '16px',
    color: '#333',
  },
  navIcon: {
    fontSize: '32px',
  },
  activityList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  activityItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '14px 0',
    borderBottom: '1px solid #f5f5f5',
  },
  activityAction: {
    color: '#333',
    fontSize: '15px',
  },
  activityTime: {
    color: '#888',
    fontSize: '14px',
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '24px',
    width: '360px',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
  },
  modalTitle: {
    margin: '0 0 16px 0',
    fontSize: '18px',
    color: '#333',
    fontWeight: 600,
  },
  modalContent: {
    margin: '0 0 24px 0',
    fontSize: '15px',
    color: '#666',
  },
  modalActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '12px',
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#f0f0f0',
    color: '#333',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  confirmBtn: {
    padding: '10px 20px',
    backgroundColor: '#ff4d4f',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
  },
}

export default Dashboard
