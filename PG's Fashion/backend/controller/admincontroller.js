const A = require('../Middelwares/resolveandcatch');
const Product = require('../model/productmodel');
const Order = require('../model/ordermodel');
const User = require('../model/usermodel');
const Errorhandler = require('../utilis/errorhandel');
const sendEmail = require('../utilis/sendEmail');

// Get all Products (Admin)
exports.getAdminProducts = A(async (req, res, next) => {
    const products = await Product.find();
    res.status(200).json({
        success: true,
        products,
    });
});

// Delete Product
exports.deleteProduct = A(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new Errorhandler("Product not found", 404));
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product Delete Successfully",
    });
});

// Get all Orders (Admin)
exports.getAllOrders = A(async (req, res, next) => {
    const orders = await Order.find().populate("user", "name email").populate("orderItems.product");

    let totalAmount = 0;
    orders.forEach((order) => {
        order.orderItems.forEach(item => {
            if(item.product) {
                totalAmount += item.product.sellingPrice * item.qty;
            }
        })
    });

    res.status(200).json({
        success: true,
        totalAmount,
        orders,
    });
});

// Update Order Status (Admin)
exports.updateOrder = A(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        return next(new Errorhandler("Order not found with this Id", 404));
    }

    if (order.paymentInfo.status === "Delivered") {
        return next(new Errorhandler("You have already delivered this order", 400));
    }

    order.paymentInfo.status = req.body.status;

    await order.save({ validateBeforeSave: false });

    // Send Status Update Email
    try {
        await sendEmail({
            email: order.user.email,
            subject: `Order Status Updated - PG's Fashion`,
            message: `Hello ${order.user.name},\n\nYour order (ID: ${order._id}) status has been updated to: ${req.body.status}.\n\nThank you for shopping with us!`,
            html: `<h1>Order Status Update</h1><p>Hello ${order.user.name},</p><p>Your order status has been updated.</p><p><strong>Order ID:</strong> ${order._id}</p><p><strong>New Status:</strong> ${req.body.status}</p>`
        });
    } catch (error) {
        console.error("Status update email could not be sent", error);
    }

    res.status(200).json({
        success: true,
    });
});

// Get all Users (Admin)
exports.getAllUsers = A(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users,
    });
});

// Make a user an admin (Helper function)
exports.makeAdmin = A(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new Errorhandler(`User does not exist with Id: ${req.params.id}`, 400));
    }
    
    user.role = 'admin';
    await user.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
        message: "User role updated to admin"
    })
});

// Get Admin Dashboard Stats
exports.getStats = A(async (req, res, next) => {
    const productsCount = await Product.countDocuments();
    const orders = await Order.find().populate("orderItems.product");
    const usersCount = await User.countDocuments();

    let totalRevenue = 0;
    let outOfStock = 0;
    
    // Simple revenue calculation
    orders.forEach(order => {
        order.orderItems.forEach(item => {
            if (item.product) {
                totalRevenue += item.product.sellingPrice * item.qty;
            }
        });
    });

    // Count out of stock products
    const products = await Product.find();
    products.forEach(p => {
        if (p.stock <= 0) outOfStock++;
    });

    // Categories breakdown for charts
    const categories = await Product.aggregate([
        { $group: { _id: "$category", count: { $sum: 1 } } }
    ]);

    res.status(200).json({
        success: true,
        stats: {
            productsCount,
            ordersCount: orders.length,
            usersCount,
            totalRevenue,
            outOfStock,
            categories
        }
    });
});
