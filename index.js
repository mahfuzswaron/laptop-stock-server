const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
// const laptops = require("./api/laptops");
const express = require('express');
require('dotenv').config();
const cors = require('cors')
const app = express()
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@laptop-stock-cluster.lbnux.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri);
const laptopsCollection = client.db('laptop-db').collection('laptops');
const blogsCollection = client.db('blogs-db').collection('blogs');
// console.log(laptopsCollection);
module.exports = laptopsCollection;

const run = async () => {
  try {

    await client.connect();

    // get all inventories
    app.get('/laptops', async (req, res) => {
      const cursor = laptopsCollection.find({});
      const laptops = await cursor.toArray();
      res.send(laptops);
    })
    // app.use("/api/laptops", laptops)

    // get blogs
    app.get('/blogs', async (req, res) => {
      const cursor = blogsCollection.find({});
      const blogs = await cursor.toArray();
      res.send(blogs)
    })

    // get inventory by id
    app.get('/laptops/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const laptop = await laptopsCollection.findOne(query);
      res.send(laptop)
    })

    // add new inventory
    app.post('/laptops/addnew', async (req, res) => {
      const newInventory = req.body;
      const cursor = await laptopsCollection.insertOne(newInventory);
      res.send(cursor)
    })

    // update quantity and sold
    app.put('/laptop/update', async (req, res) => {
      const id = req.query.id;
      const updatedData = req.body;
      const updatedDoc = {
        $set: updatedData
      }
      const filter = { _id: ObjectId(id) };
      const result = await laptopsCollection.updateOne(filter, updatedDoc, { upsert: true });
      res.send(result)
    })

    //  delete single inventory
    app.post('/laptop', async (req, res) => {
      const id = req.query.id;
      const query = { _id: ObjectId(id) }
      const result = await laptopsCollection.deleteOne(query);
      res.send(result)
    })


  }
  finally {

  }
}

run().catch(e => console.log(e))

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})