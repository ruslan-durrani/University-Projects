const User = require("../model/userModel");
const Vehicle = require("../model/vehicleSchema")
const ParkingLog = require("../model/parkingLogModel")


const fetch_vehicles = async (req, res) => {
    try {
        // Assuming 'organization' is provided in the request (e.g., req.body.organization)
        const organization = req.rootUser.organization;

        // Step 1: Find user IDs belonging to the organization
        const usersInOrganization = await User.find({ organization: organization }).select('_id');
        const userIds = usersInOrganization.map(user => user._id);
        console.log(userIds)

        // Step 2: Find vehicles registered by these users
        const vehicles = await Vehicle.find({ registeredBy: { $in: userIds } }).populate('registeredBy', 'fullName');

        res.json(vehicles);
    } catch (error) {
        console.error("Error fetching vehicles by organization:", error);
        res.status(500).json({ error: "An error occurred while fetching vehicles." });
    }
};

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

function formatTime(date) {
    // Ensure the input is a Date object
    if (!(date instanceof Date)) {
        throw new Error('Input must be a Date object');
    }

    let hours = date.getHours().toString();
    let minutes = date.getMinutes().toString();
    let seconds = date.getSeconds().toString();

    // Pad single digit minutes and seconds with a leading zero
    hours = hours.padStart(2, '0');
    minutes = minutes.padStart(2, '0');
    seconds = seconds.padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}

const park_vehicle = async (req, res) => {
    try {
        
        const vehicleId = req.params.vehicleId;
        console.log(vehicleId);
        const vehicle = await Vehicle.findById(vehicleId);
        const userId = vehicle.registeredBy;
        if (!vehicle) {
            return res.status(404).send('Vehicle not found');
        }

        vehicle.isParked = true;
        await vehicle.save();

        const newParkingLog = new ParkingLog({
            startTime: formatTime(new Date()), // Set current time as start time
            startDate: formatDate(new Date()), // Set current date as start date
            userId: userId,
            vehicleId: vehicleId
        });

        await newParkingLog.save();

        res.status(200).send('Vehicle parked successfully');
    } catch (error) {
        res.status(500).send('Error parking the vehicle: ' + error.message);
    }
};


const unpark_vehicle = async (req, res) => {
    try {
        const vehicleId = req.params.vehicleId;

        const vehicle = await Vehicle.findById(vehicleId);
        if (!vehicle) {
            return res.status(404).send('Vehicle not found');
        }

        vehicle.isParked = false;
        await vehicle.save();

        const parkingLog = await ParkingLog.findOne({ vehicleId: vehicleId, endTime: null });
        if (!parkingLog) {
            return res.status(404).send('Parking log not found');
        }

        parkingLog.endTime = formatTime(new Date()); // Set current time as end time
        parkingLog.endDate = formatDate(new Date()); // Set current date as end date

        await parkingLog.save();

        res.status(200).send('Vehicle unparked successfully');
    } catch (error) {
        res.status(500).send('Error unparking the vehicle: ' + error.message);
    }
};




module.exports = {
    fetch_vehicles,
    park_vehicle,
    unpark_vehicle,
}
