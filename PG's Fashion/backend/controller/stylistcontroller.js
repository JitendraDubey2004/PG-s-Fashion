const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../model/productmodel");
const A = require("../Middelwares/resolveandcatch");

exports.getOutfitSuggestions = A(async (req, res, next) => {
    const { productId } = req.params;

    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
        return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Fetch potential matching items (different categories, same gender)
    // We'll grab a sample to let Gemini choose the best ones
    const candidates = await Product.find({
        _id: { $ne: productId },
        gender: currentProduct.gender,
        category: { $ne: currentProduct.category }
    }).limit(15);

    if (candidates.length === 0) {
        return res.status(200).json({ success: true, outfit: [] });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const candidateList = candidates.map(p => ({
        id: p._id,
        title: p.title,
        category: p.category,
        brand: p.brand
    }));

    const prompt = `
    You are a professional fashion stylist. 
    Current Item: ${currentProduct.brand} ${currentProduct.title} (${currentProduct.category})
    
    Choose exactly 2 items from the following list that would best complete an outfit with the current item.
    Only return a valid JSON array of the "id" strings.
    Example: ["id1", "id2"]
    
    Candidates:
    ${JSON.stringify(candidateList)}
    `;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();
        
        // Extract JSON array from response (handling potential markdown wrapping)
        const jsonMatch = text.match(/\[.*\]/);
        const suggestedIds = jsonMatch ? JSON.parse(jsonMatch[0]) : [];

        const outfitProducts = await Product.find({ _id: { $in: suggestedIds } });

        res.status(200).json({
            success: true,
            outfit: outfitProducts
        });
    } catch (error) {
        console.error("Style Bundler Error:", error);
        res.status(500).json({ success: false, message: "Stylist is busy right now" });
    }
});
