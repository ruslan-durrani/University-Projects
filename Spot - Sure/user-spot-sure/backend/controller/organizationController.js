const Organization = require("../model/organizationModel")

const fetchOrganizations = async (req, res) => {
    try {
        const organizations = await Organization.find();
        res.status(200).json(organizations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {
    fetchOrganizations,
}