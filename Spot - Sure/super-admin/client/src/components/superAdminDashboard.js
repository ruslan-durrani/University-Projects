import React, { useState, useEffect, useContext } from "react";
import axios from 'axios';
import { UserContext } from "../App";
import { useNavigate } from "react-router-dom";
const AdminDashboard = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmins, setTotalAdmins] = useState(0);
  const [totalOrganization, setTotalOrganization] = useState(0);
  const [totalVehicles, setTotalVehicles] = useState(0);

  const { state, dispatch } = useContext(UserContext);
  const navigate = useNavigate("");

  useEffect(() => {
    if(!state) {
      navigate("/")
    }
  }, [state])
  

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get("http://localhost:5001/super_admin/dashboard_data", {
        withCredentials: true,
      })

      const data = response.data;

      if (response.status == 200) {
        setTotalUsers(data.totalUsers);
        setTotalAdmins(data.totalAdmins)
        setTotalOrganization(data.totalOrganization)
        setTotalVehicles(data.totalVehicles)
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
                <h4>{totalAdmins}</h4>
                <p>Total Admins</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="dashboard-box">
              <i className="fa-solid fa-photo-film"></i>
              <div className="box-content">
                <h4>{totalOrganization}</h4>
                <p>Total Organizations</p>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6 mb-4">
            <div className="dashboard-box">
              <i className="fa-solid fa-arrows-rotate"></i>
              <div className="box-content">
                <h4>{totalVehicles}</h4>
                <p>Total Vehicles Registered</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default AdminDashboard;
