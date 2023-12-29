const User = require("../model/userModel");

const addAdmin = async (req, res) => {

    console.log(req.body)
    try {
      // Get the user data from the request body
      const { fullName, emailAddress, phoneNumber, organization ,password} = req.body;
  
      // Check if user fill all the fields or not
      if (!fullName || !emailAddress || !phoneNumber || !password || !organization) {
        return res.status(422).json({ error: "Please fill the fields properly" });
      }
  
      // Check if user already exists or not
      const userExist = await User.findOne({ emailAddress: emailAddress.trim() });
      if (userExist) {
        return res.status(422).json({ error: "Email already exist" });
      }

      const typeOfUser = "Admin"
      const newAdmin = new User({
        fullName,
        emailAddress,
        phoneNumber,
        organization,
        typeOfUser,
        isApproved: true,
        password,
      });
  
      // Save the new user to the database
      await newAdmin.save();
  
      // Send a response
      res.json({ success: "Sign up successful!" });
    } catch (error) {
      console.error("Error signing up:", error);
      res.status(500).json({ error: "An error occurred while signing up." });
    }
  }

const updateAdmin = async (req, res) => {
    try {
        const { currentUserID } = req.params; // Assuming vehicle ID is passed as a URL parameter
        // console.log(`Vehicle id ${currentUserID}`)
        const updates = req.body;
        console.log(req.body)

       
         // Assuming user ID is stored in req.user.id

        // Find the vehicle by ID and registeredBy to ensure the user is authorized to update it
        const user = await User.findOne({ _id: currentUserID });
        if (!user) {
            return res.send({ error: 'User not found or unauthorized access.' });
        }

        // Define the allowed fields for update
        const allowedUpdates = ['fullName', 'emailAddress', 'phoneNumber'];
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
                if (user[field] !== updates[field]) {
                    actualUpdates[field] = updates[field];
                }
            }
        }

        if (!isValidUpdate) return;
        if (Object.keys(actualUpdates).length === 0) {
            return res.send({ error: 'No new information provided for update.' });
        }

        // Apply the updates
        for (const [key, value] of Object.entries(actualUpdates)) {
            user[key] = value;
        }

        await user.save();
        res.send({ success: 'Admin updated successfully', user });
    } catch (error) {
        res.status(500).send({ error: error.message || 'An error occurred while updating the Admin.' });
    }
};

const deleteAdmin = async (req,res)=> {
    try {
        const { currentAdminID } = req.params; 
        console.log(`is is ${currentAdminID}`)// Assuming vehicle ID is passed as a URL parameter
       // Assuming user ID is stored in req.user.id

        // Find the vehicle by ID and registeredBy to ensure the user is authorized to delete it
        const admin = await User.findOneAndDelete({ _id: currentAdminID });
        if (!admin) {
            return res.status(404).send({ error: 'Admin not found or unauthorized access.' });
        }

        res.send({ success: 'Admin deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while deleting the vehicle.' });
    }
};

const fetchAdmin = async (req, res) => {
    try {
      // Assuming you have a model named User that uses the userSchema
      const admin = await User.find({ typeOfUser: "Admin" });
  
      // Check if an admin user was found
      if (!admin) {
        return res.status(404).json({ error: "Admin not found." });
      }
  
      // Successfully found the admin, send the admin data as a response
      res.json(admin);
    } catch (error) {
      // Log and send the error
      console.error("Error fetching admin:", error);
      res.status(500).json({ error: "An error occurred while fetching the admin." });
    }
  };


module.exports = {
    updateAdmin,
    deleteAdmin,
    addAdmin,
    fetchAdmin
}