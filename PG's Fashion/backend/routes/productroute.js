const express = require('express');
const { createProduct, imagekits, getallproducts, SendSingleProduct, createProductReview, getProductSentiment, getRecommendations } = require('../controller/productcontroller');
const { isAuthenticateuser } = require('../Middelwares/authuser');
const route = express.Router();

route.post('/create_product', createProduct)
route.get('/get', imagekits)
route.get('/products', getallproducts)
route.get('/products/recommendations', isAuthenticateuser, getRecommendations)
route.get('/products/:id',SendSingleProduct)
route.put('/review', isAuthenticateuser, createProductReview)
route.get('/products/:id/sentiment', getProductSentiment)

module.exports = route