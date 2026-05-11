const express = require('express')
const app = express(); 
const bodyParser =  require('body-parser')
const cookieParser = require('cookie-parser')
const User = require('./routes/userroutes.js')
const Product = require('./routes/productroute')
const Order = require('./routes/orderroutes')
const Chatbot = require('./routes/chatbotroutes')
const Payment = require('./routes/paymentroutes')
const Coupon = require('./routes/couponroutes')
const VisualSearch = require('./routes/visualsearchroutes')
const Admin = require('./routes/adminroutes')
const Stylist = require('./routes/stylistroutes')
const errorMiddleware = require('./Middelwares/error');
const path = require("path");
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "backend/config/config.env" });
  }

app.use(express.json())
app.use(cookieParser())
app.use(bodyParser.urlencoded({extended:true}))

app.use('/api/v1', User)
app.use('/api/v1', Product)
app.use('/api/v1', Order)
app.use('/api/v1', Chatbot)
app.use('/api/v1', Payment)
app.use('/api/v1', Coupon)
app.use('/api/v1', VisualSearch)
app.use('/api/v1', Admin)
app.use('/api/v1', Stylist)

app.use(express.static(path.join(__dirname, "../frontend/build")));

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "../frontend/build/index.html"));
});

app.use(errorMiddleware)
module.exports = app
