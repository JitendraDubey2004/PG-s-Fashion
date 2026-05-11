const A = require('../Middelwares/resolveandcatch')
const Order = require('../model/ordermodel')
const Wishlist = require('../model/wishlist')
const Bag = require('../model/bag')
const Errorhandler = require('../utilis/errorhandel')
const sendEmail = require('../utilis/sendEmail')
const User = require('../model/usermodel')


exports.createorder = A(async (req, res, next) => {
    
    const { user, orderItems, paymentInfo } = req.body

    const order = await Order.create({
        user,
        orderItems,
        paymentInfo,
        createdAt: Date.now()
    })

    // Fetch user details for email
    const userData = await User.findById(user);

    if (userData) {
      try {
        await sendEmail({
          email: userData.email,
          subject: "Order Placed Successfully - PG's Fashion",
          message: `Hello ${userData.name},\n\nYour order has been placed successfully. Order ID: ${order._id}\n\nThank you for shopping with us!`,
          html: `<h1>Order Confirmation</h1><p>Hello ${userData.name},</p><p>Your order has been placed successfully.</p><p><strong>Order ID:</strong> ${order._id}</p><p>Thank you for shopping with PG's Fashion!</p>`
        });
      } catch (error) {
        console.error("Email could not be sent", error);
      }
    }

    // After order is created, we should probably clear the bag for this user
    await Bag.deleteOne({ user: user });

    res.status(201).json({
        success: true,
        order
    })
  })

exports.createwishlist = A(async (req, res, next) => {
   const {user, orderItems} = req.body
   const Finduser = await Wishlist.find({user: user})
    if (Finduser.length !== 0 ) {
      const product = await Wishlist.find({user:user})
      function f (data){
        return data.product ==  orderItems[0].product
      }
      if (product[0].orderItems.filter(f).length > 0) {
     
        return next(new Errorhandler("Product all ready added in Wishlist", 404));
      }else{
        await Wishlist.updateOne({user: user}, {$push:{
          orderItems: [orderItems[0]]
        }})
      
      }
      
    }else{
       console.log('else')
      const wishlist = await Wishlist.create(req.body)

    }
    
    res.status(200).json({
      success:true,
      
  })
  
  })

exports.getwishlist = A(async (req, res, next) => {
    
    const wishlist = await Wishlist.findOne({user: req.params.id}).populate('orderItems.product')

    res.status(200).json({
      success:true,
      wishlist
      
  })
  
})

exports.createbag = A(async (req, res, next) => {
  // console.log(req.body)
  const {user, orderItems} = req.body
  console.log(orderItems)
  const Finduser = await Bag.find({user: user})
   if (Finduser.length !== 0 ) {
    
    const product = await Bag.find({user:user})
    function f (data){
      return data.product ==  orderItems[0].product
    }
    
    if ( product[0].orderItems.filter(f).length > 0 ) {

      return next(new Errorhandler("Product all ready added in Bag", 404));

    }else{

      await Bag.updateOne({user: user}, {$push:{
        orderItems: [orderItems[0]]
      }})
    
    }
     
   }else{

     await Bag.create(req.body)

   }
   
   res.status(200).json({
     success:true,
     
 })
 
 })

 exports.getbag = A(async (req, res, next) => {
    
  const bag = await Bag.findOne({user: req.params.id}).populate('orderItems.product')

  
  res.status(200).json({
    success:true,
    bag
    
})

})

exports.updateqtybag = A(async (req, res, next) => {
 
  const {id, qty} = req.body
  
  const bag = await Bag.updateOne({'orderItems._id':id},{
    $set:{'orderItems.$.qty': qty}
  })

   res.status(200).json({
     success:true
     
 })
 
 })

 exports.deletebag = A(async (req, res, next) => {
  console.log(req.body)
  const {user, product} = req.body

  const users =  await Bag.updateOne({user: user}, {$pull:{
        orderItems: {product:product}
      }})
   
   res.status(200).json({
     success:true
     
 })
 
 })

 exports.deletewish = A(async (req, res, next) => {
  console.log(req.body)
  const {user, product} = req.body

  const users =  await Wishlist.updateOne({user: user}, {$pull:{
        orderItems: {product:product}
      }})

      console.log(users)
   
   res.status(200).json({
     success:true
     
 })
 
 })

exports.myOrders = A(async (req, res, next) => {
    const orders = await Order.find({ user: req.params.id }).populate('orderItems.product').sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        orders,
    });
});