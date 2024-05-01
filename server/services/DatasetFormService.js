const { connectDB, DATABASE_COLLECTIONS } = require("../config/database");
const DatasetCounterService = require("./DatasetCounterService")

const DatasetFormService = {
    async SubmitForm(formData) {
        try {
            const { client, database } = await connectDB();
            const collection = database.collection(DATABASE_COLLECTIONS.DATASET_COLLECTION);
            const newFormId = await DatasetCounterService.getNextValue('formId')
            formData.form_id = newFormId;
            const result = await collection.insertOne(formData);
            client.close(); // Close the connection
            return result
        } catch (error) {
            // Handle validation errors or database errors
            if (error.name === 'ValidationError') {
                throw new Error(`Registration failed: ${error.message}`);  // More specific message
            } else {
                throw new Error(`Error registering form: ${error.message}`);  // Generic error for other errors
            }
        }
    },

    async GetAllForms() {
        const { client, database } = await connectDB();
        try {
            const collection = database.collection(DATABASE_COLLECTIONS.DATASET_COLLECTION);
            const users = await collection.find().toArray();
            await client.close();
            return users;
        } catch (error) {
            console.error("Error fetching form:", error);
            throw error; // Re-throw for controller to handle
        }
    },

    async DeleteFormByID(id) {
        const { client, database } = await connectDB();
        try {
            const collection = database.collection(DATABASE_COLLECTIONS.DATASET_COLLECTION); // Assuming FORMS is the collection name
            const result = await collection.deleteOne({ _id: ObjectId(id) });
            await client.close();
            return result.deletedCount;
        } catch (error) {
            console.error("Error deleting form:", error);
            throw error;
        }
    },

    async UpdateFormByID(id, updatedDetails) {
        const { client, database } = await connectDB();
        try {
            const collection = database.collection(DATABASE_COLLECTIONS.DATASET_COLLECTION); // Assuming FORMS is the collection name
            const result = await collection.updateOne(
                { _id: ObjectId(id) },
                { $set: updatedDetails }
            );
            await client.close();
            return result.modifiedCount; // Return the number of modified documents
        } catch (error) {
            console.error("Error updating form:", error);
            throw error; // Re-throw for controller to handle
        }
    }
}

module.exports = DatasetFormService