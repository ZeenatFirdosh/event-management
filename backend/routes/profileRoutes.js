// routes/profileRoutes.js
const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

router.post('/', profileController.createProfile);
router.get('/', profileController.getAllProfiles);
router.get('/:id', profileController.getProfileById);
router.patch('/:id/timezone', profileController.updateTimezone);

module.exports = router;