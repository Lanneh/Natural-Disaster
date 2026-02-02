const express = require('express');
const router = express.Router();
const featuringController = require('../controllers/featuringController');

router.patch('/:id', featuringController.featureMap);
router.delete('/:id', featuringController.unfeatureMap);
router.get('/list', featuringController.getFeaturedList);

module.exports = router;