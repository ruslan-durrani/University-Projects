import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { Modal, Button, Form, Container, Row, Col, Card } from 'react-bootstrap';
import { UserContext } from '../App';
import { useNavigate } from 'react-router-dom';


const UserProfile = () => {
    const [userProfile, setUserProfile] = useState({});
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);

    const { state, dispatch } = useContext(UserContext);

    useEffect(() => {
    if(!state) {
        navigate("/Login")
    }

    }, [state])

    // Fetch user profile data
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axios.get('http://localhost:6001/user/view_profile', {
                    withCredentials: true
                });
                setUserProfile(response.data);
            } catch (error) {
                
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, []);

    // Handlers for modals
    const handleUpdateModal = () => setShowUpdateModal(!showUpdateModal);
    const handlePasswordModal = () => setShowPasswordModal(!showPasswordModal);

    // Handlers for form submissions
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const updatedProfile = {
            fullName: formData.get('name'),
            phoneNumber: formData.get('phoneNumber'),
            creationDate: new Date(userProfile.creationDate).toLocaleDateString(),
            emailAddress: userProfile.emailAddress
        };
        console.log(updatedProfile);
    
        try {
            // Replace with your API endpoint and adjust as necessary
            const response = await axios.put('http://localhost:6001/user/update_profile', updatedProfile, {
                withCredentials: true
            });

            const data = await response.data;

            if(response.status === 200) {
                toast.success("Profile Update Succeesful", {
                    position: "bottom-right",
                    theme: "light",
                  });
                
                setUserProfile(updatedProfile);
                handleUpdateModal();
            }else {
                toast.error(data.error || 'An error occurred during login.', {
                    position: "bottom-right",
                    theme: "light",
                  });
              }
            // Assuming the API returns the updated profile
            
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error Updating Profile', {
                position: "bottom-right",
                theme: "light",
              });
        
            // Handle errors (e.g., show a message to the user)
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const passwordData = {
            currentPassword: formData.get('cPassword'),
            newPassword: formData.get('newPassword'),
        };

        try {
            // Replace with your API endpoint and adjust as necessary
            const response = await axios.put('http://localhost:6001/user/change_password', passwordData, {
                withCredentials : true
            });
            const data = await response.data;

            if(response.status === 200) {
                toast.success("Password Change Succcessful", {
                    position: "bottom-right",
                    theme: "light",
                  });
                
                handlePasswordModal();
            }else {
                toast.error(data.error || 'An error occurred during changing password.', {
                    position: "bottom-right",
                    theme: "light",
                  });
              }
            // Assuming the API returns the updated profile
            
        } catch (error) {
            toast.error(error.response?.data?.error || 'Error Changing password', {
                position: "bottom-right",
                theme: "light",
              });
        }
    };

    return (
        <div>
            <ToastContainer />
            <Container>
            <Card className="mt-5">
                <Card.Body>
                    <Card.Title className="mb-4">User Profile</Card.Title>
                    <Row>
                        <Col><strong>Full Name:</strong> {userProfile.fullName}</Col>
                    </Row>
                    <Row>
                        <Col><strong>Email Address:</strong> {userProfile.emailAddress}</Col>
                    </Row>
                    <Row>
                        <Col><strong>Phone Number:</strong> {userProfile.phoneNumber}</Col>
                    </Row>
                    <Row>
                        <Col><strong>Account Created:</strong> {new Date(userProfile.creationDate).toLocaleDateString()}</Col>
                    </Row>
                    <Row className="mt-4">
                        <Col>
                            <Button variant="primary" onClick={handleUpdateModal}>Update Profile</Button>
                        </Col>
                        <Col>
                            <Button variant="secondary" onClick={handlePasswordModal}>Change Password</Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Update Profile Modal */}
            <Modal show={showUpdateModal} onHide={handleUpdateModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleUpdateProfile}>
                        <Form.Group className="mb-3">
                            <Form.Label>Full Name</Form.Label>
                            <Form.Control type="text" name='name' placeholder="Enter full name" defaultValue={userProfile.fullName} />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="tel" name='phoneNumber' placeholder="Enter phone number" defaultValue={userProfile.phoneNumber} />
                        </Form.Group>
                        <Button variant="primary" type="submit">Update</Button>
                    </Form>
                </Modal.Body>
            </Modal>

            {/* Change Password Modal */}
            <Modal show={showPasswordModal} onHide={handlePasswordModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleChangePassword}>
                        <Form.Group className="mb-3">
                            <Form.Label>Current Password</Form.Label>
                            <Form.Control name="cPassword" type="password" placeholder="Enter current password" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>New Password</Form.Label>
                            <Form.Control type="password" name='newPassword' placeholder="Enter new password" />
                        </Form.Group>
                        <Button variant="primary" type="submit">Change Password</Button>
                    </Form>
                </Modal.Body>
            </Modal>
            </Container>
        </div>
    );
};

export default UserProfile;