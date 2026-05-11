const A = require("../Middelwares/resolveandcatch");
const Razorpay = require("razorpay");
const crypto = require("crypto");

exports.processPayment = A(async (req, res, next) => {
  const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
  });

  const options = {
    amount: req.body.amount * 100, // amount in the smallest currency unit (paise)
    currency: "INR",
    receipt: "receipt_order_74394",
  };

  const myOrder = await instance.orders.create(options);

  res.status(200).json({
    success: true,
    amount: req.body.amount,
    order: myOrder,
  });
});

exports.sendRazorpayApiKey = A(async (req, res, next) => {
  res.status(200).json({ stripeApiKey: process.env.RAZORPAY_API_KEY });
});

exports.paymentVerification = A(async (req, res, next) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
    req.body;

  const body = razorpay_order_id + "|" + razorpay_payment_id;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    res.status(200).json({
      success: true,
    });
  } else {
    res.status(400).json({
      success: false,
    });
  }
});