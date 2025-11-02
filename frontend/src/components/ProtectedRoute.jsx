import React from 'react'
import { Navigate } from 'react-router-dom'

// Component to protect routes based on user role
export default function ProtectedRoute({ children, requiredRole }) {
  const token = localStorage.getItem('token')
  
  // If no token, redirect to login
  if (!token) {
    return <Navigate to='/login' replace />
  }
  
  // Parse token to get user role
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const userRole = payload.role
    
    // If requiredRole is specified, check if user has that role
    if (requiredRole) {
      if (requiredRole === 'admin' && userRole !== 'admin') {
        // Non-admin trying to access admin dashboard
        return <Navigate to='/patient-dashboard' replace />
      }
      
      if (requiredRole === 'patient' && userRole === 'admin') {
        // Admin trying to access patient dashboard
        return <Navigate to='/dashboard' replace />
      }
    }
    
    // All checks passed, render the protected component
    return children
  } catch (error) {
    // Invalid token, redirect to login
    console.error('Invalid token:', error)
    localStorage.removeItem('token')
    return <Navigate to='/login' replace />
  }
}
