const jwt = require("jsonwebtoken");
const User = require("../model/userModel");
const { SECRET_KEY } = require("../utils/config");

const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.spotsure;
    // console.log(token)
    if (!token) {
      return res.status(401).send("Unauthorized: No token provided");
    }

    const verifyToken = jwt.verify(token, SECRET_KEY);

    const rootUser = await User.findOne({_id: verifyToken._id, "tokens.token": token});

    if(!rootUser){
        throw new Error("User not Found");
    }

    req.token = token;
    req.rootUser = rootUser;
    req.userID = rootUser._id;

    next();

  } catch (error) {
    res.status(401).send("Unauthorized: No token provided");
    console.log(error);
  }
};

module.exports =  authenticate;