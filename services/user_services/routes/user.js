const path = require("path");

const express = require("express");
const userController = require("../controllers/user");
const { loginValidator, updateValidator, checkStrongPassword } = require("../validators");
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

// get orders history
router.get("/orders", userController.orders);

// get user favorites
router.get("/favorites", userController.favorites);

// upadte profile picture
router.post("/profile_picture", userController.updateProfilePicture);

// become a seller
router.patch("/become_seller/:storeId", userController.addStore);

// gets user stores
router.get("/stores", userController.getStores);

// add address
router.post("/add_address", userController.addAddress);

// edit address
router.put("/edit_address/:id", userController.editAddress);

// delete address
router.delete("/delete_address/:id", userController.deleteAddress);

// logout
router.get("/logout", userController.logout);

module.exports = router;
