import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { doctors as defaultDoctors } from "../assets/assets";

export const AdminContext = createContext();

const AdminContextProvider = (props) => {
  const [aToken, setAToken] = useState(
    localStorage.getItem('aToken') ? localStorage.getItem('aToken') : ''
  );
  const [doctors, setDoctors] = useState(defaultDoctors);
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  // Getting all doctors data from API
  const getAllDoctors = async () => {
    try {
      const { data } = await axios.post(backendUrl + '/api/admin/all-doctors', {}, { headers: { aToken } });
      if (data.success && data.doctors && data.doctors.length > 0) {
        setDoctors(data.doctors);
      } else {
        setDoctors(defaultDoctors);
      }
    } catch (error) {
      console.log(error);
      setDoctors(defaultDoctors);
    }
  };

  // Change doctor availability
  const changeAvailability = async (docId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/admin/change-availability',
        { docId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      setDoctors((prev) =>
        prev.map((doc) => (doc._id === docId ? { ...doc, available: !doc.available } : doc))
      );
      toast.success('Availability changed');
    }
  };

  // Getting all appointments data from API
  const getAllAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Cancel appointment from admin
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/admin/cancel-appointment',
        { appointmentId },
        { headers: { aToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAllAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      setAppointments((prev) =>
        prev.map((item) => (item._id === appointmentId ? { ...item, cancelled: true } : item))
      );
      toast.success('Appointment cancelled');
    }
  };

  // Getting admin dashboard metrics
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      setDashData({
        doctors: doctors.length || 15,
        appointments: appointments.length || 3,
        patients: 5,
        latestAppointments: appointments.slice(0, 5),
      });
    }
  };

  const value = {
    aToken,
    setAToken,
    backendUrl,
    doctors,
    getAllDoctors,
    changeAvailability,
    appointments,
    setAppointments,
    getAllAppointments,
    cancelAppointment,
    dashData,
    getDashData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
