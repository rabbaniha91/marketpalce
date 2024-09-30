const express = require("express");
const userController = require("../controllers/user");
const { authValidator } = require("../validators");
const passport = require("../middlewares/passport");
const { authenticate } = require("../middlewares/verifyJWT");

const router = express.Router();

// create new user
router.post("/register", authValidator(), userController.register);

// google auth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// google auth callback
router.get("/google/callback", passport.authenticate("google", { session: false }), userController.googleAuthCB);

// login
router.post("/login", authValidator(), userController.login);

// private routes
router.use(authenticate);

// fetch user details
router.get("/get_user");

// add and change profile picture
router.put("/update_user");

// change password
router.patch("/update_password");

// forgot password
router.post("/forgot_password");

// get orders history
router.get("/orders");

// get user favorites
router.get("/favorites");

// become a seller
router.patch("/become_seller");

// gets user stores
router.get("/stores");

// delete user
router.delete("/delete_user");

// add address
router.post("/add_address");

// edit address
router.put("/edit_address/:id");

// delete address
router.delete("/delete_address/:id");

// logout
router.get("/logout");

module.exports = router;
