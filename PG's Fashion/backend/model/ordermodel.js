const mongoose = require('mongoose')

const orders = new mongoose.Schema({
    user:{
        type:mongoose.ObjectId,
        ref:"MynUser",
        required:true
    },
    orderItems: [{
        product: {
            type:mongoose.ObjectId,
            ref:"myntraproduct",
            required:true
        },
        qty:{
            type:Number,
            required:true
        }
    }],
    createdAt:{
        type:Date,
        default: Date.now
    },
    paymentInfo:{
        status: { type: String, required: true },
    },
    

})

module.exports = mongoose.model('MynOrder', orders)