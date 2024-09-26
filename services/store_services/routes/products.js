const express = require("express");

const router = express.Router();

// get a single products
router.get("/get/:id");

// get a single products by title
router.get("/get/:title");

// get all products based on filter
router.get("/get_all");

// get score and reviews of products
router.get('/reviews')

// check the user be a seller
// router.use(isSeller);

// add products
router.post("/add");

// update products
router.put("/update/:id");

// change price
router.patch("/price/:id");

// Include or remove a discount for products
router.patch("/discount/:id");

// Inventory increase
router.patch("/inventory/:id");

// delete products
router.delete("/delete/:id");

module.exports = router;
