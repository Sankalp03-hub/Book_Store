const router = require("express").Router();
const bcryptjs = require("bcryptjs");
// const user = require("../models/user");
const User = require("../models/user");
const Book = require("../models/book");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");

//add books ----admin
router.post("/addbook", authenticateToken, async (req, res) => {
  const { id } = req.headers;
  const user = await User.findById(id);
  if (user.role !== "admin") {
    res.status(400).json({ message: "Unauthorize entity " });
  }

  try {
    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });
    await book.save();
    res.status(200).json({ message: "Book added successfully " });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

//update book by id ---admin
router.put("/updatebook", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findbyIdAndUpdate(bookid, {
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });
    res.status(200).json({ message: "Update sccessfully" });
  } catch (error) {
    return res.status(500).json({ message: "An error occured" });
  }
});

//delete book
router.delete("/deleteBook", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndDelete(bookid);
    res.status(200).json({ message: "Delete successfully" });
  } catch (error) {
    return res.status(500).json({ message: "An error occured" });
  }
});

//get all books
router.get("/getallbooks", authenticateToken, async (req, res) => {
  try {
    const books=await Book.find().sort({ createdAt: -1 })
    return res.json({ status: "success", data:books});
  } catch (error) {
    return res.status(500).json({ message: "An error occured" });
  }
});

//get recent books
router.get("/getrecentbooks", authenticateToken, async (req, res) => {
  try {
    const books=await Book.find().sort({ createdAt: -1 }).limit(2);
    return res.status(200).json({ status: "success", data:books});
  } catch (error) {
    return res.status(500).json({ message: "An error occured" });
  }
});


// get book by bookid
router.get("/getBookById/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const book=await Book.findById(id);
    return res.status(200).json({ status: "success", data:book});
  } catch (error) {
    return res.status(500).json({ message: "An error occured" });
  }
});


module.exports = router;
