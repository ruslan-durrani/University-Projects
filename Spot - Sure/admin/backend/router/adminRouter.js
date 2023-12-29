const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticateUser")
const authController = require("../controller/authController");
const userController = require("../controller/manageUserController")
const organizationController = require("../controller/organizationController");
const vehicleController = require("../controller/vehicleController")

router.post("/add_user",authenticate,userController.addUser);
router.get("/isLoggedIn", authenticate, authController.isLoggedIn)

// Login API route
router.post("/admin_login",authController.login);

router.get('/logout',authenticate, authController.logout);

router.delete("/delete_user/:currentUserID", authenticate, userController.deleteUser)

router.get("/fetch_users", authenticate, userController.fetchUsers)

router.get("/fetch_vehicles", authenticate, vehicleController.fetch_vehicles)


router.post("/park_vehicle/:vehicleId", authenticate, vehicleController.park_vehicle)
router.put("/unpark_vehicle/:vehicleId", authenticate, vehicleController.unpark_vehicle)
router.get("/fetch_unapproved_users", authenticate, userController.fetchNewUsers);

router.put("/user_app/:userId", authenticate, userController.approve_user);
router.delete("/disapprove_user/:userId", authenticate, userController.disapprove_user);

router.get("/fetch_organization",authenticate, organizationController.fetchOrganizations);
router.get("/dashboard_data", authenticate, authController.dashboardData)


module.exports = router;