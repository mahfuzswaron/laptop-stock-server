const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config();
const cors = require('cors')
const app = express()
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@laptop-stock-cluster.lbnux.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri);
const laptopsCollection = client.db('laptop-db').collection('laptops')

const run = async() =>{
          try{

              await client.connect();

              //get all inventories
              app.get('/laptops', async(req, res)=>{
                  const cursor =  laptopsCollection.find({});
                  const laptops = await cursor.toArray();
                  res.send(laptops);
              })

              // get inventory by id
              app.get('/laptops/:id', async(req, res)=>{
                const id = req.params.id;
                const query = {_id: ObjectId(id)};
                const laptop = await laptopsCollection.findOne(query);
                console.log(laptop)
                res.send(laptop)
              })

              // add new inventory
              app.put('/laptops/addnew', async(req, res)=>{
                const newInventory = req.body;
                console.log(newInventory);
              })
          }
          finally{

          }
}

run().catch(e => console.log(e))

app.get('/', (req, res) => {
    res.send('Hello World!')
  })
  
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })