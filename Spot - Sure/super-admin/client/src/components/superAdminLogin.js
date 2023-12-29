import React, { useState, useContext,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import { UserContext } from "../App";

const SuperAdminLogin = () => {
  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate("");

  useEffect(() => {
    if(state) {
      navigate("/dashboard")
    }
  }, [state])
  
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  const handleSuperAdminLogin = async (e) => { 
    e.preventDefault();
  
    console.log("admin login", adminEmail, adminPassword);
    if (!adminEmail || !adminPassword) {
      toast.error("Please enter both emailAddress and password", {
        position: "bottom-right",
        theme: "light",
      });
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:5001/super_admin/superAdminLogin", {
        emailAddress: adminEmail,
        password: adminPassword
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      });
  
      const data = await response.data;
      console.log("Response is", response.status)
  
      if (response.status === 200) {
        console.log("inside");
        dispatch({ type: "USER", payload: true });
        console.log("inside");
        toast.success("Login Successfully", {
          position: "bottom-right",
          theme: "light",
        });
        setAdminEmail("");
        setAdminPassword("");
        navigate("/superAdminDashboard");
      } else {
        throw new Error(data.error || 'An error occurred during login.');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed', {
        position: "bottom-right",
        theme: "light",
      });
    } 
    // navigate("/superAdminDashboard");
  };

  return (
    <>
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ backgroundColor: "#181e1e", height: "100vh", width: "auto" }}
      >
        <div
          className="mt-5 container adminLoginTopContainer"
          style={{ backgroundColor: "#985ace", width: "500px", height: "auto" }}
        >
          <div className="row d-flex justify-content-center align-items-center">
            <div className="col-sm">
              <i
                className="fa-solid fa-user-secret d-flex justify-content-center mb-3"
                style={{ fontSize: "50px" }}
              ></i>
              <h1
                className="d-flex justify-content-center mb-3"
                style={{ fontSize: "48px" }}
              >
                Super Admin Login
              </h1>
              
              <div
                className="container d-flex justify-content-center adminLoginTopContainer"
                style={{ backgroundColor: "#181e1e", width: "auto" }}
              >
                <form
                  method="POST"
                  className="register-form"
                  id="register-form"
                  onSubmit={handleSuperAdminLogin}
                >
                  <label htmlFor="adminEmail" className="text-white mb-2">
                    Super Admin Email
                  </label>
                  <br />
                  <input
                    type="email"
                    name="adminEmail"
                    id="adminEmail"
                    autoComplete="off"
                    required
                    placeholder="Enter Email"
                    className="p-2 input-group"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                  />
                  <br />
                  <label htmlFor="adminPassword" className="text-white mb-2">
                    Super Admin Password
                  </label>
                  <br />
                  <input
                    type="password"
                    name="adminPassword"
                    id="adminPassword"
                    autoComplete="off"
                    required
                    placeholder="Enter Password"
                    className="p-2 input-group"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                  />
                  <br />
                  <input
                    type="submit"
                    name="signin"
                    id="signin"
                    className="form-submit fw-bold"
                    value="Log In"
                    style={{
                      display: "block",
                      width: "50vh",
                      marginBottom: "10px",
                    }}
                    onClick={handleSuperAdminLogin}
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default SuperAdminLogin;
