import React, { createContext, useReducer, useEffect, } from "react";
import axios from 'axios';
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { initialState, reducer } from "./Reducer/UseReducer";
import AddVehicle from "./components/AddVehicle";
import ViewVehicles from "./components/ViewVehicles";
import DeleteVehicle from "./components/DeleteVehicle";
import LandingPage from "./components/LandingPage";
import UserProfile from "./components/UserProfile";
import GenerateReport from "./components/GenerateReport";

export const UserContext = createContext();

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate()

  const isLoggedIn = async () => {
    try {
        const response = await axios.get('http://localhost:6001/user/isLoggedIn', {
            withCredentials: true,
        });

        if(response.status === 200) {
          dispatch({ type: "USER", payload: true });
          navigate("/viewVehicle")
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
}, [state]);

  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        {<Navbar />}
        <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route path="/generateReport" element={<GenerateReport/>}/>
          <Route path="/Login" element={<Login />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/registerVehicle" element={<AddVehicle/>}/>
          <Route path="/viewVehicle" element={<ViewVehicles/>}/>
          <Route path="/modifyVehicle" element={<DeleteVehicle/>}/>
          <Route path="/view_profile" element={<UserProfile/>}/>
          <Route path="*" element={<Navigate to={state ? "/viewVehicle" : "/Login"} replace />} />

        </Routes>
      </UserContext.Provider>
    </>
  );
};

export default App;
