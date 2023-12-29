import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';

const DeleteVehicle = () => {
    const [vehicles, setVehicles] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState({});
    const { state, dispatch } = useContext(UserContext);
    const navigate = useNavigate("");

    useEffect(() => {
    if(!state) {
      navigate("/Login")
    }
  
  }, [state])

    useEffect(() => {
        fetchVehicles();
    }, []);

    const fetchVehicles = async () => {
        try {
            
            const response = await axios.get('http://localhost:6001/user/get_vehicles', {
                withCredentials: true
            });

            setVehicles(response.data);
        } catch (error) {
            console.error('Error fetching vehicles:', error);
        }
    };

    const deleteVehicle = async (id) => {
        // Show a confirmation dialog
        const isConfirmed = window.confirm("Are you sure you want to delete this vehicle?");
        
        if (isConfirmed) {
            try {
                await axios.delete(`http://localhost:6001/user/delete_vehicle/${id}`, {
                    withCredentials: true
                });
                // Update the vehicle list after deletion
                setVehicles(vehicles.filter(vehicle => vehicle._id !== id));
            } catch (error) {
                console.error('Error deleting vehicle:', error);
            }
        }
    };

    const openUpdateModal = (vehicle) => {
        setCurrentVehicle(vehicle);
        setShowModal(true);
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            // Update vehicle API call
            await axios.put(`http://localhost:6001/user/update_vehicle/${currentVehicle._id}`, {
                name: currentVehicle.name,
                make: currentVehicle.make,
                model: currentVehicle.model,
            }, { withCredentials: true });
            
            setShowModal(false);
            fetchVehicles(); // Refresh the list
        } catch (error) {
            console.error('Error updating vehicle:', error);
        }
    };
    

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
                        <th>Registered By</th>
                        <th>Creation Date</th>
                        <th>Is Parked?</th>
                        <th>Actions</th>
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
                            <td>{vehicle.registeredBy}</td>
                            <td>{new Date(vehicle.creationDate).toLocaleDateString()}</td>
                            <td>{vehicle.isParked ? 'Yes' : 'No'}</td>
                            <td>
                                <button 
                                    className="btn btn-danger mr-2"
                                    onClick={() => deleteVehicle(vehicle._id)}
                                >
                                    Delete
                                </button>
                            
                                <span style={{marginLeft:"10px"}} ></span>
                                <button 
                                    className="btn btn-primary ml-5"
                                    
                                    onClick={() => openUpdateModal(vehicle)}
                                >
                                    Update
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Vehicle</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdate}>
                        <Form.Group>
                            <Form.Label style={{marginTop: "10px"}}>Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={currentVehicle.name}
                                onChange={(e) => setCurrentVehicle({...currentVehicle, name: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{marginTop: "10px"}}>Make</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={currentVehicle.make}
                                onChange={(e) => setCurrentVehicle({...currentVehicle, make: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{marginTop: "10px"}} >Model</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={currentVehicle.model}
                                onChange={(e) => setCurrentVehicle({...currentVehicle, model: e.target.value})}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{marginTop: "10px"}}>
                            Update
                        </Button>
                        
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DeleteVehicle;
