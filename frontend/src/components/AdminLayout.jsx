import React, { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { AppContext } from '../context/AppContext'
import { Navigate, Outlet } from 'react-router-dom'
import AdminNavbar from './AdminNavbar'
import AdminSidebar from './AdminSidebar'
import { ToastContainer } from 'react-toastify'

const AdminLayout = () => {
  const { aToken } = useContext(AdminContext)
  const { dToken } = useContext(DoctorContext)
  const { token } = useContext(AppContext)

  // Security check: bounce patients immediately away from staff layouts
  if (token) {
    return <Navigate to='/' replace />
  }

  // Security check: bounce unauthorized visitors to login immediately
  if (!aToken && !dToken) {
    return <Navigate to='/admin-login' replace />
  }

  return (
    <div className='bg-[#F8F9FD] min-h-screen'>
      <ToastContainer />
      <AdminNavbar />
      <div className='flex items-start'>
        <AdminSidebar />
        <div className='flex-1 overflow-x-hidden min-h-[calc(100vh-70px)]'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default AdminLayout
