const { connectDB, DATABASE_COLLECTIONS } = require("../config/database");
const FIX_FAQ = require("../constants/FixFaq")

const FaqService = {
    async CreateFaq(faqData) {
        try {
            const { client, database } = await connectDB();
            const collection = database.collection(DATABASE_COLLECTIONS.FAQS);

            const count = await collection.countDocuments();
            
            const faqWithTimestamp = {
                ...faqData,
                faq_id: count + 1
            };
            
            const result = await collection.insertOne(faqWithTimestamp);
            client.close();
            return result;
        } catch (error) {
            throw new Error(`Error creating faq: ${error.message}`);
        }
    }, 

    async UpdateFaq(faqId, faqData) {
        try {
            const { client, database } = await connectDB();
            const collection = database.collection(DATABASE_COLLECTIONS.FAQS);

            const result = await

            collection.updateOne(
                { faq_id: faqId },
                { $set: faqData }
            );
            client.close();
            return result;
        }
        catch (error) {
            throw new Error(`Error updating faq: ${error.message}`);
        }
    },

    async DeleteFaq(faqId) {
        try {
            const { client, database } = await connectDB();
            const collection = database.collection(DATABASE_COLLECTIONS.FAQS);

            const result = await collection.deleteOne({ faq_id: faqId });
            client.close();
            return result;
        } catch (error) {
            throw new Error(`Error deleting faq: ${error.message}`);
        }
    },

    async FetchFaq(){
        try{
            const { client, database } = await connectDB();
            const collection = database.collection(DATABASE_COLLECTIONS.FAQS);
            const result = await collection.find({}).toArray();
            client.close();
            return result;
        } catch (error) {
            throw new Error(`Error fetching faq: ${error.message}`);
        }
    },

    async insertFixFaq(){
        const { client, database } = await connectDB();
        const fixfaq = FIX_FAQ.FIX_FAQ;
        try{
            const collection = database.collection(DATABASE_COLLECTIONS.FAQS);

            const existingFAQ = await collection
                .find({ $or: [{ faq_id: 1 }, { faq_id: 2 }] })
                .toArray();
            
            if (existingFAQ.length === 0) {
                const fixFaqWithIds = fixfaq.map((faq, index) => ({
                    ...faq,
                    faq_id: index + 1 
                }));
    
                const result = await collection.insertMany(fixFaqWithIds);
                console.log(`${result.insertedCount} fix faq inserted`);
            } else {
                console.log("Fix Faq already exist");
            }
        } catch (error) {
            console.error("Error inserting fix faq:", error);
            throw new Error(`Error inserting fix faq: ${error.message}`);
        } finally {
            client.close();
        }
    }
};

module.exports = FaqService;