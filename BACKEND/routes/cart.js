const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

//put book to carts
router.put("/add-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookAddedToCart = userData.cart.includes(bookid);
    if (isBookAddedToCart) {
      return res.status(200).json({ message: "book is already into cart" });
    }
    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
    return res.status(200).json({ message: "book added into cart" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//delete book form router
router.put(
  "/remove-book-from-cart/:bookid",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid, id } = req.headers;
      await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });

      return res.json({
        status: "success",
        message: "book is succesfully removed from cart",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

//get all books from cart
router.get("/getAllBookFromCart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const booksInCart = userData.cart.reverse(); //(reverse()-->last added book geting on top
    return res
      .status(200)
      .json({ message: "get all books from cart", data: booksInCart });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
