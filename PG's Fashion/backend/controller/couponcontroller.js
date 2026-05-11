const A = require('../Middelwares/resolveandcatch');
const Coupon = require('../model/couponmodel');
const Errorhandler = require('../utilis/errorhandel');

// Seed a default coupon for testing if it doesn't exist
exports.seedCoupons = A(async (req, res, next) => {
    const existing = await Coupon.findOne({ code: 'PG300' });
    if (!existing) {
        await Coupon.create([
            { code: 'PG300', discountType: 'fixed', discountValue: 300, minOrderAmount: 1000 },
            { code: 'PG10', discountType: 'percentage', discountValue: 10, minOrderAmount: 1500 }
        ]);
    }
    res.status(200).json({ success: true, message: 'Coupons seeded' });
});

exports.applyCoupon = A(async (req, res, next) => {
    const { code, cartTotal } = req.body;

    const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

    if (!coupon) {
        return next(new Errorhandler("Invalid or expired coupon code", 400));
    }

    if (cartTotal < coupon.minOrderAmount) {
        return next(new Errorhandler(`Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`, 400));
    }

    let discountAmount = 0;
    if (coupon.discountType === 'fixed') {
        discountAmount = coupon.discountValue;
    } else if (coupon.discountType === 'percentage') {
        discountAmount = (cartTotal * coupon.discountValue) / 100;
    }

    // Ensure discount doesn't exceed cart total
    discountAmount = Math.min(discountAmount, cartTotal);

    res.status(200).json({
        success: true,
        discountAmount,
        coupon: coupon.code,
        message: 'Coupon applied successfully'
    });
});
