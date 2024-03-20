const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017';
const dbName = 'SignBridge';

const client = new MongoClient(url);
const database = client.db(dbName);

// async function run() {
//   try {
//     const collection = database.collection('test');
//     const doc = { name: 'Red', town: 'kanto' };
//     const result = await collection.insertOne(doc);

//     console.log(
//       `${result.insertedCount} documents were inserted with the _id: ${result.insertedId}`,
//     );
//   } finally {
//     await client.close();
//   }
// }
// run().catch(console.dir);

app.get('/', (req, res) => {
    res.json({ message: 'Get all items' });
})


// For the sign up (Google Auth)
app.post('/users-google-auth', async (req, res) => {
  try {
      const collection = database.collection('users');
      const document = {
          name: req.body.name,
          email: req.body.email,
          picture: req.body.picture,
          given_name: req.body.given_name,
          family_name: req.body.family_name,
          locale: req.body.locale,
          acc_type: "google",
          role_access: "user"
      }
      const result = await collection.insertOne(document);
      res.json({ message: 'New user created' });
  } catch (error) {
      console.error('Error creating new user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// For the sign up (Traditional Auth)
app.post('/users-traditional-auth', async (req, res) => {
  try {
      const collection = database.collection('users');
      const document = {
          name: req.body.name,
          email: req.body.email,
          password: req.body.password,
          acc_type: "traditional",
          role_access: "user"
      }
      const result = await collection.insertOne(document);
      res.json({ message: 'New user created' });
  } catch (error) {
      console.error('Error creating new user:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});