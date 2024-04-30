const FeedbackController = require('../controllers/FeedbackController');

const router = require('express').Router();

router.post('/feedbacks/create-feedback', FeedbackController.CreateFeedback);
router.get('/feedbacks/fetch-feedback', FeedbackController.FetchFeedback);
router.put('/feedbacks/update-feedback-status/:feedbackId', FeedbackController.UpdateFeedbackStatus);

module.exports = router;