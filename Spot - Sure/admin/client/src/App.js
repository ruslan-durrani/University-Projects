import React, { createContext, useEffect,useReducer } from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import AdminDashboard from "./components/AdminDashboard";
import ManageUsers from "./components/manageUsers";
import Login from "./components/Login";
import AdminNavbar from "./components/AdminNavbar";
import axios from 'axios';
import { initialState, reducer } from "./Reducer/UseReducer";
import AddUser from "./components/AddUser";
import TogglePark from "./components/TogglePark";
import ApproveUsers from "./components/ApproveUsers";

export const UserContext = createContext();


const App = () => {
 
  const [state, dispatch] = useReducer(reducer, initialState);

  const isLoggedIn = async () => {
    try {
        const response = await axios.get('http://localhost:4001/admin/isLoggedIn', {
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
      {state && <AdminNavbar />}
      <Routes>
        
        <Route path="/" element={<Login/>} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/manageUsers" element={<ManageUsers />} />
        <Route path='/addUser' element={<AddUser/>}/>
        <Route path="/approveUsers" element={<ApproveUsers/>} />
        <Route path="*" element={<Navigate to={state ? "/dashboard" : "/"} replace />} />
        <Route path="/togglePark" element={<TogglePark/>}/>
      </Routes>
      </UserContext.Provider>
    </>
  );
};

export default App;
