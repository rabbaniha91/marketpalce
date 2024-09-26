const express = require("express");

const router = express.Router();

// add one products to cart
router.post("/add_product");

// remove one products from cart
router.delete("/delete_product/:id");

// fetch all products in cart
router.get('/get_products')

// clear cart
router.delete('/clear_cart')

module.exports = router;
