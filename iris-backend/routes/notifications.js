const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// When someone visits GET /api/notifications, run the getNotifications function
router.get('/', notificationController.getNotifications);

module.exports = router;