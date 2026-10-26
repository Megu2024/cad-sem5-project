import React, { useContext } from 'react'
import { Route, Routes, Navigate, Outlet } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import MyProfile from './pages/MyProfile'
import MyAppointments from './pages/MyAppointments'
import Appointment from './pages/Appointment'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminLogin from './pages/AdminLogin'
import AdminLayout from './components/AdminLayout'
import Dashboard from './pages/Admin/Dashboard'
import AllAppointments from './pages/Admin/AllAppointments'
import AddDoctor from './pages/Admin/AddDoctor'
import DoctorsList from './pages/Admin/DoctorsList'
import DoctorDashboard from './pages/Doctor/DoctorDashboard'
import DoctorAppointments from './pages/Doctor/DoctorAppointments'
import DoctorProfile from './pages/Doctor/DoctorProfile'
import { AdminRoute, DoctorRoute } from './components/ProtectedRoute'
import { AdminContext } from './context/AdminContext'
import { DoctorContext } from './context/DoctorContext'
import { AppContext } from './context/AppContext'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// Patient Website Layout
const PatientLayout = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <Navbar />
      <Outlet />
      <Footer />
    </div>
  )
}

// Helper component for /admin redirect
const AdminRedirect = () => {
  const { aToken } = useContext(AdminContext)
  const { token } = useContext(AppContext)
  if (token) return <Navigate to="/" replace />
  return aToken ? <Navigate to="/admin-dashboard" replace /> : <Navigate to="/admin-login" replace />
}

// Helper component for /doctor redirect
const DoctorRedirect = () => {
  const { dToken } = useContext(DoctorContext)
  const { token } = useContext(AppContext)
  if (token) return <Navigate to="/" replace />
  return dToken ? <Navigate to="/doctor-dashboard" replace /> : <Navigate to="/admin-login" replace />
}

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        {/* ================= PATIENT / USER ROUTES ================= */}
        <Route element={<PatientLayout />}>
          <Route path='/' element={<Home />} />
          <Route path='/doctors' element={<Doctors />} />
          <Route path='/doctors/:speciality' element={<Doctors />} />
          <Route path='/login' element={<Login />} />
          <Route path='/about' element={<About />} />
          <Route path='/contact' element={<Contact />} />
          <Route path='/my-profile' element={<MyProfile />} />
          <Route path='/my-appointments' element={<MyAppointments />} />
          <Route path='/appointment/:docId' element={<Appointment />} />
        </Route>

        {/* ================= ADMIN & DOCTOR AUTH PORTAL ================= */}
        <Route path='/admin-login' element={<AdminLogin />} />
        <Route path='/admin' element={<AdminRedirect />} />
        <Route path='/doctor' element={<DoctorRedirect />} />

        {/* ================= SECURE ADMIN & DOCTOR DASHBOARD ================= */}
        <Route element={<AdminLayout />}>
          {/* Admin Protected Routes */}
          <Route
            path='/admin-dashboard'
            element={
              <AdminRoute>
                <Dashboard />
              </AdminRoute>
            }
          />
          <Route
            path='/all-appointments'
            element={
              <AdminRoute>
                <AllAppointments />
              </AdminRoute>
            }
          />
          <Route
            path='/add-doctor'
            element={
              <AdminRoute>
                <AddDoctor />
              </AdminRoute>
            }
          />
          <Route
            path='/doctor-list'
            element={
              <AdminRoute>
                <DoctorsList />
              </AdminRoute>
            }
          />

          {/* Doctor Protected Routes */}
          <Route
            path='/doctor-dashboard'
            element={
              <DoctorRoute>
                <DoctorDashboard />
              </DoctorRoute>
            }
          />
          <Route
            path='/doctor-appointments'
            element={
              <DoctorRoute>
                <DoctorAppointments />
              </DoctorRoute>
            }
          />
          <Route
            path='/doctor-profile'
            element={
              <DoctorRoute>
                <DoctorProfile />
              </DoctorRoute>
            }
          />
        </Route>

        {/* Fallback to Home */}
        <Route path='*' element={<Navigate to='/' replace />} />
      </Routes>
    </div>
  )
}

export default App
