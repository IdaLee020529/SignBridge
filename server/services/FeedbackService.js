const { connectDB, DATABASE_COLLECTIONS } = require("../config/database");

const FeedbackService = {
    async CreateFeedback(feedbackData) {
        try {
            const { client, database } = await connectDB();
            const collection = database.collection(DATABASE_COLLECTIONS.FEEDBACKS);

            const count = await collection.countDocuments();
            
            const feedbackWithTimestamp = {
                ...feedbackData,
                createdAt: new Date(),
                status: "new",
                feedback_id: count + 1
            };
            
            const result = await collection.insertOne(feedbackWithTimestamp);
            client.close();
            return result;
        } catch (error) {
            throw new Error(`Error creating feedback: ${error.message}`);
        }
    }, 

    async FetchFeedback(){
        try{
            const { client, database } = await connectDB();
            const collection = database.collection(DATABASE_COLLECTIONS.FEEDBACKS);
            const result = await collection.find({}).toArray();
            client.close();
            return result;
        } catch (error) {
            throw new Error(`Error fetching feedback: ${error.message}`);
        }
    },
};


module.exports = FeedbackService;