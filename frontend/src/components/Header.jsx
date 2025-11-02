import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Heart, Menu, Bell, X } from 'lucide-react'

export default function Header(){
  const navigate = useNavigate()
  const [token, setToken] = React.useState(localStorage.getItem('token'))
  const [userRole, setUserRole] = React.useState(localStorage.getItem('userRole'))
  const [notifications, setNotifications] = React.useState([])
  const [showNotifications, setShowNotifications] = React.useState(false)
  const [unreadCount, setUnreadCount] = React.useState(0)

  // Load notifications from localStorage on mount
  React.useEffect(() => {
    const storedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]')
    setNotifications(storedNotifications)
    setUnreadCount(storedNotifications.filter(n => !n.read).length)

    // Listen for new notifications
    const handleNewNotification = (event) => {
      const newNotification = event.detail
      const updatedNotifications = [newNotification, ...storedNotifications]
      setNotifications(updatedNotifications)
      setUnreadCount(updatedNotifications.filter(n => !n.read).length)
      localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
    }

    // Listen for notification removal (when patient is checked up)
    const handleNotificationRemoved = () => {
      const updatedNotifications = JSON.parse(localStorage.getItem('notifications') || '[]')
      setNotifications(updatedNotifications)
      setUnreadCount(updatedNotifications.filter(n => !n.read).length)
    }

    window.addEventListener('newNotification', handleNewNotification)
    window.addEventListener('notificationRemoved', handleNotificationRemoved)
    
    return () => {
      window.removeEventListener('newNotification', handleNewNotification)
      window.removeEventListener('notificationRemoved', handleNotificationRemoved)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    setToken(null)
    setUserRole(null)
    navigate('/')
  }

  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    )
    setNotifications(updatedNotifications)
    setUnreadCount(updatedNotifications.filter(n => !n.read).length)
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
  }

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }))
    setNotifications(updatedNotifications)
    setUnreadCount(0)
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
  }

  const deleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(n => n.id !== notificationId)
    setNotifications(updatedNotifications)
    setUnreadCount(updatedNotifications.filter(n => !n.read).length)
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications))
  }

  return (
    <header className='bg-white shadow-sm sticky top-0 z-50'>
      <div className='max-w-6xl mx-auto px-4 py-4 flex items-center justify-between'>
        <Link to='/' className='flex items-center gap-2 text-sky-600 font-bold text-xl hover:text-sky-700'>
          <Heart className='w-6 h-6 fill-current' />
          <span>CityCare Hospital</span>
        </Link>
        
        <nav className='hidden md:flex items-center gap-6'>
          <Link to='/' className='text-slate-600 hover:text-sky-600 font-medium transition'>Home</Link>
          <Link to='/about' className='text-slate-600 hover:text-sky-600 font-medium transition'>About</Link>
          <Link to='/doctors' className='text-slate-600 hover:text-sky-600 font-medium transition'>Doctors</Link>
          <Link to='/appointment' className='text-slate-600 hover:text-sky-600 font-medium transition'>Appointments</Link>
          
          {/* Show Admin link only if user is not logged in */}
          {!token && (
            <Link to='/admin-login' className='text-slate-600 hover:text-sky-600 font-medium transition'>Admin</Link>
          )}
          
          {/* Notification Button */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative text-slate-600 hover:text-sky-600 transition"
            >
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 max-h-[500px] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b border-gray-200 p-4 flex justify-between items-center">
                  <h3 className="font-semibold text-gray-800">Notifications</h3>
                  {notifications.length > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <Bell size={48} className="mx-auto mb-3 text-gray-300" />
                    <p>No notifications yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id} 
                        className={`p-4 hover:bg-gray-50 transition-colors ${!notification.read ? 'bg-blue-50' : ''}`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {new Date(notification.timestamp).toLocaleString()}
                            </p>
                          </div>
                          <button
                            onClick={() => deleteNotification(notification.id)}
                            className="ml-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          
          {token ? (
            <>
              {/* Show Dashboard link based on user role */}
              {userRole === 'admin' ? (
                <Link to='/dashboard' className='text-slate-600 hover:text-sky-600 font-medium transition'>Dashboard</Link>
              ) : (
                <Link to='/user-dashboard' className='text-slate-600 hover:text-sky-600 font-medium transition'>Dashboard</Link>
              )}
              <button 
                onClick={handleLogout}
                className='px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 font-medium transition'
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to='/login' className='text-slate-600 hover:text-sky-600 font-medium transition'>Login</Link>
              <Link to='/register' className='px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-medium transition'>
                Register
              </Link>
            </>
          )}
        </nav>

        <button className='md:hidden'>
          <Menu className='w-6 h-6 text-slate-600' />
        </button>
      </div>
    </header>
  )
}
