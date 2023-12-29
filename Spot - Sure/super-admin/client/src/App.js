import React, { createContext, useEffect,useReducer } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import SuperAdminDashboard from "./components/superAdminDashboard";
import AdminManageUsers from "./components/adminManageUsers";
import AdminManageAdmins from "./components/manageAdmins";
import SuperAdminLogin from "./components/superAdminLogin";
import SuperAdminNavbar from "./components/superAdminNavbar";
import AdminManageOrganizations from "./components/adminManageOrganizations";
import axios from 'axios';
import { initialState, reducer } from "./Reducer/UseReducer";
import AddAdmin from "./components/AddAdmin";
import { ClipLoader } from "react-spinners"; 


export const UserContext = createContext();


const App = () => {
 
  const [state, dispatch] = useReducer(reducer, initialState);

  const isLoggedIn = async () => {
    try {
        const response = await axios.get('http://localhost:5001/super_admin/isLoggedIn', {
            withCredentials: true,
        });

        if(response.status === 200) {
          dispatch({ type: "USER", payload: true });
          
      }
      else {
        dispatch({ type: "USER", payload: false });
      }
      
    } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
  };

  useEffect(() => {
    isLoggedIn();
}, []);

  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
      {state && <SuperAdminNavbar />}
      <Routes>
        
        <Route path="/" element={<SuperAdminLogin/>} />
        <Route path="/dashboard" element={<SuperAdminDashboard />} />
        <Route path="/adminManageUsers" element={<AdminManageUsers />} />
        <Route path="/adminManageAdmins" element={<AdminManageAdmins />} />
        <Route path='/addAdmin' element={<AddAdmin/>}/>
        <Route
          path="/adminManageOrganizations"
          element={<AdminManageOrganizations />}
        />
        <Route path="*" element={<Navigate to={state ? "/dashboard" : "/"} replace />} />
      </Routes>
      </UserContext.Provider>
    </>
  );
};

export default App;
