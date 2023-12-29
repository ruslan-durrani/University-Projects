import React, { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({});

  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate("");

  useEffect(() => {
    if(!state) {
      navigate("/")
    }
  }, [state])

  const fetchAvailableAdmins = async () => {
    try {
      const response = await axios.get('http://localhost:5001/super_admin/fetchAdmins', {
        withCredentials: true,
      });
      const data = response.data;
  
      if (Array.isArray(data)) {
        setUsers(data);
      } else if (typeof data === 'object' && data !== null) {
        setUsers([data]); // Wrapping the single object in an array
      } else {
        console.error("Received data is neither an array nor an object");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const openUpdateModal = (user) => {
    setCurrentUser(user);
    setShowModal(true);
};

const handleUpdate = async (e) => {
  e.preventDefault();

  if(!currentUser.fullName || !currentUser.emailAddress || !currentUser.phoneNumber) {
    toast.error("Please fill all the fields", {
      position: "bottom-right",
      theme: "light",
    });
    return;
  }
  try {
      // Update vehicle API call
      const res = await axios.put(`http://localhost:5001/super_admin/update_admin/${currentUser._id}`, {
          fullName: currentUser.fullName,
          emailAddress: currentUser.emailAddress,
          phoneNumber: currentUser.phoneNumber,
      }, { withCredentials: true });

      const data = await res.data;

      if (res.status === 200) {
        toast.success(data.success, {
          position: "bottom-right",
          theme: "light",
        });
        setShowModal(false);
        fetchAvailableAdmins(); 
      }
      // Update the vehicle list after deletion
      
      else {
        // Show error message from server response
        toast.error(data.error, {
          position: "bottom-right",
          theme: "light",
        });
      }
    }
      
  catch (error) {
    toast.error(error, {
      position: "bottom-right",
      theme: "light",
    });
      console.error('Error deleting admin:', error);
  }
};
  

  const handleDeleteAdmin = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this Admin?");
      
        if (isConfirmed) {
            try {
                console.log(id)

                const res = await axios.delete(`http://localhost:5001/super_admin/delete_admin/${id}`, {
                    withCredentials: true
                });

                const data = await res.data;

                if (res.status === 200) {
                  toast.success(data.success, {
                    position: "bottom-right",
                    theme: "light",
                  });
                  setUsers(users.filter(user => user._id !== id));
                }
                // Update the vehicle list after deletion
                
                else {
                  // Show error message from server response
                  toast.error(data.error, {
                    position: "bottom-right",
                    theme: "light",
                  });
                }
              }
                
            catch (error) {
                console.error('Error deleting admin:', error);
            }
        }
  };

  useEffect(() => {
    fetchAvailableAdmins()
  }, [])
  

  return (
    <>
    
        <div className="mt-3 container">
        <ToastContainer />
          <h2
            className="col-sm mt-3 d-flex justify-content-center align-items-center"
            style={{ color: "#985ace" }}
          >
            View Admin Accounts
          </h2>
          <div className="table-responsive">
                <table className="table">
                    <thead>
                        <tr>
                            <th>Full Name</th>
                            <th>Email Address</th>
                            <th>Phone Number</th>
                            <th>Creation Date</th>
                            
                        </tr>
                    </thead>
                    <tbody>
                        {
                        (users.length > 0) ? 
                          users.map(user => (
                            <tr key={user._id}>
                                <td>{user.fullName}</td>
                                <td>{user.emailAddress}</td>
                                <td>{user.phoneNumber}</td>
                                <td>{new Date(user.creationDate).toLocaleDateString()}</td>

                                <td>
                                <button 
                                    className="btn btn-danger mr-2"
                                    onClick={() => handleDeleteAdmin(user._id)}
                                >
                                    Delete
                                </button>
                            
                                <span style={{marginLeft:"10px"}} ></span>
                                <button 
                                    className="btn btn-primary ml-5"
                                    
                                    onClick={() => openUpdateModal(user)}
                                >
                                    Update
                                </button>
                            </td>
                            </tr>
                        ))
                      :
                      <p>No Admin Available</p>
                      }
                        
                        
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
                            <Form.Label style={{marginTop: "10px"}}>Full Name</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={currentUser.fullName}
                                onChange={(e) => setCurrentUser({...currentUser, fullName: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{marginTop: "10px"}}>Email Address</Form.Label>
                            <Form.Control 
                                type="text" 
                                value={currentUser.emailAddress}
                                onChange={(e) => setCurrentUser({...currentUser, emailAddress: e.target.value})}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label style={{marginTop: "10px"}} >Phone Number: </Form.Label>
                            <Form.Control 
                                type="text" 
                                value={currentUser.phoneNumber}
                                onChange={(e) => setCurrentUser({...currentUser, phoneNumber: e.target.value})}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" style={{marginTop: "10px"}}>
                            Update
                        </Button>
                        
                    </Form>
                </Modal.Body>
            </Modal>
        </div>

     
    </>
  );
};

export default AdminManageUsers;
