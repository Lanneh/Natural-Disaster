const express = require('express');
const router = express.Router();
const mapController = require('../controllers/mapController');
const featuringController = require('../controllers/featuringController');

router.get('/recent', mapController.getRecentMaps);
router.get('/most-played', mapController.getMostPlayedMaps);
router.get('/highest-rated', mapController.getHighestRatedMaps);
router.get('/search', mapController.searchMaps);
router.get('/featured', featuringController.getFeaturedList);
router.get('/:id', mapController.getMapById);
router.post('/', mapController.createMap);
router.patch('/:id', mapController.updateMap);
router.delete('/:id', mapController.deleteMap);

module.exports = router;