const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticateUser")
const authController = require("../controller/authController");
const adminController = require("../controller/manageAdminController")
const organizationController = require("../controller/organizationController");

router.post("/add_admin",authenticate,adminController.addAdmin);
router.get("/isLoggedIn", authenticate, authController.isLoggedIn)

// Login API route
router.post("/superAdminLogin",authController.login);

router.get('/logout',authenticate, authController.logout);

router.get("/fetchAdmins",authenticate, adminController.fetchAdmin);

router.put("/update_admin/:currentUserID",authenticate, adminController.updateAdmin)

router.delete("/delete_admin/:currentAdminID", authenticate, adminController.deleteAdmin)

router.get("/fetch_organization", authenticate, organizationController.fetchOrganizations)

router.post("/add_organization", authenticate, organizationController.addOrganization)

router.delete("/delete_organization/:currentOrganizationID", authenticate, organizationController.deleteOrganization)

router.get("/dashboard_data", authenticate, authController.dashboardData)

module.exports = router;