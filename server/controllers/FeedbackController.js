const FeedbackService = require('../services/FeedbackService');

const FeedbackController = {
    async CreateFeedback(req, res) {
        try {
            const feedbackData = req.body;
            const newFeedback = await FeedbackService.CreateFeedback(feedbackData);
            res.status(201).json(newFeedback);
        } catch (error) {
            console.error("Error creating feedback:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    async FetchFeedback(req, res) {
        try {
            const feedbacks = await FeedbackService.FetchFeedback();
            res.status(200).json(feedbacks);
        } catch (error) {
            console.error("Error fetching feedback:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
};

module.exports = FeedbackController;