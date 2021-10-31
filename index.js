const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ugc3m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        //make database
        const database = client.db("tourOnBD");
        const servicesCollection = database.collection('services');
        const myOrderCollection = database.collection('myOrders');

        //Get all Services API
        app.get('/services', async (req, res) => {
            const cursor = servicesCollection.find({});
            const services = await cursor.toArray();
            res.send(services);
        });

        // Get Single Service API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            console.log('getting specific service', id);
            const query = { _id: ObjectId(id) };
            const service = await servicesCollection.findOne(query);
            res.json(service);
        })

        //Post Api
        app.post('/addServices', async (req, res) => {
            const service = req.body;
            console.log('hit the post api', service);
            const result = await servicesCollection.insertOne(service);
            console.log(result);
            res.json(result);
        });

        //My Orders Post API
        app.post('/myOrders', async (req, res) => {
            const myOrder = req.body;
            const result = await myOrderCollection.insertOne(myOrder);
            res.json(result);
            console.log(result);
        })

        //My order get api

        // app.get('/myOrder', async (req, res) => {
        //     const email = req.query.email;
        //     const query = { email: "tasnimsumaiya07@gmail.com" };
        //     const cursor = myOrderCollection.find(query);
        //     const myOrder = await cursor.toArray();
        //     res.send(myOrder);
        // })

        // app.get('/myOrder/:email', (req, res) => {
        //     myOrderCollection.find({ email: req.params.email })
        //         .toArray((err, documents) => {
        //             res.send(documents);
        //         })
        // })

        app.get("/myOrder/:email", async (req, res) => {
            const result = await myOrderCollection
                .find({
                    email: req.params.email
                })
                .toArray();
            res.send(result);
        });

        //Delete API
        // app.delete('/myOrder/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await myOrderCollection.deleteOne(query);
        //     console.log('deleting user with id', result);

        //     res.json(result);
        // })

        app.delete('/myOrder/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await myOrderCollection.deleteOne(query);

            console.log('deleting user with id ', result);

            res.json(result);
        })

        // app.get("/myOrder", async (req, res) => {
        //     const result = await myOrderCollection
        //         .find({
        //             email: req.params.email
        //         })
        //         .toArray();
        //     res.send(result);
        // });

    }


    finally {
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running Tourism Server');
});


app.listen(port, () => {
    console.log('Running Tour On BD Server on port', port);
})
