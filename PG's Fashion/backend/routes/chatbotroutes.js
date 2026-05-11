const express = require('express');
const { getChatResponse } = require('../controller/chatbotcontroller');
const router = express.Router();

router.route('/chatbot').post(getChatResponse);

module.exports = router;
