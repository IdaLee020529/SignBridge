const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.DATABASE_URL
const DATABASE_NAME = process.env.DATABASE_NAME
const PORT = process.env.PORT

const DATABASE_COLLECTIONS = {
  USERS: "users",
  USERS_COUNTER: "users_counter",
  AVATAR: "avatar",
  CATEGORY: "category",
  CATEGORY_COUNTER: "category_counter",
  CATEGORY_SIGN: "category_sign",
  CATEGORY_SIGN_COUNTER: "category_sign_counter",
  COMMUNICATION_COUNTER: "communication_counter",
  COMMUNICATION_LOG: "communication_log",
  FEEDBACKS: "feedbacks",
  FEEDBACKS_COUNTER: "feedbacks_counter",
  FAQS: "faqs",
  FAQ_COUNTER: "faq_counter",
  NOTIFICATIONS: "notifications",
  NOTIFICATIONS_COUNTER: "notifications_counter",
  DATASET_COLLECTION: "dataset_collection",
  DATASET_COUNTER: "dataset_counter",
  COUNTRY: "country",
}

async function connectDB() {

  try {
    const client = await MongoClient.connect(MONGODB_URI,
      // {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true
      // }
    );
    const database = client.db(DATABASE_NAME);
    return { client, database }
    // return client;

  } catch (error) {
    console.error('Error connecting to database:', error);
    throw new Error('Failed to connect to database');  // Re-throw for handling
  }
}


module.exports = {
  connectDB,
  DATABASE_COLLECTIONS
};
