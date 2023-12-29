import React, { useContext, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

const AddVehicle = () => {

  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate("");

  useEffect(() => {
    if(!state) {
      navigate("/Login")
    }
  
  }, [state])
  
  
  const [user, setUser] = useState({
    name: "",
    model: "",
    make: "",
    vehicleType: "",
    vinNumber: "",
  });

  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const PostData = async (e) => {

    try {
    e.preventDefault();

    console.log(user);
    
    // Post request logic here
    // Example:
    const { name,  model, make, vehicleType, vinNumber } = user;
    const res = await fetch('http://localhost:6001/user/add_vehicle', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ name,  model, make, vehicleType, vinNumber })
    });
    
    // Logic after the request
    // Example:
    const data = await res.json(); // Assuming the server responds with JSON
    
    if (res.status === 200) {
      toast.success(data.success, {
        position: "bottom-right",
        theme: "light",
      });

      setUser({name: "", model: "", make: "", vehicleType: "", vinNumber: "" });
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
    <div className="signup-container" style={{marginTop:'150px'}}>
      <div className="signup-content">
        <h2 className="form-title">Add Vehicle</h2>
        <form method="POST" className="register-form" id="register-form">
          <div className="form-group">
            <label htmlFor="name">Enter Vehicle Name</label>
            <input
              type="text"
              name="name"
              id="name"
              autoComplete="off"
              value={user.name}
              onChange={handleInputs}
              placeholder="Enter Vehicle Name"
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="make">Enter Make</label>
            <input
              type="text"
              name="make"
              id="make"
              autoComplete="off"
              value={user.make}
              onChange={handleInputs}
              placeholder="Enter Make"
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="model">Enter Model</label>
            <input
              type="text"
              name="model"
              id="model"
              autoComplete="off"
              value={user.model}
              onChange={handleInputs}
              placeholder="Enter Model"
              required
              className="form-control"
            />
          </div>

          <div className="form-group">
          <label htmlFor="vehicleType">Select Vehicle Type</label>
          <select
            name="vehicleType"
            id="vehicleType"
            value={user.vehicleType}
            onChange={handleInputs}
            className="form-control"
            required
          >
            <option value="">--Choose Vehicle Type--</option>
            <option value="Bike">Bike</option>
            <option value="Car">Car</option>
          </select>
        </div>

        <div className="form-group">
            <label htmlFor="model">Enter VIN Number</label>
            <input
              type="text"
              name="vinNumber"
              id="vinNumber"
              autoComplete="off"
              value={user.vinNumber}
              onChange={handleInputs}
              placeholder="Enter VIN Number"
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
  );
};

export default AddVehicle;
