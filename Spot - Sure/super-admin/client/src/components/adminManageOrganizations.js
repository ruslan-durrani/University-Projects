import React, { useState, useEffect, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from 'axios'
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

const AdminManageOrganizations = () => {
  const [organizationList, setOrganizationList] = useState([]);
  const [organization, setOrganization] = useState({
    name: "",
    location: "",
  });
  const [activeSection, setActiveSection] = useState("");

  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate("");

  useEffect(() => {
    if(!state) {
      navigate("/")
    }
  }, [state])
  

  const handleInputs = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setOrganization({ ...organization, [name]: value });
  };

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

  const PostData = async (e) => {

    try {
    e.preventDefault();

    console.log(organization);

    const res = await axios.post('http://localhost:5001/super_admin/add_organization', {
            name: organization.name,
            location: organization.location
        }, {
            withCredentials: true
        });

  const data = await res.data;
    
    // Logic after the request
    // Example:
//  Assuming the server responds with JSON
    if (res.status === 200) {
      toast.success(data.success || "Organization Added Successfully", {
        position: "bottom-right",
        theme: "light",
      });

      setOrganization({name: "", location: "" });
      // Navigate to the login page
 
    } else if(res.status === 403) {
      // Show error message from server response
      toast.error("Organization Exists Already!", {
        position: "bottom-right",
        theme: "light",
      });
    }
    else {
      // Show error message from server response
      toast.error(data.message, {
        position: "bottom-right",
        theme: "light",
      });
    }
  } catch (error) {
    // Show error message if the request failed
    toast.error("Something went wrong, please try again.");
  }
};

const handleDeleteOrganization = async (id) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this Admin?");
    
      if (isConfirmed) {
          try {
              console.log(id)

              const res = await axios.delete(`http://localhost:5001/super_admin/delete_organization/${id}`, {
                  withCredentials: true
              });

              const data = await res.data;

              if (res.status === 200) {
                toast.success(data.success, {
                  position: "bottom-right",
                  theme: "light",
                });
                setOrganizationList(organizationList.filter(org => org._id !== id));
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
              console.error('Error deleting organization:', error);
          }
      }
};

  const showSection = (sectionName) => {
    setActiveSection(sectionName);
    if(sectionName == "view"){fetchOrganizations();}

  };
  const goBack = () => {
    setActiveSection(null);
  };
  return (
    <>
      <div className="tut-heading">Manage Organizations</div>
      <div className="col-sm d-flex justify-content-center">
        <div className="d-flex flex-wrap gap-3">
          {activeSection ? (
            <button className="form-submit fw-bold" onClick={goBack}>
            Back
          </button>
          ) : (
            <>
              <button
                className="form-submit fw-bold"
                onClick={() => showSection("view")}
              >
                View Organizations
              </button>
              <button
                className="form-submit fw-bold"
                onClick={() => showSection("add")}
              >
                Add Organization
              </button>
            </>
          )}
        </div>
        {
            (activeSection==="add")&&(
              <div
              className="container d-flex justify-content-center adminLoginTopContainer"
              style={{ backgroundColor: "#181e1e", width: "auto" }}
            >
              <form
                method="POST"
                className="register-form"
                id="register-form"
                // onSubmit={handleAdminLogin}
              >
                <label  className="text-white mb-2">
                  Organization Name
                </label>
                <br />
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="off"
                  required
                  placeholder="Enter Name: "
                  className="p-2 input-group"
                  value={organization.name}
                  onChange={handleInputs}
                  // onChange={(e) => setAdminEmail(e.target.value)}
                />
                <br />
                <label htmlFor="location" className="text-white mb-2">
                  Organization Location
                </label>
                <br />
                <input
                  type="text"
                  name="location"
                  id="location"
                  autoComplete="off"
                  required
                  placeholder="Enter Location"
                  className="p-2 input-group"
                  value={organization.location}
                  onChange={handleInputs}
                  // onChange={(e) => setAdminPassword(e.target.value)}
                />
                <br />
                <input
                  type="submit"
                  name="registerOrganization"
                  id="registerOrganization"
                  className="form-submit fw-bold"
                  value="Register Organization"
                  style={{
                    display: "block",
                    width: "50vh",
                    marginBottom: "10px",
                  }}
                  onClick={PostData}
                />
              </form>
            </div>
                
            )
        }
        {activeSection === "view" && (
        <div className="mt-3 container">
          <h2
            className="col-sm mt-3 d-flex justify-content-center align-items-center"
            style={{ color: "#985ace" }}
          >
            View Organizations Accounts
          </h2>
          <div className="users-list table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Location</th>
                  <th>Modify</th>
                  
                </tr>
              </thead>
              <tbody>
                {organizationList.map((org) => (
                  <tr
                    key={org._id}
                    className=""
                    onClick={() => {}}
                  >
                    <td>{org.name}</td>
                    <td>{org.location}</td>
                    <td>
                                <button 
                                    className="btn btn-danger mr-2"
                                    onClick={() => handleDeleteOrganization(org._id)}
                                >
                                    Delete
                                </button>
                                
                            </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        
        </div>
      )}
      </div>
      <ToastContainer/>
      
    </>
  );
};

export default AdminManageOrganizations;
