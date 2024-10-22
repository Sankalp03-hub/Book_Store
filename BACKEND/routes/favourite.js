const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

//add book to favourites

router.put("/add-booktofavourites", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isBookFavourite = userData.favourites.includes(bookid);
    if (isBookFavourite) {
      return res.status(200).json({ message: "book is already in favourite" });
    }
    await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });
    return res.status(200).json({ message: "Book added in favourites" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//delete book from favourites

router.put("/RemoveFromFavourites", authenticateToken, async (req, res) => {
    try {
      const { bookid,id } = req.headers;
      const userData=await User.findById(id)
      const isBookFavourite = userData.favourites.includes(bookid);
      if (isBookFavourite) {
        await User.findByIdAndUpdate(id,{$pull:{favourites:bookid}});

        return res
          .status(200)
          .json({ message: "book is deleted succesfully from favourits" });
      }
    } catch (error) {
        console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
);

//get all favourite books of particuler user
router.get("/getallbooksfromfavourites",authenticateToken,async(req,res)=>{
    try{
        const{id}=req.headers;
        const userData=await User.findById(id).populate("favourites") //populate use to get all data of book
        const favouriteBooks=userData.favourites;
        return res.json({status:"success",data:favouriteBooks})

    }
    catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
      }
})

module.exports = router;
