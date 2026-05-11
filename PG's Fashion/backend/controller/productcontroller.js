const A = require('../Middelwares/resolveandcatch')
const Product = require('../model/productmodel')
const Wishlist = require('../model/wishlist')
const Errorhandler = require('../utilis/errorhandel')
var ImageKit = require("imagekit");
const Apifeature = require('../utilis/Apifeatures')
const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.createProduct = A( async(req, res, next)=>{
    const product = await Product.create(req.body)

    res.status(200).json({
        success:true,
        product
    })
})

exports.imagekits = A(async (req, res, next)=>{
    var imagekit = new ImageKit();
    
  
imagekit.listFiles({
    
}, function(error, result) { 
    if(error) console.log(error);
    else {
        res.status(200).json({
            result
        })
    }
   
});
})

exports.getallproducts = A(async (req, res, next)=>{
    const {low,date, width} = req.query
    const apifeature = new Apifeature(Product.find(), req.query).filter().sort(low, date).pagination(width).search()
    const apifeature1 = new Apifeature(Product.find(), req.query).search()
    const apifeature3 = new Apifeature(Product.find(), req.query).filter().sort(low, date).search()
    const products = await apifeature.Product_find;
    const pro = await apifeature1.Product_find;
    const productlength = await apifeature3.Product_find;
    let length = productlength.length
    res.status(200).json({
        products,
        pro,
        length
    })
})

exports.SendSingleProduct = A(async (req, res, next)=>{
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new Errorhandler("product not found", 404));
    }
    
    const similar_product = await Product.find({category: product.category, brand: product.brand}).limit(15)
    
    res.status(200).json({
        success:true,
        product,
        similar_product
    })
})

exports.createProductReview = A(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id, // Assuming req.user is populated by a middleware, if not we take it from body
        name: req.body.name, // Assuming we pass name from frontend for now if auth middleware isn't strictly attaching name
        rating: Number(rating),
        comment,
    };

    const product = await Product.findById(productId);

    if (!product) {
         return next(new Errorhandler("Product not found", 404));
    }

    const isReviewed = product.reviews.find(
        (rev) => rev.user.toString() === review.user.toString()
    );

    if (isReviewed) {
        product.reviews.forEach((rev) => {
            if (rev.user.toString() === review.user.toString())
                (rev.rating = rating), (rev.comment = comment);
        });
    } else {
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }

    let avg = 0;
    product.reviews.forEach((rev) => {
        avg += rev.rating;
    });
    product.ratings = avg / product.reviews.length;

    await product.save({ validateBeforeSave: false });

    res.status(200).json({
        success: true,
    });
});

exports.getProductSentiment = A(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new Errorhandler("Product not found", 404));
    }

    if (!product.reviews || product.reviews.length === 0) {
        return res.status(200).json({
            success: true,
            sentiment: {
                pros: [],
                cons: [],
                summary: "Not enough reviews to analyze sentiment."
            }
        });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
            success: false,
            message: "GEMINI_API_KEY is not defined in environment variables.",
        });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const reviewTexts = product.reviews.map(rev => `Rating: ${rev.rating}, Comment: ${rev.comment}`).join('\n');

    const prompt = `
        You are an expert sentiment analyzer. Analyze the following product reviews and provide a summary.
        Extract the top pros, top cons, and provide a 1-2 sentence overall summary.
        
        Reviews:
        ${reviewTexts}

        Please return the response as a strict JSON object with this exact structure:
        {
            "pros": ["pro1", "pro2", ...],
            "cons": ["con1", "con2", ...],
            "summary": "overall summary text"
        }
        Return ONLY the JSON string. Do not include markdown code block syntax (like \`\`\`json).
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();
        
        if (text.startsWith('\`\`\`json')) {
            text = text.replace(/^\`\`\`json/i, '').replace(/\`\`\`$/i, '').trim();
        } else if (text.startsWith('\`\`\`')) {
             text = text.replace(/^\`\`\`/i, '').replace(/\`\`\`$/i, '').trim();
        }

        const sentiment = JSON.parse(text);

        res.status(200).json({
            success: true,
            sentiment
        });
    } catch (error) {
        console.error("Sentiment analysis error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate sentiment analysis."
        });
        }
        });

        exports.getRecommendations = A(async (req, res, next) => {
        let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('orderItems.product');

        let categories = [];
        if (wishlist && wishlist.orderItems && wishlist.orderItems.length > 0) {
        wishlist.orderItems.forEach(item => {
            if (item.product && item.product.category) {
                categories.push(item.product.category);
            }
        });
        }

        categories = [...new Set(categories)];

        let recommendations = [];

        if (categories.length > 0) {
        recommendations = await Product.find({ category: { $in: categories } })
            .limit(10)
            .sort({ createDate: -1 });
        } else {
        recommendations = await Product.find()
            .limit(10)
            .sort({ ratings: -1, createDate: -1 });
        }

        res.status(200).json({
        success: true,
        recommendations
        });
        });