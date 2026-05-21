// const dns = require("node:dns");
// dns.setServers(["8.8.8.8", "8.8.4.4"]);

const express = require('express')
const cors = require('cors');
const app = express()
const dotenv = require('dotenv');
dotenv.config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = process.env.MONGODB_URI;
const port = process.env.PORT

console.log("PORT:", process.env.PORT);
console.log("URI:", process.env.MONGODB_URI);


app.use(cors());
app.use(express.json());

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});



async function run() {
  try {
    await client.connect();


    const db = client.db("drivefleet");
    const addedcarscollection = db.collection("addedcars");
    const bookingcollection = db.collection("booking");


    app.get('/add-car', async (req, res) => {
      // const result = await addedcarscollection.find().toArray()
      // res.json(result);
      const result = await addedcarscollection.find().toArray();
      res.json(result);
    })


    app.post('/add-car', async (req, res) => {
      const carData = req.body;
      console.log(carData);
      const result = await addedcarscollection.insertOne(carData);


      res.json(result);

    })

    app.get('/add-car/:id', async (req, res) => {
      const { id } = req.params

      const result = await addedcarscollection.findOne({ _id: new ObjectId(id) });
      res.json(result);
    })

    app.patch('/add-car/:id', async (req, res) => {
      const { id } = req.params;
      const updateData = req.body;
      console.log("Update Result:", updateData);

      const result = await addedcarscollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updateData }
      );

      res.json(result);
    })

    app.delete('/add-car/:id', async (req, res) => {
      const { id } = req.params;

      const result = await addedcarscollection.deleteOne({ _id: new ObjectId(id) });
      res.json(result);
    })

    app.get('/booking/:userId', async (req, res) => {
      const { userId } = req.params
      const result = await bookingcollection.find({ userId: userId }).toArray();
      res.json(result);
    })

    app.post('/booking', async (req, res) => {
      const bookingData = req.body;
      console.log(bookingData);
      const result = await bookingcollection.insertOne(bookingData);

      res.json(result);

    })

    app.delete('/booking/:bookingId', async (req, res) => {
      const { bookingId } = req.params

      const result = await bookingcollection.deleteOne({ _id: new ObjectId(bookingId) });
      res.json(result);
    })




    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  }
  finally {
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('DriveFleet')
})

// app.listen(port, () => {
//   console.log(`Server running on port ${port}`)
// })
module.exports = app;
