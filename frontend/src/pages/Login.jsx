import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import { AdminContext } from '../context/AdminContext'
import { DoctorContext } from '../context/DoctorContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext)
  const { setAToken } = useContext(AdminContext)
  const { setDToken } = useContext(DoctorContext)
  const navigate = useNavigate()

  const [state, setState] = useState('Sign Up')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [name, setName] = useState('')

  const onSubmitHandler = async (event) => {
    event.preventDefault()

    try {
      if (state === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/user/register', { name, password, email })
        if (data.success) {
          // Strictly clear any lingering staff tokens so patients can never access staff routes
          localStorage.removeItem('aToken')
          localStorage.removeItem('dToken')
          setAToken('')
          setDToken('')
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Account created successfully')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/user/login', { password, email })
        if (data.success) {
          // Strictly clear any lingering staff tokens so patients can never access staff routes
          localStorage.removeItem('aToken')
          localStorage.removeItem('dToken')
          setAToken('')
          setDToken('')
          localStorage.setItem('token', data.token)
          setToken(data.token)
          toast.success('Logged in successfully')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-zinc-600 text-sm shadow-lg'>
        <p className='text-2xl font-semibold'>{state === 'Sign Up' ? 'Create Account' : 'Login'}</p>
        <p>Please {state === 'Sign Up' ? 'sign up' : 'log in'} to book appointment</p>

        {state === 'Sign Up' && (
          <div className='w-full'>
            <p>Full Name</p>
            <input
              className='border border-zinc-300 rounded w-full p-2 mt-1'
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
              required
            />
          </div>
        )}

        <div className='w-full'>
          <p>Email</p>
          <input
            className='border border-zinc-300 rounded w-full p-2 mt-1'
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            required
          />
        </div>

        <div className='w-full'>
          <p>Password</p>
          <div className='relative w-full mt-1'>
            <input
              className='border border-zinc-300 rounded w-full p-2 pr-10'
              type={showPassword ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required
            />
            <button
              type='button'
              onClick={() => setShowPassword(!showPassword)}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600'
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

        <button type='submit' className='bg-primary text-white w-full py-2 rounded-md text-base hover:bg-opacity-90 transition-all'>
          {state === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        {state === 'Sign Up' ? (
          <p>
            Already have an account?{' '}
            <span onClick={() => setState('Login')} className='text-primary underline cursor-pointer'>
              Login here
            </span>
          </p>
        ) : (
          <p>
            Create a new account?{' '}
            <span onClick={() => setState('Sign Up')} className='text-primary underline cursor-pointer'>
              Click here
            </span>
          </p>
        )}

        {/* Doctor & Hospital Admin Login Option */}
        <div className='w-full pt-4 border-t border-zinc-200 mt-2 text-center'>
          <p className='text-xs text-zinc-500 mb-2'>Are you a Doctor or Hospital Admin?</p>
          <button
            type='button'
            onClick={() => navigate('/admin-login')}
            className='w-full py-2.5 px-4 bg-indigo-50 hover:bg-indigo-100 text-primary border border-primary/30 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 shadow-sm'
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7 0 3.75 3.75 0 0 1 7 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
            </svg>
            Doctor / Admin Login →
          </button>
        </div>
      </div>
    </form>
  )
}

export default Login
