const FeedbackController = require('../controllers/FeedbackController');

const router = require('express').Router();

router.post('/feedbacks/create-feedback', FeedbackController.CreateFeedback);
router.get('/feedbacks/fetch-feedback', FeedbackController.FetchFeedback);

module.exports = router;