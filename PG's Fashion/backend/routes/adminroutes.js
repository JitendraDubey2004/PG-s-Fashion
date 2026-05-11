const express = require('express');
const { 
    getAdminProducts, 
    deleteProduct, 
    getAllOrders, 
    updateOrder, 
    getAllUsers,
    makeAdmin,
    getStats
} = require('../controller/admincontroller');
const { isAuthenticateuser, authorizeRoles } = require('../Middelwares/authuser');

const router = express.Router();

router.route('/admin/products').get(isAuthenticateuser, authorizeRoles("admin"), getAdminProducts);
router.route('/admin/product/:id').delete(isAuthenticateuser, authorizeRoles("admin"), deleteProduct);

router.route('/admin/orders').get(isAuthenticateuser, authorizeRoles("admin"), getAllOrders);
router.route('/admin/order/:id').put(isAuthenticateuser, authorizeRoles("admin"), updateOrder);

router.route('/admin/users').get(isAuthenticateuser, authorizeRoles("admin"), getAllUsers);

router.route('/admin/stats').get(isAuthenticateuser, authorizeRoles("admin"), getStats);

// Hidden route to self-promote to admin for testing purposes
router.route('/admin/make-me-admin/:id').put(makeAdmin);

module.exports = router;
