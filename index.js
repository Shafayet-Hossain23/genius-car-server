const express = require('express');
const app = express()
const cors = require('cors');
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb')

require('dotenv').config()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Assalamualikum')
})
const password = process.env.DB_PASSWORD
const username = process.env.DB_USERNAME

const uri = `mongodb+srv://${username}:${password}@cluster0.xazyemr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const userCollection = client.db("genius-car").collection("services");
        const orderCollection = client.db("genius-car").collection("orders")
        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)
        })
        app.get('/service/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await userCollection.findOne(query);
            res.send(result)
            console.log(result)
        })
        app.get('/orders', async (req, res) => {
            let query = {}
            // console.log(req.query.email)
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            // console.log(query)
            const cursor = orderCollection.find(query)
            const result = await cursor.toArray()
            res.send(result)

        })
        app.post('/orders', async (req, res) => {
            const order = req.body
            // console.log(order) 
            const result = await orderCollection.insertOne(order)
            res.send(result)
        })
        app.delete('/order/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query);
            res.send(result)
            console.log(result)
        })
        app.patch('/order/:id', async (req, res) => {
            const id = req.params.id
            const status = req.body.status

            const query = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    status: status
                },
            };
            const result = await orderCollection.updateOne(query, updateDoc);
            res.send(result)
            console.log(result)
        })

    }
    finally {

    }
}
run().catch(error => console.log(error))



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})