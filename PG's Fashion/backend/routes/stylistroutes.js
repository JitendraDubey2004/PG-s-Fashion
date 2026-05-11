const express = require('express');
const { getOutfitSuggestions } = require('../controller/stylistcontroller');
const router = express.Router();

router.route('/stylist/outfit/:productId').get(getOutfitSuggestions);

module.exports = router;
