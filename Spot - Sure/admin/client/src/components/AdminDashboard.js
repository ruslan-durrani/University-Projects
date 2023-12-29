import React, { useState, useEffect, useContext } from "react";
import {UserContext} from "../App"
import { useNavigate } from "react-router-dom";
import axios from 'axios'

const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [approvedUsers, setApprovedUsers] = useState(0);
  const [pendingApprovalUsers, setPendingApprovalUsers] = useState(0);

  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate("");

  useEffect(() => {
    if(!state) {
      navigate("/")
    }
  }, [state])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("http://localhost:4001/admin/dashboard_data", {
        withCredentials: true,
      })

      const data = response.data;

      if (response.status == 200) {
        setTotalUsers(data.totalUsers);
        setApprovedUsers(data.approvedUsers)
        setPendingApprovalUsers(data.pendingApprovalUser)
      }

    }// totalUsers: userCount, totalAdmins: adminCount, totalOrganization: organizationCount, totalVehicles: vehicleCount 

    catch (error) {
      console.error("Error fetching user count:", error);
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  return (
    <>
      <main className="dashboard-main">
        <h1 className="tut-heading">Dashboard</h1>
        <div className="box-container row justify-content-center">
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="dashboard-box">
              <i className="fa-solid fa-users"></i>
              <div className="box-content">
                <h4>{totalUsers}</h4>
                <p>Total Users</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="dashboard-box">
              <i className="fa-solid fa-pen-to-square"></i>
              <div className="box-content">
                <h4>{approvedUsers}</h4>
                <p>Total Approved Users</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="dashboard-box">
              <i className="fa-solid fa-photo-film"></i>
              <div className="box-content">
                <h4>{pendingApprovalUsers}</h4>
                <p>Pending Approval Users</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
