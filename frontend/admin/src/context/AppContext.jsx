import { createContext } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currency = '$';

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
    calculateAge,
    slotDateFormat,
    currency,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
