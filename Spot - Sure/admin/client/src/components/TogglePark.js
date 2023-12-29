import React, { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import {UserContext} from "../App"
import { useNavigate } from "react-router-dom";



function TogglePark() {
    const [vehicles, setVehicles] = useState([]);

    const { state, dispatch } = useContext(UserContext);
    const navigate = useNavigate("");

    useEffect(() => {
        if(!state) {
        navigate("/")
        }
    }, [state])

    const fetchAvailableVehicles = async () => {
        try {
          const response = await axios.get('http://localhost:4001/admin/fetch_vehicles', {
            withCredentials: true,
          });
          const data = response.data;
      
          if (Array.isArray(data)) {
            setVehicles(data);
          } else if (typeof data === 'object' && data !== null) {
            setVehicles([data]); // Wrapping the single object in an array
          } else {
            console.error("Received data is neither an array nor an object");
          }
        } catch (error) {
          console.error("Error fetching users:", error);
        }
      };
    
      const handleTogglePark = async (vehicleId, isCurrentlyParked) => {
          try {
              
              const newParkingStatus = !isCurrentlyParked;
              let apiResponse;
      
              if (newParkingStatus) {
                  // If the vehicle is not currently parked, we want to park it
                  apiResponse = await axios.post(`http://localhost:4001/admin/park_vehicle/${vehicleId}`, {
                      // Include other necessary data in the body if required
                  }, {
                    withCredentials:true,
                      headers: {
                          'Content-Type': 'application/json',
                          // Add other headers like authorization if needed
                      },
                  });
              } else {
                  // If the vehicle is currently parked, we want to unpark it
                  apiResponse = await axios.put(`http://localhost:4001/admin/unpark_vehicle/${vehicleId}`, {
                      // Include other necessary data in the body if required
                  }, {
                    withCredentials:true,
                      headers: {
                          'Content-Type': 'application/json',
                          // Add other headers like authorization if needed
                      },
                  });
              }
      
              // Update the local state to reflect the change
              const updatedVehicles = vehicles.map(vehicle => {
                  if (vehicle._id === vehicleId) {
                      return { ...vehicle, isParked: newParkingStatus };
                  }
                  return vehicle;
              });
      
              setVehicles(updatedVehicles);
              // Optionally, show a success message
              // showToast("Parking status updated successfully!");
          } catch (error) {
              // Handle any errors
              console.error('Error updating parking status:', error);
              // Optionally, show an error message
              // showToast("Failed to update parking status.");
          }
      };
      
      useEffect(() => {
        fetchAvailableVehicles()
      }, [])
      
      

  return (
    <>
    <div className="mt-3 container">
      <ToastContainer />
      <h2
        className="col-sm mt-3 d-flex justify-content-center align-items-center"
        style={{ color: "#985ace" }}
      >
        View Vehicles
      </h2>
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>Owned By</th>
              <th>Name</th>
              <th>Make</th>
              <th>Model</th>
              <th>Type</th>
              <th>Vin Number</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length > 0 ? 
              vehicles.map(vehicle => (
                <tr key={vehicle._id}>
                  <td>{vehicle.registeredBy.fullName}</td>
                  <td>{vehicle.name}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.model}</td>
                  <td>{vehicle.vehicleType}</td>
                  <td>{vehicle.vinNumber}</td>
                  <td>
                    <button 
                      className={`btn ${vehicle.isParked ? 'btn-success' : 'btn-secondary'}`}
                      onClick={() => handleTogglePark(vehicle._id, vehicle.isParked)}
                    >
                      {vehicle.isParked ? 'Unpark' : 'Park'}
                    </button>
                  </td>
                </tr>
              ))
            :
              <p>No User Available</p>
            }
          </tbody>
        </table>
      </div>

    </div>
  </>
  
  )
}

export default TogglePark