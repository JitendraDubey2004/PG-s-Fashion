const express = require('express');
const { applyCoupon, seedCoupons } = require('../controller/couponcontroller');
const { isAuthenticateuser } = require('../Middelwares/authuser');

const router = express.Router();

router.route('/coupon/apply').post(isAuthenticateuser, applyCoupon);
router.route('/coupon/seed').get(seedCoupons); // Call this once to add mock coupons

module.exports = router;
