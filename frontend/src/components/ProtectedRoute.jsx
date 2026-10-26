import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

// Protected route for Admin-only pages
export const AdminRoute = ({ children }) => {
  const { aToken } = useContext(AdminContext);
  const { token } = useContext(AppContext);

  // If visitor is currently logged in as a patient, block access immediately
  if (token) {
    toast.error('Access Denied: Patients cannot access the Admin Portal.');
    return <Navigate to="/" replace />;
  }

  // If no admin token, redirect to admin login
  if (!aToken) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

// Protected route for Doctor-only pages
export const DoctorRoute = ({ children }) => {
  const { dToken } = useContext(DoctorContext);
  const { token } = useContext(AppContext);

  // If visitor is currently logged in as a patient, block access immediately
  if (token) {
    toast.error('Access Denied: Patients cannot access the Doctor Portal.');
    return <Navigate to="/" replace />;
  }

  // If no doctor token, redirect to admin/doctor login
  if (!dToken) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

// Protected route for pages accessible by either Admin or Doctor
export const AdminOrDoctorRoute = ({ children }) => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const { token } = useContext(AppContext);

  if (token) {
    toast.error('Access Denied: Patients cannot access staff portals.');
    return <Navigate to="/" replace />;
  }

  if (!aToken && !dToken) {
    return <Navigate to="/admin-login" replace />;
  }

  return children;
};

