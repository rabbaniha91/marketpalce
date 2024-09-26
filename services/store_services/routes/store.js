const express = require("express");

const router = express.Router();

// send store page
router.get("/store_page");

// get a single store
router.get("/get/:id");

// get all store
router.get("/get_all");

// check the user is authenticated
// router.use(authenticate);

// add a store
router.post("/add");

// check is seller
// router.use(isSeller);

// get users store
router.get("/my_stores");

// hidden or visible store
router.patch("/visibility/:id");

// get followers of store
router.get("/followers");

// update store details
router.put("/update");

// change stores title
router.patch("/change_title");

//change stores logo
router.patch("/change_logo");

// change stores banner
router.patch("/change_banner");

// edit decription
router.patch("/description");

// add video
router.post("/add_video");

// remove video
router.delete("/remove_video/:title");

// create festival
router.post("/festival");

// get all orders based on store id
router.get("/orders/:storeId");

// delete store
router.delete("/delete/:id");

module.exports = router;
