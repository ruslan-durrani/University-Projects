import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

const ViewVehicles = () => {
    const [vehicles, setVehicles] = useState([]);

    const { state, dispatch } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
    if(!state) {
        navigate("/Login")
    }

    }, [state])

    
    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const response = await axios.get('http://localhost:6001/user/get_vehicles', {
                    withCredentials: true,
                });
                setVehicles(response.data);
            } catch (error) {
                console.error('Error fetching vehicles:', error);
            }
        };

        fetchVehicles();
    }, []);

    return (
        <div className="container mt-4">
            <h2 className="form-title">Vehicles</h2>
            <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Make</th>
                            <th>Model</th>
                            <th>Type</th>
                            <th>VIN</th>
                            <th>Creation Date</th>
                            <th>Is Parked?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map(vehicle => (
                            <tr key={vehicle._id}>
                                <td>{vehicle.name}</td>
                                <td>{vehicle.make}</td>
                                <td>{vehicle.model}</td>
                                <td>{vehicle.vehicleType}</td>
                                <td>{vehicle.vinNumber}</td>
                                
                                <td>{new Date(vehicle.creationDate).toLocaleDateString()}</td>
                                <td>{vehicle.isParked ? 'Yes' : 'No'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}    

export default ViewVehicles;
