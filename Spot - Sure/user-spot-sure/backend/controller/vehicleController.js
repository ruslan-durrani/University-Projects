const User = require("../model/userModel");
const bcrypt = require("bcryptjs")
const Vehicle = require("../model/vehicleSchema")
const ParkingLog = require("../model/parkingLogModel")

const addVehicle = async (req, res) => {
    try {

        const { vinNumber, vehicleType } = req.body;
        console.log(req.body)

        const registeredBy = req.userID;
        console.log(req.userID)
        // Check if vehicle with the same VIN number already exists
        const existingVehicle = await Vehicle.findOne({ vinNumber });
        if (existingVehicle) {
            return res.status(400).send({ error: 'Vehicle with this VIN number already exists.' });
        }

        // Check for vehicle type constraints for the specific user
        if (vehicleType === 'Car' || vehicleType === 'Bike') {
            const existingTypeCount = await Vehicle.countDocuments({
                vehicleType,
                registeredBy
            });
            if (existingTypeCount >= 1) {
                return res.status(400).send({ error: `You can only add one ${vehicleType}.` });
            }
        }

        // Create and save the new vehicle
        const newVehicle = new Vehicle({ ...req.body, registeredBy });
        await newVehicle.save();
        res.send({ success: 'Vehicle added successfully' });
    } catch (error) {
        console.log(error)
        res.status(500).send({ error: 'An error occurred while adding the vehicle.' });
    }
};

// Update Vehicle Controller
const updateVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params; // Assuming vehicle ID is passed as a URL parameter
        console.log(`Vehicle id ${vehicleId}`)
        const updates = req.body;
        console.log(req.body)
        const registeredBy = req.userID;
        console.log(`id ${registeredBy}`)
        // Assuming user ID is stored in req.user.id

        // Find the vehicle by ID and registeredBy to ensure the user is authorized to update it
        const vehicle = await Vehicle.findOne({ _id: vehicleId, registeredBy });
        if (!vehicle) {
            return res.status(404).send({ error: 'Vehicle not found or unauthorized access.' });
        }

        // Define the allowed fields for update
        const allowedUpdates = ['name', 'make', 'model'];
        const actualUpdates = {};
        let isValidUpdate = true;

        // Check for empty fields and if the update is different
        for (const field of allowedUpdates) {
            if (updates[field] !== undefined) {
                if (updates[field] === '' || updates[field] === null) {
                    res.status(400).send({ error: `${field} cannot be empty.` });
                    isValidUpdate = false;
                    break;
                }
                if (vehicle[field] !== updates[field]) {
                    actualUpdates[field] = updates[field];
                }
            }
        }

        if (!isValidUpdate) return;
        if (Object.keys(actualUpdates).length === 0) {
            return res.status(400).send({ error: 'No new information provided for update.' });
        }

        // Apply the updates
        for (const [key, value] of Object.entries(actualUpdates)) {
            vehicle[key] = value;
        }

        await vehicle.save();
        res.send({ success: 'Vehicle updated successfully', vehicle });
    } catch (error) {
        res.status(500).send({ error: error.message || 'An error occurred while updating the vehicle.' });
    }
};


const deleteVehicle = async (req, res) => {
    try {
        const { vehicleId } = req.params; // Assuming vehicle ID is passed as a URL parameter
        const registeredBy = req.userID; // Assuming user ID is stored in req.user.id

        // Find the vehicle by ID and registeredBy to ensure the user is authorized to delete it
        const vehicle = await Vehicle.findOneAndDelete({ _id: vehicleId, registeredBy });
        if (!vehicle) {
            return res.status(404).send({ error: 'Vehicle not found or unauthorized access.' });
        }

        res.send({ success: 'Vehicle deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while deleting the vehicle.' });
    }
};

const getVehicles = async (req, res) => {
    try {
        const userId = req.userID; // Assuming the user ID is stored in req.user.id

        // Fetch vehicles from the database that are registered by the current user
        const vehicles = await Vehicle.find({ registeredBy: userId });
        res.json(vehicles);
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while fetching vehicles.' });
    }
}

function formatDate(date) {
    // Ensure the input is a Date object
    if (!(date instanceof Date)) {
        throw new Error('Input must be a Date object');
    }

    let day = date.getDate().toString();
    let month = (date.getMonth() + 1).toString(); // getMonth() returns 0-11
    let year = date.getFullYear().toString();

    // Pad single digit day and month with a leading zero
    day = day.padStart(2, '0');
    month = month.padStart(2, '0');

    return `${year}-${month}-${day}`;
}

const generateReport = async (req, res) => {
    try {

        const {startDate, endDate} = req.body;
        
        const logs = await ParkingLog.find({ 
            startDate: { $gte: startDate },
            endDate:   { $lte: endDate },
            userId: req.userID,
        })
                         .populate('userId', 'fullName')
                         .populate('vehicleId', 'name vehicleType vinNumber');

        console.log(logs)
        return res.status(200).json(logs); // This will be an array of documents that match the date range, with populated user and vehicle information
    } catch (error) {
        console.error('Error retrieving data:', error);
        throw res.json(error); // You may want to handle this more gracefully in a real app
    }
};



module.exports = {
    addVehicle,
    updateVehicle,
    deleteVehicle,
    getVehicles,
    generateReport
}