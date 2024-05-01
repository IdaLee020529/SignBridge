const { connectDB, DATABASE_COLLECTIONS } = require("../config/database");

const DatasetCounterService = {
    async getNextValue(counterName) {
        const { client, database } = await connectDB();
        const countersCollection = database.collection(DATABASE_COLLECTIONS.DATASET_COUNTER);
        const result = await countersCollection.findOneAndUpdate(
            { _id: counterName },
            { $inc: { value: 1 } },
            { upsert: true, returnOriginal: false }
        );
        client.close()
        return result.value;
    }
}

module.exports = DatasetCounterService