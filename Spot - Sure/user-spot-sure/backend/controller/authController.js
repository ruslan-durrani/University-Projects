
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const emailController = require("../utils/nodemailer")

const isLoggedIn = async (req,res) => {
  if(req.userID) {
    return res.status(200).send({"isLoggedIn": true})
  }
  else {
    return res.status(404).send({"isLoggedIn": false})
  }
}

const signUp = async (req, res) => {
      
        try {
          // Get the user data from the request body
          const { fullName, emailAddress, phoneNumber, password, organization} = req.body;
          console.log(req.body)
      
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
          const newUser = new User({
            fullName,
            emailAddress,
            phoneNumber,
            typeOfUser,
            organization,
            password,
          });
      
          // Save the new user to the database
          await newUser.save();
      
          // Send a response
          await emailController.sendEmail(req.body.emailAddress);
          res.json({ message: "Sign up successful! Please Check Your Email." });
        } catch (error) {
          console.error("Error signing up:", error);
          res.status(500).json({ error: "An error occurred while signing up." });
        }
      }

const login = async (req, res) => {

        try {
          // Get the user data from the request body
          const { emailAddress, password } = req.body;
      
          if (!emailAddress || !password) {
            return res
              .status(400)
              .json({ error: "Please fill the fields properly." });
          }
      
          // Find the user in the database by their email
          const user = await User.findOne({ emailAddress: emailAddress, typeOfUser: "User" });
      
          if (user) {

            if(!user.isApproved) {
              return res.status(400).json({ error: "You're account is not approved." });
             
            }

            // Comparing password
            const isMatch = await bcrypt.compare(password, user.password);
      
            const token = await user.generateAuthToken();
      
            if (!isMatch) {
              res.status(400).json({ error: "Invalid Credentials." });
            } else {
              res.cookie("spotsure", token, {
                expires: new Date(Date.now() + 25892000000),
                httpOnly: true,
              }).header('Authorization', token);
             
              
              res.json({ message: "Login successful!" });
            }
          } else {
            res.status(400).json({ error: "Invalid Credentials." });
          }
        } catch (error) {
          console.error("Error logging in:", error);
          res.status(500).json({ error: "An error occurred while logging in." });
        }
      }

const logout =  (req, res) => {
  // Clearing the authentication cookie
  res.clearCookie('spotsure');
  res.status(200).send({ message: 'Logged out successfully' });
}

const viewProfile = async(req,res)=> {
  try {
    const userId = req.userID;
    const user = await User.findById(userId);
      if (!user) {
          return res.status(404).send({ error: 'User not found.' });
      }
      
      res.send(user);
  } catch (error) {
      res.status(500).send({ error: 'An error occurred while getting the profile.' });
  }
}

const updateProfile = async (req, res) => {
  try {
      const userId = req.userID; // User ID provided by authentication middleware
      const { fullName, phoneNumber} = req.body;

      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).send({ error: 'User not found.' });
      }

      // Check for empty fields and whether the update is different
      if (fullName === '' || phoneNumber === '') {
          return res.status(400).send({ error: 'Name and phone number cannot be empty.' });
      }

      if (user.fullName === fullName && user.phoneNumber === phoneNumber) {
          return res.status(400).send({ error: 'No new information provided for update.' });
      }

      // Update non-password fields
      user.fullName = fullName !== '' ? fullName : user.fullName;
      user.phoneNumber = phoneNumber !== '' ? phoneNumber : user.phoneNumber;

      await user.save();
      res.send({ success: 'Profile updated successfully' });
  } catch (error) {
      res.status(500).send({ error: 'An error occurred while updating the profile.' });
  }
};


const changePassword = async (req, res) => {
  try {
      const userId = req.userID; // User ID provided by authentication middleware
      const {currentPassword, newPassword } = req.body;

      // Find the user by ID
      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).send({ error: 'User not found.' });
      }

      if (!currentPassword) {
          return res.status(400).send({ error: 'Current password field is empty' });
      }

      // If password change is requested
      if (currentPassword && newPassword) {
          const isMatch = await bcrypt.compare(currentPassword, user.password);
          if (!isMatch) {
              return res.status(400).send({ error: 'Current password is incorrect.' });
          }
          ;
          user.password = newPassword;
      }

      await user.save();
      res.send({ success: 'Password updated successfully' });
  } catch (error) {
      res.status(500).send({ error: 'An error occurred while updating the Password.' });
  }
};



module.exports = {
    login,
    signUp,
    logout,
    updateProfile,
    changePassword,
    isLoggedIn,
    viewProfile
}