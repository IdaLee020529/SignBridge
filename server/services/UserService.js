const { connectDB, DATABASE_COLLECTIONS } = require("../config/database");
const PRESET_ACCOUNTS = require("../constants/PresetAccount")
const { sendEmail, mailTemplate } = require("../utils/email");
const jwt = require('jsonwebtoken');


const UserService = {
    async SignUpUser(userData) {
        try {
            const { client, database } = await connectDB();
            const collection = database.collection(DATABASE_COLLECTIONS.USERS);
            const existingUser = await collection.findOne({ email: userData.email });

            if (existingUser) {
                return existingUser;
            }

            // Get the count of existing users to determine the next id
            const count = await collection.countDocuments();
            userData.user_id = count + 1; // Increment count to start from 1

            const token = jwt.sign({ email: userData.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

            const mailOption = {
                email: userData.email,
                subject: "Verify Email Address",
                message: mailTemplate(
                    "Thank you for signing up for our service! To complete your registration and start using our platform, please verify your email address by clicking the button below.",
                    `${process.env.BACKEND_URL}/users/verify-email?token=${token}`,
                    "Verify Email"
                ),
            };
            await sendEmail(mailOption);

            userData.verification_token = token;

            const result = await collection.insertOne(userData);
            client.close();
            return result;
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new Error(`Registration failed: ${error.message}`);
            } else {
                throw new Error(`Error registering user: ${error.message}`);
            }
        }
    },

    async SignUpGoogleUser(userData) {
        try {
            const { client, database } = await connectDB();
            const collection = database.collection(DATABASE_COLLECTIONS.USERS);
            const existingUser = await collection.findOne({ email: userData.email });
            
            if (existingUser) {
                return existingUser;
            }

            userData.acc_type = "google";   
            userData.role_access = "public";
            // Get the count of existing users to determine the next id
            const count = await collection.countDocuments();
            userData.user_id = count + 1; // Increment count to start from 1

            const result = await collection.insertOne(userData);
            client.close();
            return result;
        } catch (error) {
            if (error.name === 'ValidationError') {
                throw new Error(`Registration failed: ${error.message}`);
            } else {
                throw new Error(`Error registering user: ${error.message}`);
            }
        }
    },

    async VerifyEmail(token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            const { client, database } = await connectDB();
            const collection = database.collection(DATABASE_COLLECTIONS.USERS);
            const user = await collection.findOneAndUpdate(
                { email: decodedToken.email },
                { $set: { email_verified: true }, $unset: { verification_token: "" } }
            );

            client.close();
            return user;
        } catch (error) {
            console.error("Error verifying email:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    },
    
    async LoginUser(userData) {
        try {
            const { client, database } = await connectDB();
            const collection = database.collection(DATABASE_COLLECTIONS.USERS);
            const user = await collection.findOne({
                email: userData.email,
                password: userData.password
            });

            client.close();
            return user;
        } catch (error) {
            console.error("Error logging in user:", error);
            throw new Error("Login failed");
        }
    },

    async ForgetPassword(userData) {
        try {
            const { client, database } = await connectDB();
            const collection = database.collection(DATABASE_COLLECTIONS.USERS);
            const user = await collection.findOne({ email: userData.email });

            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }

            const token = jwt.sign({ email: userData.email }, process.env.JWT_SECRET, { expiresIn: "1h" });

            const mailOption = {
                email: userData.email,
                subject: "Reset Password",
                message: mailTemplate(
                    "You have requested to reset your password. To reset your password, please click the button below.",
                    `${process.env.FRONTEND_URL}/reset-password?token=${token}`,
                    "Reset Password"
                ),
            };
            await sendEmail(mailOption);

            const a = await collection.updateOne(
                { email: userData.email },
                { $set: { reset_password_token: token } }
            );

            // console.log(a);

            client.close();

            if (a.modifiedCount === 1) {
                return { message: "Password reset email sent" };
            } else {
                return { message: "Failed to send password reset email" };
            }
            
        } catch (error) {
            console.error("Error forgetting password:", error);
            throw new Error("Failed to forget password");
        }
    },

    async ResetPassword(userData) {
        try {
            const decodedToken = jwt.verify(userData.token, process.env.JWT_SECRET);

            const { client, database } = await connectDB();
            const collection = database.collection(DATABASE_COLLECTIONS.USERS);
            const user = await collection.findOneAndUpdate(
                { email: decodedToken.email },
                { $set: { password: userData.password }, $unset: { reset_password_token: "" }}
            );

            client.close();
            return user;
        } catch (error) {
            console.error("Error resetting password:", error);
            throw new Error("Failed to reset password");
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
        const presetAccounts = PRESET_ACCOUNTS.PRESET_ACCOUNTS;
        try {
            const collection = database.collection(DATABASE_COLLECTIONS.USERS);
    
            const existingAccounts = await collection
                .find({ $or: [{ username: "admin" }, { username: "signexpert" }] })
                .toArray();
    
            if (existingAccounts.length === 0) {
                // Generate IDs for preset accounts and insert them into the collection
                const presetAccountsWithIds = presetAccounts.map((account, index) => ({
                    ...account,
                    user_id: index + 1 // Increment index to start from 1
                }));
    
                const result = await collection.insertMany(presetAccountsWithIds);
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
