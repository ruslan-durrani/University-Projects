import React, { useState, useEffect, useContext} from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [activeSection, setActiveSection] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [editingUser, setEditingUser] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [updatedEmail, setUpdatedEmail] = useState("");
  const [updatedPhone, setUpdatedPhone] = useState("");

  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate("");

  useEffect(() => {
    if(!state) {
      navigate("/")
    }
  }, [state])

  const showSection = (sectionName) => {
    setActiveSection(sectionName);
    setSelectedUser(null); // Reset selected user when switching sections
  };

  const goBack = () => {
    setActiveSection(null);
    setSelectedUser(null);
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/user/viewUsers"); // Update this endpoint based on your API
      if (response.ok) {
        const fetchedUsers = await response.json();
        setUsers(fetchedUsers);
      } else {
        console.error("Failed to fetch users");
        toast.error("Failed to fetch users", {
          position: "bottom-right",
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("An error occurred while fetching users", {
        position: "bottom-right",
        theme: "light",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Fetch users when the component mounts

  const handleUpdateUser = async (user) => {
    const updatedUser = {
      newName: updatedName,
      email: updatedEmail,
      phone: updatedPhone,
    };

    try {
      const response = await fetch(`/user/updateUser/${user.name}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedUser),
      });

      if (response.ok) {
        const responseData = await response.json();
        const updatedUser = responseData.updatedUser;
        const updatedUsers = users.map((u) =>
          u._id === updatedUser._id ? updatedUser : u
        );
        setUsers(updatedUsers);
        setSelectedUser(null);
        setEditingUser(null);
        toast.success("User updated successfully", {
          position: "bottom-right",
          theme: "light",
        });
      } else {
        console.error("Failed to update user");
        toast.error("Failed to update user", {
          position: "bottom-right",
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("An error occurred while updating user", {
        position: "bottom-right",
        theme: "light",
      });
    }
  };

  const handleDeleteUser = async (user) => {
    try {
      const response = await fetch(`/user/deleteUser/${user.name}`, {
        method: "DELETE",
      });

      if (response.ok) {
        const responseData = await response.json();
        const deletedUser = responseData.deletedUser;
        const updatedUsers = users.filter((u) => u.name !== deletedUser.name);
        setUsers(updatedUsers);
        setSelectedUser(null);
        toast.success("User deleted successfully", {
          position: "bottom-right",
          theme: "light",
        });
      } else {
        console.error("Failed to delete user");
        toast.error("Failed to delete user", {
          position: "bottom-right",
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("An error occurred while deleting user", {
        position: "bottom-right",
        theme: "light",
      });
    }
  };

  const ITEMS_PER_PAGE = 10; // Number of items per page

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const indexOfLastUser = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstUser = indexOfLastUser - ITEMS_PER_PAGE;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <>
      <h1 className="tut-heading">Manage User Accounts</h1>
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
                View User Account
              </button>
              <button
                className="form-submit fw-bold"
                onClick={() => showSection("update")}
              >
                Update User Account
              </button>
              <button
                className="form-submit fw-bold"
                onClick={() => showSection("delete")}
              >
                Delete User Account
              </button>
            </>
          )}
        </div>
      </div>

      {activeSection === "view" && (
        <div className="mt-3 container">
          <h2
            className="col-sm mt-3 d-flex justify-content-center align-items-center"
            style={{ color: "#985ace" }}
          >
            View User Accounts
          </h2>
          <div className="users-list table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className={`user-item ${
                      selectedUser === user ? "selected" : ""
                    }`}
                    onClick={() => setSelectedUser(user)}
                  >
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination justify-content-center mt-3">
            {Array.from({
              length: Math.ceil(users.length / ITEMS_PER_PAGE),
            }).map((_, index) => (
              <button
                key={index}
                className={`pagination-button btn ${
                  currentPage === index + 1 ? "btn-danger" : "btn-light"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeSection === "update" && (
        <div className="mt-3 container">
          <h2
            className="col-sm mt-3 d-flex justify-content-center align-items-center"
            style={{ color: "#985ace" }}
          >
            Update User Accounts
          </h2>
          <div className="users-list table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className={`user-item ${
                      selectedUser === user ? "selected" : ""
                    }`}
                  >
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td className="d-flex justify-content-center">
                      <button
                        className="btn btn-warning"
                        onClick={() => {
                          setEditingUser(user); // Set user for editing
                          setUpdatedName(user.name); // Initialize form data
                          setUpdatedEmail(user.email);
                          setUpdatedPhone(user.phone);
                        }}
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {editingUser && (
            <form
              className="container col-sm-4 form-group text-center"
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateUser(editingUser); // Pass the editingUser to the function
              }}
            >
              <label htmlFor="updatedName">Enter Name</label>
              <input
                type="text"
                id="updatedName"
                value={updatedName}
                onChange={(e) => {
                  console.log("Name input:", e.target.value);
                  setUpdatedName(e.target.value);
                }}
                className="form-control mb-3"
              />
              <label htmlFor="updatedEmail">Enter Email</label>
              <input
                type="email"
                id="updatedEmail"
                value={updatedEmail}
                onChange={(e) => {
                  console.log("Email input:", e.target.value);
                  setUpdatedEmail(e.target.value);
                }}
                className="form-control mb-3"
              />
              <label htmlFor="updatedPhone">Enter Phone</label>
              <input
                type="text"
                id="updatedPhone"
                value={updatedPhone}
                onChange={(e) => {
                  console.log("Phone input:", e.target.value);
                  setUpdatedPhone(e.target.value);
                }}
                className="form-control mb-3"
              />
              <button type="submit" className="form-submit fw-bold">
                Update Changes
              </button>
            </form>
          )}

          <div className="pagination justify-content-center mt-3">
            {Array.from({
              length: Math.ceil(users.length / ITEMS_PER_PAGE),
            }).map((_, index) => (
              <button
                key={index}
                className={`pagination-button btn ${
                  currentPage === index + 1 ? "btn-danger" : "btn-light"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeSection === "delete" && (
        <div className="mt-3 container">
          <h2
            className="col-sm mt-3 d-flex justify-content-center align-items-center"
            style={{ color: "#985ace" }}
          >
            Delete User Accounts
          </h2>
          <div className="users-list table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr
                    key={user._id}
                    className={`user-item ${
                      selectedUser === user ? "selected" : ""
                    }`}
                  >
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone}</td>
                    <td className="d-flex justify-content-center">
                      <button
                        className="btn btn-danger"
                        onClick={() => handleDeleteUser(user)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination justify-content-center mt-3">
            {Array.from({
              length: Math.ceil(users.length / ITEMS_PER_PAGE),
            }).map((_, index) => (
              <button
                key={index}
                className={`pagination-button btn ${
                  currentPage === index + 1 ? "btn-danger" : "btn-light"
                }`}
                onClick={() => handlePageChange(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <ToastContainer />
    </>
  );
};

export default AdminManageUsers;
