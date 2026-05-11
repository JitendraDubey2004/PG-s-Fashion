const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../model/productmodel");
const A = require("../Middelwares/resolveandcatch");

// Converts multer file buffer to the format required by Gemini API
function fileToGenerativePart(fileBuffer, mimeType) {
  return {
    inlineData: {
      data: fileBuffer.toString("base64"),
      mimeType
    },
  };
}

exports.visualSearch = A(async (req, res, next) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No image provided" });
    }

    if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({ success: false, message: "GEMINI_API_KEY is missing" });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); // Use 1.5 flash for multimodal

    const imagePart = fileToGenerativePart(req.file.buffer, req.file.mimetype);

    const prompt = `
    Analyze this image of clothing/fashion.
    Provide a comma-separated list of exactly 5 keywords that describe this item.
    Include keywords related to color, pattern, category (e.g., shirt, shoes, watch), and style.
    Example output: blue, striped, shirt, casual, cotton
    Only output the comma-separated list, nothing else.
    `;

    try {
        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        const text = response.text().trim();

        const keywords = text.split(',').map(k => k.trim());
        
        // Search MongoDB for products matching these keywords
        // We will do a basic regex search across title, brand, and category
        const searchRegex = new RegExp(keywords.join('|'), 'i');

        const matchingProducts = await Product.find({
            $or: [
                { title: { $regex: searchRegex } },
                { brand: { $regex: searchRegex } },
                { category: { $regex: searchRegex } }
            ]
        }).limit(10);

        res.status(200).json({
            success: true,
            extractedKeywords: keywords,
            products: matchingProducts
        });

    } catch (error) {
        console.error("Gemini Vision Error:", error);
        res.status(500).json({ success: false, message: "Failed to analyze image" });
    }
});
