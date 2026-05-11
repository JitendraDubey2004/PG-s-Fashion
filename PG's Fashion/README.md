# PG's Fashion 🛍️

An advanced, full-stack E-commerce application inspired by Myntra, featuring AI-driven search, immersive shopping experiences, and a robust administrative system.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)
![AI Powered](https://img.shields.io/badge/AI-Google%20Gemini-orange)
![Responsive](https://img.shields.io/badge/Design-Responsive-green)
![Dark Mode](https://img.shields.io/badge/UI-Dark%20Mode-black)

## ✨ Advanced Features

### 🤖 AI-Powered Experience
- **Voice Search:** Search for products using natural voice commands (Web Speech API).
- **Visual Search:** Upload images to find similar products in the inventory.
- **AI Stylist:** Get professional outfit recommendations based on current product selections using Google Gemini AI.
- **Review Sentiment Analysis:** AI-generated Pros/Cons summaries for product reviews to help quick decision-making.
- **Smart Chatbot:** A fashion-aware assistant to help users navigate and find products.

### 👓 Immersive & Personalized
- **Virtual Try-On (AR):** Visualise products in real-time using an AR webcam overlay.
- **Advanced Personalization:** Dynamic "Recommended For You" sections based on user wishlist and behavior.
- **Dark Mode:** Fully integrated dark theme for a modern browsing experience.

### 🛒 Core E-commerce
- **Secure Payments:** Integrated with Razorpay for a seamless checkout experience.
- **Email Notifications:** Automated order confirmations and status updates via Nodemailer.
- **Advanced Filtering:** Sort and filter by Category, Brand, Size, Color, and Price.
- **Bag & Wishlist:** Fully functional cart management and saved items list.
- **Address Management:** Save and manage multiple shipping addresses.

### 🛡️ Admin & Security
- **JWT Authentication:** Secure sessions using HttpOnly cookies.
- **Analytics Dashboard:** Visualized stats for Revenue, Orders, Inventory, and User growth.
- **Management:** Full CRUD operations for Products, Orders, and Users.

---

## 🚀 Tech Stack

**Frontend:**
- React.js (Hooks, Context)
- Redux (State Management)
- Tailwind CSS (Styling)
- React-Responsive-Carousel
- React-Icons

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- Google Gemini AI (Generative AI)
- Razorpay API (Payments)
- Nodemailer (Email)
- ImageKit.io (Media Hosting)

---

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/pgs-fashion.git
cd pgs-fashion
```

### 2. Backend Configuration
Navigate to the `backend/config` folder and create a `config.env` file (refer to `config.env.example`):
```env
PORT=4000
DB_URI=your_mongodb_uri
GEMINI_API_KEY=your_google_gemini_key
RAZORPAY_API_KEY=your_razorpay_key
RAZORPAY_API_SECRET=your_razorpay_secret
JWT_SECRET=your_jwt_secret
SMPT_MAIL=your_email
SMPT_PASSWORD=your_app_password
```

### 3. Install Dependencies
```bash
# Install backend dependencies (from the project root directory)
npm install

# Install frontend dependencies
cd frontend
npm install
```

### 4. Run the Application
```bash
# Run backend (from the project root directory)
npm run dev
# or npm start

# Run frontend (from the frontend directory in a new terminal)
cd frontend
npm start
```

---

## 📸 Project Architecture

- **Backend:** MVC (Model-View-Controller) architecture for clean separation of concerns.
- **Frontend:** Component-based architecture with Redux for centralized global state.
- **Middleware:** Custom authentication, error handling, and async-catch wrappers.
- **Database:** Optimized MongoDB indexing for fast product searches.

---

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the ISC License.

---
*Created with ❤️ PG's Fashion Team*
