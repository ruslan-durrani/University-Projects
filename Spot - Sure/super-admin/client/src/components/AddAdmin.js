import React, { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";


const AddAdmin = ()=> {
  const [organizationList, setOrganizationList] = useState([]);

  const [admin, setAdmin] = useState({
    fullName: "",
    emailAddress: "",
    password: "",
    organization: "",
    phoneNumber: "",
  });

  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate("");

  useEffect(() => {
    if(!state) {
      navigate("/")
    }
  
  }, [state])

  const fetchOrganizations = async () => {

    try {
      const response = await axios.get('http://localhost:5001/super_admin/fetch_organization', {
        withCredentials: true,
      });
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
  


  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setAdmin({ ...admin, [name]: value });
  };

  const PostData = async (e) => {

    try {
    e.preventDefault();

    console.log(admin);
    
    // Post request logic here
    // Example:
    const { fullName,  emailAddress, password, organization, phoneNumber } = admin;
    const res = await fetch('http://localhost:5001/super_admin/add_admin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ fullName,  emailAddress, password, organization, phoneNumber })
    });
    
    // Logic after the request
    // Example:
    const data = await res.json(); // Assuming the server responds with JSON
    
    if (res.status === 200) {
      toast.success(data.success, {
        position: "bottom-right",
        theme: "light",
      });

      setAdmin({ fullName: "", emailAddress: "", password: "", organization: "", phoneNumber: ""});
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
    <>
    <div className="signup-container" style={{marginTop:'150px'}}>
    <div className="signup-content">
      <h2 className="form-title">Add Admin</h2>
      <form method="POST" className="register-form" id="register-form">
        <div className="form-group">
          <label htmlFor="name">Enter Full Name</label>
          <input
            type="text"
            name="fullName"
            id="fullName"
            autoComplete="off"
            value={admin.fullName}
            onChange={handleInputs}
            placeholder="Enter Full Name"
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="make">Enter Email Address</label>
          <input
            type="email"
            name="emailAddress"
            id="emailAddress"
            autoComplete="off"
            value={admin.emailAddress}
            onChange={handleInputs}
            placeholder="Enter Email Address"
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
          <label htmlFor="model">Enter Password</label>
          <input
            type="password"
            name="password"
            id="password"
            autoComplete="off"
            value={admin.password}
            onChange={handleInputs}
            placeholder="Enter Model"
            required
            className="form-control"
          />
        </div>

        <div className="form-group">
        <label htmlFor="vehicleType">Select Organization</label>
        <select
          name="organization"
          id="organization"
          value={admin.organization}
          onChange={handleInputs}
          className="form-control"
          required
        >
          {organizationList.map((org) => (
            <option value={org.name}>{org.name}</option>
            ))}
          
        </select>
      </div>

      <div className="form-group">
          <label htmlFor="model">Enter Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            id="phoneNumber"
            autoComplete="off"
            value={admin.phoneNumber}
            onChange={handleInputs}
            placeholder="Enter Phone Number"
            required
            className="form-control"
          />
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
    </div>
    <ToastContainer />
  </div>
  </>
);
}

export default AddAdmin;