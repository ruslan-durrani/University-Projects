import React, { useState, useContext } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {UserContext} from "../App"
import { useNavigate } from "react-router-dom";

const AdminEdit = () => {
  const [name, setName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate("");

  useEffect(() => {
    if(!state) {
      navigate("/")
    }
  }, [state])

  const saveChanges = async () => {
    try {
      const data = {
        name: name,
        oldPassword: oldPassword,
        newPassword: newPassword,
        confirmPassword: confirmPassword,
      };

      const response = await fetch("/user/adminEditProfile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success(responseData.message, {
          position: "bottom-right",
          theme: "light",
        });
      } else {
        toast.error(responseData.error || "Failed to update profile.", {
          position: "bottom-right",
          theme: "light",
        });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred while updating profile.", {
        position: "bottom-right",
        theme: "light",
      });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-center">
        <div className="col-sm-8 mt-5">
          <div className="container">
            <form>
              <h2 className="edit d-flex justify-content-center">
                Admin Edit Profile
              </h2>

              <div className="form-group row mt-5 d-flex justify-content-center">
                <label className="col-sm-2 col-form-label">Admin Name</label>
                <div className="col-sm-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group row mt-3 d-flex justify-content-center">
                <label className="col-sm-2 col-form-label">Old password</label>
                <div className="col-sm-5">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Enter old password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group row mt-3 d-flex justify-content-center">
                <label className="col-sm-2 col-form-label">New password</label>
                <div className="col-sm-5">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group row mt-3 d-flex justify-content-center">
                <label className="col-sm-2 col-form-label">
                  Confirm password
                </label>
                <div className="col-sm-5 mt-2">
                  <input
                    className="form-control"
                    type="password"
                    placeholder="Re-enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group d-flex justify-content-center mt-4">
                <button
                  type="button"
                  className="form-save mt-3 fw-bold"
                  onClick={saveChanges}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default AdminEdit;
