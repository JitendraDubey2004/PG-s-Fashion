const { GoogleGenerativeAI } = require("@google/generative-ai");
const Product = require("../model/productmodel");
const A = require("../Middelwares/resolveandcatch");

exports.getChatResponse = A(async (req, res, next) => {
  const { message, history } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      success: false,
      message: "GEMINI_API_KEY is not defined in environment variables.",
    });
  }

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Fetch some products to provide context
  const products = await Product.find().limit(20);
  const productContext = products.map(p => ({
    id: p._id,
    brand: p.brand,
    title: p.title,
    price: p.sellingPrice,
    category: p.category,
    gender: p.gender
  }));

  const systemInstruction = `
    You are a helpful fashion assistant for "PG's Fashion", an online clothing store.
    Your goal is to help users find the best suitable available choices and recommend products.
    
    Here is a list of some available products in our store:
    ${JSON.stringify(productContext)}

    Guidelines:
    1. Be polite and professional.
    2. If a user asks for recommendations, refer to the product list provided.
    3. If a product they want isn't in the list, suggest the closest alternative or ask for more details.
    4. Provide direct links to products if possible (the link format is /product/ID).
    5. Keep responses concise and helpful.
  `;

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: systemInstruction,
      },
      {
        role: "model",
        parts: "Understood. I am now the PG's Fashion Assistant. How can I help you today?",
      },
      ...history.map(h => ({
        role: h.role === "user" ? "user" : "model",
        parts: h.parts,
      }))
    ],
  });

  const result = await chat.sendMessage(message);
  const response = await result.response;
  const text = response.text();

  res.status(200).json({
    success: true,
    message: text,
  });
});
