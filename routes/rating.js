const express = require('express');
const router = express.Router();
const ratingController = require('../controllers/ratingController');

router.patch('/:id', ratingController.setRating);
router.delete('/:id', ratingController.removeRating);
router.get('/list', ratingController.getRatedMaps);
router.get('/:tier', ratingController.getMapsByRating);

module.exports = router;