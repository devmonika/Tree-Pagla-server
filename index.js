const express = require('express')
const app = express();
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const port = process.env.PORT || 3001;



app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.h5guxah.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
      const serviceCollection = client.db('treepagla').collection('services');
      const reviewsCollection = client.db('treepagla').collection('reviews');
      // console.log(serviceCollection);
      app.get('/services', async(req, res) =>{
        const query = {}
        const cursor = serviceCollection.find(query);
        const services = await cursor.toArray();
        // console.log(services);
        res.send(services);
      });
      app.get('/services/:id', async(req, res) => {
        const id = req.params.id;
        const query = {_id:ObjectId(id)};
        const service = await serviceCollection.findOne(query);
        res.send(service);
      });

      app.post('/addservices', async(req, res) =>{
        const addService = req.body;
        const result = await serviceCollection.insertOne(addService);
        res.send(result);
      });

      //adding review
      app.get('/myreview', async(req, res) =>{
        // console.log(req.query.email);
        let query = {};
        if(req.query.email){
          query = {
            user_email:req.query.email
          }
        }
        const cursor = reviewsCollection.find(query);
        const review = await cursor.toArray();
        // console.log(review);
        res.send(review);
      });
      
      app.get('/addreview', async(req, res) =>{
        const query = {}
        const cursor = reviewsCollection.find(query);
        const review = await cursor.toArray();
        // console.log("dfgjhgkjlh"); 
        res.send(review);
      });
      app.post('/addreview', async(req, res) =>{
        const review = req.body;
        const result = await reviewsCollection.insertOne(review);
        res.send(result);
      });
      app.get('/reviews', async(req, res) =>{
        const serviceId = req.query.id;
        const query= {detailsService_id:serviceId};
        const reviews =await reviewsCollection.find(query).limit(5).toArray();
        res.send(reviews);

      });

      app.patch('/myreview/:id', async(req, res) =>{
        const id = req.params.id;
        const message = req.body;
        const query ={ _id:ObjectId(id)};
        const updatedDoc ={
          $set:{
            message: message.message
          
          }
          
        }
        console.log(message.message)
        const result = await reviewsCollection.updateOne(query, updatedDoc);
        res.send(result);
      });


      app.delete('/myreview/:id', async(req, res) =>{
        const id = req.params.id;
        const query ={ _id:ObjectId(id)};
        const result = await reviewsCollection.deleteOne(query);
        res.send(result);
      });

    }
    finally{

    }
}
run().catch(err=>console.error(err));



app.get('/', (req, res) => {
    res.send('data')
  });

app.listen(port, () =>{
    console.log('treepagla server')
  })