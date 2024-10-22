const router = require("express").Router();
const bcryptjs = require("bcryptjs");
// const user = require("../models/user");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

//sign-up
router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    //check username length is more than 3
    if (username?.length < 4) {
      return res
        .status(400)
        .json({ message: "username should be more than 3" });
    }
    //check username is already exists
    const existingUsername = await User.findOne({ username: username });

    if (existingUsername) {
      return res.status(400).json({ message: "username is already exists" });
    }
    //check email is already exists
    const existingEmail = await User.findOne({ email: email });

    if (existingEmail) {
      return res.status(400).json({ message: "email is already exists" });
    }

    //check passwords length
    if (password?.length <= 5) {
      return res
        .status(400)
        .json({ message: "password length should be more than 5" });
    }

    //password hashing(bcrypt)
    const hashPass = await bcryptjs.hash(password, 10);

    const newUser = new User({
      username: username,
      email: email,
      password: hashPass,
      address: address,
    });
    await newUser.save();
    return res.status(200).json({ message: "Signup successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//sign-in
router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    //check by comparing new pwd with existing pwd
    const data = await bcrypt.compare(password, existingUser.password);
    if (data) {
      const authclaims = [
        { name: existingUser.username },
        { role: existingUser.role },
      ];
      const token = jwt.sign({ authclaims }, "bookStore123", {
        expiresIn: "30d",
      });
      return res
        .status(200)
        .json({ id: existingUser._id, role: existingUser.role, token: token });
    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//get user info 
router.get("/get-user-info", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//update user info
router.put("/update", authenticateToken, async (req, res) => {
  try {
    const{id}=req.headers;
    const{address}=req.body;
    await User.findByIdAndUpdate(id,{address:address});
    return res.status(200).json({ message: "address update successfully" });


  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
