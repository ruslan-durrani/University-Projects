import React, { useContext, useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'

const Login = () => {
  const { state, dispatch } = useContext(UserContext);

  const navigate = useNavigate();
  const [emailAddress, setemailAddress] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if(state) {
      navigate("/")
    }
  }, [state])

  const loginUser = async (e) => {
    e.preventDefault();
  
    if (!emailAddress || !password) {
      toast.error("Please enter both emailAddress and password", {
        position: "bottom-right",
        theme: "light",
      });
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:6001/user/login", {
        emailAddress,
        password
      }, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true
      });
  
      const data = response.data;
  
      if (response.status === 200 && data) {
        dispatch({ type: "USER", payload: true });
        toast.success("Login Successfully", {
          position: "bottom-right",
          theme: "light",
        });
        setemailAddress("");
        setPassword("");
        navigate("/viewVehicle");
      } else {
        throw new Error(data.error || 'An error occurred during login.');
      }
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed', {
        position: "bottom-right",
        theme: "light",
      });
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-content">
        <h2 className="form-title">Log In</h2>
        <form method="POST" className="register-form" id="register-form">
          <div className="form-group">
            <label htmlFor="emailAddress">Enter Email Address</label>
            <div className="input-group">
              <input
                type="emailAddress"
                name="emailAddress"
                id="emailAddress"
                autoComplete="off"
                placeholder="Enter emailAddress"
                required
                className="form-control"
                value={emailAddress}
                onChange={(e) => setemailAddress(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Enter Password</label>
            <div className="input-group">
              <input
                type="password"
                name="password"
                id="password"
                autoComplete="off"
                placeholder="Enter Password"
                required
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="form-group">
            <input
              type="submit"
              name="signin"
              id="signin"
              className="form-submit fw-bold w-50"
              value="Log In"
              onClick={loginUser}
            />
          </div>
        </form>
        <NavLink to="/Signup" className="signup-video-link">
          Don't have an account? Sign up
        </NavLink>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
