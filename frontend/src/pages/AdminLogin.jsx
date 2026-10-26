import React, { useContext, useEffect, useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const AdminLogin = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const { aToken, setAToken, backendUrl } = useContext(AdminContext)
  const { dToken, setDToken } = useContext(DoctorContext)
  const { setToken, setUserData } = useContext(AppContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (aToken) {
      navigate('/admin-dashboard')
    } else if (dToken) {
      navigate('/doctor-dashboard')
    }
  }, [aToken, dToken, navigate])

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        if (data.success) {
          // Strictly clear any customer/doctor tokens for total role isolation
          localStorage.removeItem('token')
          localStorage.removeItem('dToken')
          setToken(false)
          setUserData(false)
          setDToken('')
          localStorage.setItem('aToken', data.token)
          setAToken(data.token)
          toast.success('Admin Logged In Successfully')
          navigate('/admin-dashboard')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
        if (data.success) {
          // Strictly clear any customer/admin tokens for total role isolation
          localStorage.removeItem('token')
          localStorage.removeItem('aToken')
          setToken(false)
          setUserData(false)
          setAToken('')
          localStorage.setItem('dToken', data.token)
          setDToken(data.token)
          toast.success('Doctor Logged In Successfully')
          navigate('/doctor-dashboard')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.response?.data?.message || error.message)
    }
  }

  return (
    <div className='min-h-[85vh] flex items-center justify-center px-4'>
      <form onSubmit={onSubmitHandler} className='w-full max-w-[420px]'>
        <div className='flex flex-col gap-4 items-start p-8 border rounded-2xl text-[#5E5E5E] text-sm shadow-xl bg-white'>
          {/* Segmented Role Selector */}
          <div className='flex w-full bg-gray-100 p-1 rounded-xl mb-1'>
            <button
              type='button'
              onClick={() => setState('Admin')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                state === 'Admin' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-black'
              }`}
            >
              Admin Login
            </button>
            <button
              type='button'
              onClick={() => setState('Doctor')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                state === 'Doctor' ? 'bg-primary text-white shadow-sm' : 'text-gray-600 hover:text-black'
              }`}
            >
              Doctor Login
            </button>
          </div>

          <div className='w-full text-center'>
            <p className='text-2xl font-bold text-gray-800'>
              <span className='text-primary'>{state}</span> Portal
            </p>
            <p className='text-xs text-gray-500 mt-1'>
              Please enter your credentials to access the management portal
            </p>
          </div>

          <div className='w-full'>
            <label className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>Email</label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='border border-[#DADADA] rounded-lg w-full p-2.5 mt-1 focus:outline-primary transition-all'
              type="email"
              placeholder='Enter your email'
              required
            />
          </div>

          <div className='w-full'>
            <label className='text-xs font-semibold text-gray-600 uppercase tracking-wider'>Password</label>
            <div className='relative w-full mt-1'>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                className='border border-[#DADADA] rounded-lg w-full p-2.5 pr-10 focus:outline-primary transition-all'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type='submit'
            className='bg-primary text-white w-full py-2.5 rounded-lg text-base font-medium hover:bg-opacity-90 transition-all shadow-md mt-2'
          >
            Login as {state}
          </button>

          <div className='w-full flex justify-between items-center text-xs pt-2 border-t mt-2'>
            {state === 'Admin' ? (
              <p>
                Are you a Doctor?{' '}
                <span className='text-primary underline cursor-pointer font-medium' onClick={() => setState('Doctor')}>
                  Doctor Login
                </span>
              </p>
            ) : (
              <p>
                Are you an Admin?{' '}
                <span className='text-primary underline cursor-pointer font-medium' onClick={() => setState('Admin')}>
                  Admin Login
                </span>
              </p>
            )}

            <button
              type='button'
              onClick={() => navigate('/login')}
              className='text-primary font-medium hover:underline flex items-center gap-1'
            >
              ← Back to Patient Login
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default AdminLogin
