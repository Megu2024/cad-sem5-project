import { createContext, useEffect, useState } from "react";
import { doctors as defaultDoctors } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "$";
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4000";

  const [doctors, setDoctors] = useState(defaultDoctors);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false
  );
  const [userData, setUserData] = useState(false);

  // Fetch doctors list from backend (or fallback to default dataset)
  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
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

  // Load user profile data
  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
        setToken(false);
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.log(error);
      setToken(false);
      localStorage.removeItem('token');
    }
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  const calculateAge = (dob) => {
    if (!dob) return 28;
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    return isNaN(age) ? 28 : age;
  };

  const months = [" ", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const slotDateFormat = (slotDate) => {
    if (!slotDate) return '';
    if (slotDate.includes('_')) {
      const dateArray = slotDate.split('_');
      return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
    }
    return slotDate;
  };

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    currency: currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    calculateAge,
    slotDateFormat,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
