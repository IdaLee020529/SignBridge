const { MongoClient } = require("mongodb")

const MONGODB_URI = process.env.DATABASE_URL
const DATABASE_NAME = process.env.DATABASE_NAME
const PORT = process.env.PORT

const DATABASE_COLLECTIONS = {
  USERS: "users",
  AVATAR: "avatar",
  FEEDBACKS: "feedbacks"
  FAQS: "faqs"
}

async function connectDB() {

  try {
    const client = await MongoClient.connect(MONGODB_URI,
      // {
      //   useNewUrlParser: true,
      //   useUnifiedTopology: true
      // }
    );
    console.log(`MongoDB Connected: ${client.db().databaseName}`);
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
