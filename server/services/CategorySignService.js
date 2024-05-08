const { connectDB, DATABASE_COLLECTIONS } = require("../config/database");

const CategorySignService = {
    async fetchSign(cat) {
        try {
            const { client, database } = await connectDB();
            const collection = database.collection(DATABASE_COLLECTIONS.CATEGORY_SIGN);
            const result = await collection.find({ category: cat }).toArray(); // Filter documents where category matches cat
            client.close();
            return result;
        } catch (error) {
            throw new Error(`Error fetching signs: ${error.message}`);
        }
    },
};

module.exports = CategorySignService;