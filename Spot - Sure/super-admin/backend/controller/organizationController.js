const Organization = require("../model/organizationModel")

const fetchOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.status(200).json(organizations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const addOrganization = async (req, res) => {
    // Check if the organization already exists
    console.log(`user is ${req.body.name}`);
    const existingOrganization = await Organization.findOne({ name: req.body.name });
    console.log("he was here")
    if (existingOrganization) {
        return res.status(403).json({ message: 'Organization already exists' });
    }

    // Create a new organization since it doesn't exist
    const newOrganization = new Organization({
        name: req.body.name,
        location: req.body.location,
        // creationDate is set by default to Date.now()
    });

    try {
        // Save the new organization to the database
        await newOrganization.save();
        res.status(200).json({success: "Organization Added Succesfully"});
    } catch (error) {
        // If there's an error, send a 500 status code and the error message
        res.status(500).json({ message: error.message });
    }
};

const deleteOrganization = async (req,res)=> {
    try {
        const { currentOrganizationID } = req.params; 
        console.log(`is is ${currentOrganizationID}`)// Assuming vehicle ID is passed as a URL parameter
       // Assuming user ID is stored in req.user.id

        // Find the vehicle by ID and registeredBy to ensure the user is authorized to delete it
        const organization = await Organization.findOneAndDelete({ _id: currentOrganizationID });
        if (!organization) {
            return res.status(404).send({ error: 'Admin not found or unauthorized access.' });
        }

        res.send({ success: 'Organization deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while deleting the Organization.' });
    }
};

module.exports = {
    fetchOrganizations,
    addOrganization,
    deleteOrganization
}