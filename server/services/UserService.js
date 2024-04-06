const { connectDB, DATABASE_COLLECTIONS } = require("../config/database");
const PRESET_ACCOUNTS = require("../constants/PresetAccount")
const UserService = {
    async SignUpUser(userData) {
        try {
            const { client, database } = await connectDB();
            const collection = database.collection(DATABASE_COLLECTIONS.USERS);
            const result = await collection.insertOne(userData);
            const newUser = result.ops[0];
            client.close(); // Close the connection
            return newUser;
        } catch (error) {
            // Handle validation errors or database errors
            if (error.name === 'ValidationError') {
                throw new Error(`Registration failed: ${error.message}`);  // More specific message
            } else {
                throw new Error(`Error registering user: ${error.message}`);  // Generic error for other errors
            }
        }
    },

    // async SignUpManyUser(userDataList) {
    //     try {
    //         const { client, database } = await connectDB();
    //         const collection = database.collection(DATABASE_COLLECTIONS.USERS);
    //         const result = await collection.insertMany(userDataList);
    //         const createdUsers = result.ops;
    //         await client.close(); // Await closing for clarity
    //         return createdUsers;
    //     } catch (error) {
    //         console.error("Error creating users:", error);
    //         throw new Error(`Error creating users: ${error.message}`); // More specific message
    //     }
    // },
    async insertPresetAccounts() {
        const { client, database } = await connectDB();
        const presetAccounts = PRESET_ACCOUNTS.PRESET_ACCOUNTS
        try {
            const collection = database.collection(DATABASE_COLLECTIONS.USERS);

            const existingAccounts = await collection
                .find({ $or: [{ username: "admin" }, { username: "signexpert" }] })
                .toArray();

            if (existingAccounts.length === 0) {
                // Insert preset accounts into the collection
                const result = await collection.insertMany(presetAccounts);
                console.log(`${result.insertedCount} preset accounts inserted`);
            } else {
                console.log("Preset accounts already exist");
            }
        } catch (error) {
            console.error("Error inserting preset accounts:", error);
            throw new Error("Failed to insert preset accounts");
        } finally {
            client.close();
        }
    },
    async GetAllUsers() {
        const { client, database } = await connectDB();
        try {
            const collection = database.collection(DATABASE_COLLECTIONS.USERS);
            const users = await collection.find().toArray();
            await client.close();
            return users;
        } catch (error) {
            console.error("Error fetching users:", error);
            throw error; // Re-throw for controller to handle
        }
    }

};

module.exports = UserService;
