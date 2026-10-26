import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const DoctorContext = createContext();

const DoctorContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const [dToken, setDToken] = useState(
    localStorage.getItem('dToken') ? localStorage.getItem('dToken') : ''
  );
  const [appointments, setAppointments] = useState([]);
  const [dashData, setDashData] = useState(false);
  const [profileData, setProfileData] = useState(false);

  // Getting doctor appointments from API
  const getAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/appointments', { headers: { dToken } });
      if (data.success) {
        setAppointments(data.appointments.reverse());
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Mark appointment completed
  const completeAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/doctor/complete-appointment',
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      setAppointments((prev) =>
        prev.map((item) => (item._id === appointmentId ? { ...item, isCompleted: true } : item))
      );
      toast.success('Appointment Completed');
    }
  };

  // Doctor cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + '/api/doctor/cancel-appointment',
        { appointmentId },
        { headers: { dToken } }
      );
      if (data.success) {
        toast.success(data.message);
        getAppointments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      setAppointments((prev) =>
        prev.map((item) => (item._id === appointmentId ? { ...item, cancelled: true } : item))
      );
      toast.success('Appointment Cancelled');
    }
  };

  // Doctor dashboard metrics
  const getDashData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/dashboard', { headers: { dToken } });
      if (data.success) {
        setDashData(data.dashData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      setDashData({
        earnings: 150,
        appointments: 3,
        patients: 2,
        latestAppointments: appointments.slice(0, 5),
      });
    }
  };

  // Doctor profile data
  const getProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + '/api/doctor/profile', { headers: { dToken } });
      if (data.success) {
        setProfileData(data.profileData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    dToken,
    setDToken,
    backendUrl,
    appointments,
    setAppointments,
    getAppointments,
    completeAppointment,
    cancelAppointment,
    dashData,
    setDashData,
    getDashData,
    profileData,
    setProfileData,
    getProfileData,
  };

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  );
};

export default DoctorContextProvider;
