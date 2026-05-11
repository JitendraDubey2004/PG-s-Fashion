const express = require('express');
const multer = require('multer');
const { visualSearch } = require('../controller/visualsearchcontroller');

const router = express.Router();

// Configure multer to store files in memory for Gemini API
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.route('/visual-search').post(upload.single('image'), visualSearch);

module.exports = router;
