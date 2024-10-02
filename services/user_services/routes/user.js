const express = require("express");
const userController = require("../controllers/user");
const { registerValidator, loginValidator, updateValidator, checkStrongPassword } = require("../validators");
const passport = require("../middlewares/passport");
const { authenticate } = require("../middlewares/verifyJWT");

const router = express.Router();

// google auth
router.get("/google", passport.authenticate("google-auth", { scope: ["profile", "email"] }));

// google auth callback
router.get("/google/callback", passport.authenticate("google-auth", { session: false }), userController.googleAuthCB);

// login
router.post("/login", loginValidator(), userController.login);

// create new refresh token and access token
router.get("/new_refresh_token", userController.generateRefreshToken);

// private routes
router.use(authenticate);

// change email
router.get("/google-change", passport.authenticate("google-change", { scope: ["profile", "email"] }));
router.get("/google-change/callback", passport.authenticate("google-change", { session: false }), userController.updateEmail);

// add and change profile picture
router.put("/update_user", updateValidator(), userController.update);

// change password
router.patch("/password", checkStrongPassword(), userController.updatePassword);

// upadte profile picture
router.patch("/profile_picture", userController.updateProfilePicture);

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
