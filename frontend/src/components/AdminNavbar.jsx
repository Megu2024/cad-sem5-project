import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { useNavigate } from 'react-router-dom'

const AdminNavbar = () => {
  const { aToken, setAToken } = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)

  const navigate = useNavigate()

  const logout = () => {
    navigate('/admin-login')
    if (aToken) {
      setAToken('')
      localStorage.removeItem('aToken')
    }
    if (dToken) {
      setDToken('')
      localStorage.removeItem('dToken')
    }
  }

  return (
    <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white'>
      <div className='flex items-center gap-3 text-xs'>
        <img
          onClick={() => navigate(aToken ? '/admin-dashboard' : '/doctor-dashboard')}
          className='w-36 sm:w-40 cursor-pointer'
          src={assets.admin_logo}
          alt="Prescripto"
        />
        <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600 font-medium'>
          {aToken ? 'Admin' : 'Doctor'}
        </p>
      </div>

      <div className='flex items-center gap-3'>
        <button
          onClick={logout}
          className='bg-primary text-white text-xs sm:text-sm px-6 sm:px-10 py-1.5 sm:py-2 rounded-full hover:bg-opacity-90 transition-all'
        >
          Logout
        </button>
      </div>
    </div>
  )
}

export default AdminNavbar
