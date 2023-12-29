import React, { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import {UserContext} from "../App"
import { useNavigate } from "react-router-dom";


function ApproveUsers() {
    const [users, setUsers] = useState([]);

    const { state, dispatch } = useContext(UserContext);
    const navigate = useNavigate("");

    useEffect(() => {
        if(!state) {
        navigate("/")
        }
    }, [state])
    
    const fetchAvailableUsers = async () => {
        try {
          const response = await axios.get('http://localhost:4001/admin/fetch_unapproved_users', {
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

    useEffect(() => {
        fetchAvailableUsers();
    }, []);


    const handleApproveUser = async (userId) => {
        // Confirmation prompt
        const isConfirmed = window.confirm('Are you sure you want to approve this user?');
    
        if (isConfirmed) {
            try {
                console.log("user id is", userId);
                const response = await axios.put(`http://localhost:4001/admin/user_app/${userId}`, {},{
                   withCredentials: true,
                });
                if (response.status === 200) {
                    fetchAvailableUsers();

                }

            } catch (error) {
                alert('Error approving the user');
                console.error('Error approving the user:', error);
            }
        }
    };

    const handleDisapproveUser = async (userId) => {
        const isConfirmed = window.confirm('Are you sure you want to disapprove and delete this user?');
    
        if (isConfirmed) {
            try {
                const response = await axios.delete(`http://localhost:4001/admin/disapprove_user/${userId}`, {
                    withCredentials: true,
                });
                if (response.status === 200) {
                    fetchAvailableUsers()
                }
            } catch (error) {
                alert('Error disapproving the user');
                console.error('Error disapproving the user:', error);
            }
        }
    };
    

    return (
        <>
            <div className="mt-3 container">
                <ToastContainer />
                <h2 className="col-sm mt-3 d-flex justify-content-center align-items-center" style={{ color: "#985ace" }}>
                    Approve User Accounts
                </h2>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Full Name</th>
                                <th>Email Address</th>
                                <th>Phone Number</th>
                                <th>Creation Date</th>
                                <th>Actions</th> {/* Added a header for actions */}
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
                                                {/* Approve Button */}
                                                <button
                                                    className="btn btn-success mr-2"
                                                onClick={() => handleApproveUser(user._id)}
                                                >
                                                    <FontAwesomeIcon icon={faCheckCircle} />
                                                </button>
                                                <span style={{marginRight:"10px"}}></span>
                                                {/* Disapprove Button */}
                                                <button
                                                    className="btn btn-danger"
                                                onClick={() => handleDisapproveUser(user._id)}
                                                >
                                                    <FontAwesomeIcon icon={faTimesCircle} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                    :
                                    <tr><td colSpan="5">No User Available</td></tr>
                            }
                        </tbody>
                    </table>
                </div>
            </div>

        </>
    )
}

export default ApproveUsers