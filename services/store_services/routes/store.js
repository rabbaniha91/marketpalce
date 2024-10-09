const express = require("express");

const router = express.Router();

// get a single store
router.get("/get/:id");

// get all store
router.get("/get_all");

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
router.patch("/remove_video/:id");

// create festival
router.post("/festival");

// get all orders based on store id
router.get("/orders/:storeId");

// rate to store
router.patch("/rate")

// delete store
router.delete("/delete/:id");

module.exports = router;
