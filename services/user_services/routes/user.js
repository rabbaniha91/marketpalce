const express = require("express");

const router = express.Router();

// create new user
router.post("/register");

// login
router.post("/login");

// private routes
// router.use(authenticate);

// fetch user details
router.get("/get_user/:id");

// add and change profile picture
router.patch("/profile_picture");

// change username
router.patch("/update_username");

// add address
router.patch("/add_address");

// edit address
router.put("/edit_address/:id");

// delete address
router.delete("/delete_address/:id");

// change password
router.patch("/update_password");

// forgot password
router.post("/forgot_password");

// get orders history
router.get('/orders/:userId')

// become a seller
router.patch('/become_seller')

// delete user
router.delete("/delete_user");

// logout
router.get("/logout");

module.exports = router;
