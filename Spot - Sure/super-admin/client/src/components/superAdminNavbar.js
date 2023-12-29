import { Route, Routes, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import React, { useContext, useState, useEffect } from "react";
import { UserContext } from "../App";

const SuperAdminNavbar = () => {

  const { state, dispatch } = useContext(UserContext);

  const navigate = useNavigate();

  const logOut = () => {
    fetch("http://localhost:5001/super_admin/logout", {
      method: "GET",
      credentials: "include",
    })
      .then((res) => {
        dispatch({ type: "USER", payload: false });
        navigate("/");
        if (!res.status === 200) {
          const error = new Error(res.error);
          throw error;
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <>
      <nav
        className="navbar navbar-expand-lg bg-body-tertiary fixed-top"
        style={{ marginTop: "0", paddingTop: "0" }}
      >
        <div className="container-fluid" style={{ backgroundColor: "#181e1e" }}>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto p-4 mb-0 mb-lg-0">
              <li className="nav-item pe-4">
                <NavLink
                  className="nav-link active text-white"
                  aria-current="page"
                  to="/dashboard"
                >
                  Dashboard
                </NavLink>
              </li>
              <li className="nav-item pe-4">
                <NavLink className="nav-link text-white" to="/adminManageAdmins">
                  Manage Admins
                </NavLink>
              </li>

              <li className="nav-item pe-4">
                <NavLink className="nav-link text-white" to="/addAdmin">
                  Add Admin
                </NavLink>
              </li>
              <li className="nav-item pe-4">
                <NavLink className="nav-link text-white" to="/adminManageOrganizations">
                  Manage Organizations
                </NavLink>
              </li>
              <NavLink to="/adminLogin">
                <button
                onClick={logOut}
                  type="button"
                  className="btn text-center text-white fw-bold me-4 btn-login"
                  style={{ borderColor: "#985ace" }}
                >
                  Log Out
                </button>
              </NavLink>
            </ul>
          </div>

          <NavLink
            className="navbar-brand fw-bold"
            to="/adminDashboard"
            style={{ fontSize: "30px", color: "#985ace" }}
          >
            Super Admin Hub
          </NavLink>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          />
        </div>
      </nav>
      <div style={{ marginTop: "100px" }}></div>
    </>
  );
};

export default SuperAdminNavbar;
