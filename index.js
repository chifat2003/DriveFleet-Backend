const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

dotenv.config();

const app = express();
const uri = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function getDb() {
  if (!db) {
    await client.connect();
    db = client.db("drivefleet");
    console.log("Connected to MongoDB");
  }

  return db;
}

async function getCollections() {
  const db = await getDb();

  return {
    addedcarscollection: db.collection("addedcars"),
    bookingcollection: db.collection("booking"),
  };
}

app.get('/', (req, res) => {
  res.send('DriveFleet');
});

app.get('/add-car', async (req, res) => {
  const { addedcarscollection } = await getCollections();
  const result = await addedcarscollection.find().toArray();
  res.json(result);
});

app.post('/add-car', async (req, res) => {
  const { addedcarscollection } = await getCollections();
  const carData = req.body;
  const result = await addedcarscollection.insertOne(carData);
  res.json(result);
});

app.get('/add-car/:id', async (req, res) => {
  const { addedcarscollection } = await getCollections();
  const { id } = req.params;
  const result = await addedcarscollection.findOne({ _id: new ObjectId(id) });
  res.json(result);
});

app.patch('/add-car/:id', async (req, res) => {
  const { addedcarscollection } = await getCollections();
  const { id } = req.params;
  const updateData = req.body;

  const result = await addedcarscollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );

  res.json(result);
});

app.delete('/add-car/:id', async (req, res) => {
  const { addedcarscollection } = await getCollections();
  const { id } = req.params;
  const result = await addedcarscollection.deleteOne({ _id: new ObjectId(id) });
  res.json(result);
});

app.get('/booking/:userId', async (req, res) => {
  const { bookingcollection } = await getCollections();
  const { userId } = req.params;
  const result = await bookingcollection.find({ userId }).toArray();
  res.json(result);
});

app.post('/booking', async (req, res) => {
  const { bookingcollection } = await getCollections();
  const bookingData = req.body;
  const result = await bookingcollection.insertOne(bookingData);
  res.json(result);
});

app.delete('/booking/:bookingId', async (req, res) => {
  const { bookingcollection } = await getCollections();
  const { bookingId } = req.params;
  const result = await bookingcollection.deleteOne({ _id: new ObjectId(bookingId) });
  res.json(result);
});

module.exports = app;