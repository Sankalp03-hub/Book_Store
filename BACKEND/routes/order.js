const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const User = require("../models/user");
const Book = require("../models/book");
const Order = require("../models/order");

//place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;
    for (const orderData of order) {
      const newOrder = new Order({ user: id, book: orderData._id });
      const orderDataFromDb = await newOrder.save();

      //saving order into user model
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });

      //clearing cart
      await User.findByIdAndUpdate(id, { $pull: { cart: orderData._id } });
    }
    return res.json({ status: "success", message: "Order placed successfull" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//get order history of perticular user
router.get(
  "/get-all-order-history-of-user",
  authenticateToken,
  async (req, res) => {
    try {
      const { id } = req.headers;
      const userData = await User.findById(id).populate({
        path: "orders",
        populate: { path: "book" },
      });

      const orderData = userData.order.reverse();
      return res.json({ status: "successful", data: orderData });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

//get all orders
router.get("/get-all-order", authenticateToken, async (req, res) => {
  try {
    const userData = await User.Order.find()
      .populate({ path: "book" })
      .populate({ path: "user" });
    scrollTo({ createdAt: -1 });
    return res.json({ status: "successful", data: userData });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//update order----admin
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    await Order.findByIdAndUpdate(id, { status: req.body.status });

    return res.json({
      status: "successful",
      message: "status updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
