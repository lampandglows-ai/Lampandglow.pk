import React, { createContext, useContext, useState } from 'react'

const AdminAuthContext = createContext()

export const AdminAuthProvider = ({ children }) => {
  const [adminUser, setAdminUser] = useState(() => {
    const storedAdmin = localStorage.getItem('adminAuthToken')
    if (storedAdmin) {
      try {
        return JSON.parse(storedAdmin)
      } catch {
        localStorage.removeItem('adminAuthToken')
        return null
      }
    }
    return null
  })
  const [error, setError] = useState(null)

  const adminLogin = async (email, password) => {
    try {
      setError(null)

      const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

      if (email !== adminEmail || password !== adminPassword) {
        setError('Invalid admin credentials')
        return
      }

      const adminData = {
        id: 'admin-001',
        email: adminEmail,
        displayName: 'Admin',
        role: 'admin',
        loginTime: new Date().toISOString(),
      }

      setAdminUser(adminData)
      localStorage.setItem('adminAuthToken', JSON.stringify(adminData))
      return { admin: adminData }
    } catch {
      const message = 'Login failed'
      setError(message)
    }
  }

  const adminLogout = () => {
    setAdminUser(null)
    localStorage.removeItem('adminAuthToken')
  }

  const isAdminLoggedIn = () => {
    return adminUser !== null
  }

  const value = {
    adminUser,
    error,
    adminLogin,
    adminLogout,
    isAdminLoggedIn,
  }

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext)
  if (!context) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider')
  }
  return context
}
