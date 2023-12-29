import React, { useState,useEffect, useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import { UserContext } from '../App';
// import { useNavigate } from 'react-router-dom';

const Signup = () => {

  const navigate = useNavigate();
  const [organizationList, setOrganizationList] = useState([]);
  
  const [user, setUser] = useState({
    fullName: "",
    emailAddress: "",
    phoneNumber: "",
    organization: "",
    password: "",
  });

  const { state, dispatch } = useContext(UserContext);

    useEffect(() => {
    if(state) {
        navigate("/")
    }

    }, [state])

  

  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const fetchOrganizations = async () => {

    try {
      const response = await axios.get('http://localhost:6001/user/fetch_organization');
      const data = response.data;
  
      if (Array.isArray(data)) {
        setOrganizationList(data);
      } else if (typeof data === 'object' && data !== null) {
        setOrganizationList([data]); // Wrapping the single object in an array
      } else {
        console.error("Received data is neither an array nor an object");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchOrganizations()
  }, [])
  

  const PostData = async (e) => {

    try {
    e.preventDefault();

    console.log(user);
    
    // Post request logic here
    // Example:
    const { fullName, emailAddress, phoneNumber, password, organization } = user;

    if(organization == '---SELECT ORGANIZATION---') {
      toast.error("Select organization please", {
        position: "bottom-right",
        theme: "light",
      });
      return
    }

    const res = await fetch('http://localhost:6001/user/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ fullName, emailAddress, phoneNumber, password,organization })
    });
    
    // Logic after the request
    // Example:
    const data = await res.json(); // Assuming the server responds with JSON
    
    if (res.status === 200) {
      // Reset user state if needed
      
      
      // Show success message from server response
      toast.success("Sign Up Succeesful", {
        position: "bottom-right",
        theme: "light",
      });

      setTimeout(() => {
        setUser({ fullName: "", emailAddress: "", phoneNumber: "", password: "" });
        navigate("/Login");
      }, 1500);
      
      // Navigate to the login page
      
    } else {
      // Show error message from server response
      toast.error(data.error, {
        position: "bottom-right",
        theme: "light",
      });
    }
  } catch (error) {
    // Show error message if the request failed
    toast.error(error.message || "Something went wrong, please try again.");
  }
};


  return (
    <div className="signup-container">
      <div className="signup-content">
        <h2 className="form-title">Register</h2>
        <form method="POST" className="register-form" id="register-form">
          <div className="form-group">
            <label htmlFor="name">Enter Full Name</label>
            <input
              type="text"
              name="fullName"
              id="fullName"
              autoComplete="off"
              value={user.fullName}
              onChange={handleInputs}
              placeholder="Enter Full Name"
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Enter Email</label>
            <input
              type="email"
              name="emailAddress"
              id="emailAddress"
              autoComplete="off"
              value={user.emailAddress}
              onChange={handleInputs}
              placeholder="Enter Email"
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Enter Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              id="phoneNumber"
              autoComplete="off"
              value={user.phoneNumber}
              onChange={handleInputs}
              placeholder="Enter Mobile Number"
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Enter Password</label>
            <input
              type="password"
              name="password"
              id="password"
              autoComplete="off"
              value={user.password}
              onChange={handleInputs}
              placeholder="Enter Password"
              required
              minLength="8"
              maxLength="16"
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="vehicleType">Select Organization</label>
            <select
              name="organization"
              id="organization"
              value={user.organization}
              onChange={handleInputs}
              className="form-control"
              required
            >
              <option>---SELECT ORGANIZATION---</option>
              {organizationList.map((org) => (
                <option value={org.name}>{org.name}</option>
                ))}
              
            </select>
          </div>

          <div className="form-group">
            <input
              type="submit"
              name="signup"
              id="signup"
              className="form-submit fw-bold w-50"
              value="Register"
              onClick={PostData}
            />
          </div>
        </form>
        <NavLink to="/Login" className="signup-video-link">
          Already have an account? Login
        </NavLink>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
