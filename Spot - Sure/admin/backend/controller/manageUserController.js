const User = require("../model/userModel");

const addUser = async (req, res) => {

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

      const typeOfUser = "User"
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


const deleteUser = async (req,res)=> {
    try {
        const { currentUserID } = req.params; 
        console.log(`is is ${currentUserID}`)// Assuming vehicle ID is passed as a URL parameter
       // Assuming user ID is stored in req.user.id

        // Find the vehicle by ID and registeredBy to ensure the user is authorized to delete it
        const admin = await User.findOneAndDelete({ _id: currentUserID });
        if (!admin) {
            return res.status(404).send({ error: 'User not found or unauthorized access.' });
        }

        res.send({ success: 'User deleted successfully' });
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while deleting the vehicle.' });
    }
};

const fetchUsers = async (req, res) => {
    try {
      // Assuming you have a model named User that uses the userSchema
      const user = await User.find({ typeOfUser: "User", organization: req.rootUser.organization });
  
      // Check if an admin user was found
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      // Successfully found the admin, send the admin data as a response
      res.json(user);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "An error occurred while fetching the user." });
    }
  };

  const fetchNewUsers = async (req, res) => {
    try {
      // Assuming you have a model named User that uses the userSchema
      const user = await User.find({ typeOfUser: "User", organization: req.rootUser.organization, 
      isApproved: false });
  
      // Check if an admin user was found
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
  
      // Successfully found the admin, send the admin data as a response
      res.json(user);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "An error occurred while fetching the user." });
    }
  };

const approve_user = async (req,res)=> {
  try {
        const user = await User.findById(req.params.userId)
        console.log(req.params.userId)
        if (!user) {
          return res.status(404).send('User not found');
      }

      // Update the user's status to 'approved'
      user.isApproved = true; // Adjust this line according to your User model's structure
      await user.save();

      res.status(200).send('User approved successfully');
    } catch (error) {
      res.status(500).send('Error approving the user: ' + error.message);
    }
  }

  const disapprove_user = async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        // Delete the user
        await User.findByIdAndDelete(userId);

        res.status(200).send('User disapproved and deleted successfully');
    } catch (error) {
        res.status(500).send('Error disapproving the user: ' + error.message);
    }
};


  


module.exports = {
    deleteUser,
    addUser,
    fetchUsers,
    fetchNewUsers,
    approve_user,
    disapprove_user
}