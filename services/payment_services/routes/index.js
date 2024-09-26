const express = require('express')

const router = express.Router()

// send payment method page
router.get("/payment_page")

// redirect user to payment uri based on choosen method
router.get("/redirect")


module.exports = router;