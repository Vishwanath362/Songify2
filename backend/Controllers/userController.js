const secret = process.env.JWT_SECRET;
const jwt = require("jsonwebtoken");
const User = require("../Models/users");

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,

    });

    await newUser.save();
    const token = jwt.sign({ id: newUser._id, name: newUser.name }, secret, {
      expiresIn: "1h"
    });

    return res.status(200).json({
      message: "Successfully created",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};




const login = async (req, res) => {
  try {
    const { email, password } = req.body;
   
    
    const user = await User.findOne({ email });

    if (!user) {
     
      return res.status(404).json({ message: "Invalid User Credentials" });
    }

  
    const isMatch = await user.matchPassword(password);
   
    
    if (isMatch) {
      const token = jwt.sign({ id: user._id, name: user.name }, secret, {
        expiresIn: "1h"
      });

      return res.status(200).json({
        message: "Login Successful",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        }
      });
    } else {
      console.log('Password does not match'); 
      return res.status(401).json({ message: "Invalid User Credentials" });
    }

  } catch (error) {
    console.log('Login error:', error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  signup,
  login
};
