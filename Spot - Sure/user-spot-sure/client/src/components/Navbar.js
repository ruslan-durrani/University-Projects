import React, { useContext, useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router-dom";
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Route, Routes, useLocation } from "react-router-dom";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";


const Navbar = () => {
  const location = useLocation();
  const { state, dispatch } = useContext(UserContext);

  const navigate = useNavigate();

  const logOut = () => {
    fetch("http://localhost:6001/user/logout", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        dispatch({ type: "USER", payload: false });
        navigate("/Login");
        if (!res.status === 200) {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }
  

  const RenderMenu = () => {
    return (
      <nav className="navbar navbar-expand-lg navbar-light"  style={{ backgroundColor: "#181e1e" }}>
        <div className="container-fluid">
        <NavLink
            className="ms-5 fw-bold navbar-brand"
            to="/"
            style={{ color: "#985ace", fontSize: 40 }}
          >
            SpotSure
          </NavLink>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarSupportedContent" 
            aria-controls="navbarSupportedContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
  
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto p-4 mb-2 mb-lg-0">
              {/* Conditional rendering based on 'state' */}
              {state ? (
                <>
                  <li className="nav-item pe-4">
                    <NavLink className="nav-link active text-white" aria-current="page" to="/viewVehicle">
                      Vehicle Status
                    </NavLink>
                  </li>
                  <li className="nav-item pe-4">
                    <NavLink className="nav-link text-white" to="/registerVehicle">
                      Register Vehicle
                    </NavLink>
                  </li>
                  <li className="nav-item pe-4">
                    <NavLink className="nav-link text-white" to="/modifyVehicle">
                      Modify Your Vehicle
                    </NavLink>
                  </li>

                  <li className="nav-item pe-4">
                    <NavLink className="nav-link text-white" to="/generateReport">
                     Report
                    </NavLink>
                  </li>

                  <NavLink>
                    <button onClick={logOut} type="button" className="btn text-center text-white fw-bold me-4 btn-login" style={{ borderColor: "#985ace" }}>
                      Log Out
                    </button> 
                  </NavLink>

                  <NavLink to="/view_profile">
                    <button type="button" className="btn text-center text-white fw-bold me-4 btn-login" style={{ borderColor: "#985ace" }}>
                      My Profile
                    </button>
                  </NavLink>


                </>
              ) : (
                <>
                  <li className="nav-item pe-4">
                    <NavLink className="nav-link active text-white" aria-current="page" to="/">
                      Home
                    </NavLink>
                  </li>
                  
                  <NavLink to="/Login">
                    <button type="button" className="btn text-center text-white fw-bold me-4 btn-login" style={{ borderColor: "#985ace" }}>
                      Log In
                    </button>
                  </NavLink>
                  <NavLink to="/Signup">
                    <button type="button" className="btn text-center fw-bold text-dark btn-login" style={{ backgroundColor: "#985ace" }}>
                      Register
                    </button>
                  </NavLink>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    );
  };
  
  return (
    <>
    {/* <nav className="navbar navbar-expand-lg navbar-light" style={{ marginTop: "0", paddingTop: "0", backgroundColor: "#181e1e" }}>
    <div className="container-fluid">
    
        <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarSupportedContent" 
            aria-controls="navbarSupportedContent" 
            aria-expanded="false" 
            aria-label="Toggle navigation"
        >
            <span className="navbar-toggler-icon"></span>
        </button>
         */}
      
          <div className="container-fluid" style={{ backgroundColor: "#181e1e" }}>
            <RenderMenu />
          </div>
        {/* </div> */}
      {/* </nav> */}
      {/* <div style={{ marginTop: "98px" }}></div> */}
    </>
  );
};

export default Navbar;
