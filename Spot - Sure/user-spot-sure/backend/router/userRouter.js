const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/authenticateUser.js");

const authController = require("../controller/authController");
const vehicleController = require("../controller/vehicleController.js")
const organizationController = require("../controller/organizationController.js")

router.post("/signup",authController.signUp);


// Login API route
router.post("/login",authController.login);

router.post("/add_vehicle",authenticate ,vehicleController.addVehicle)

router.put('/update_vehicle/:vehicleId',authenticate ,vehicleController.updateVehicle);

router.delete('/delete_vehicle/:vehicleId',authenticate, vehicleController.deleteVehicle);

router.get('/logout',authenticate, authController.logout);

router.get('/get_vehicles', authenticate,vehicleController.getVehicles);

router.put("/update_profile", authenticate, authController.updateProfile)

router.put("/change_password", authenticate, authController.changePassword)

router.get("/isLoggedIn", authenticate, authController.isLoggedIn)

router.get("/view_profile", authenticate, authController.viewProfile)

router.post("/generate_report",authenticate,vehicleController.generateReport)

router.get("/fetch_organization", organizationController.fetchOrganizations);

module.exports = router;