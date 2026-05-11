const express = require('express');
const { processPayment, sendRazorpayApiKey, paymentVerification } = require('../controller/paymentcontroller');
const { isAuthenticateuser } = require('../Middelwares/authuser');

const router = express.Router();

router.route('/payment/process').post(isAuthenticateuser, processPayment);
router.route('/payment/verification').post(isAuthenticateuser, paymentVerification);
router.route('/razorpayapikey').get(isAuthenticateuser, sendRazorpayApiKey);

module.exports = router;