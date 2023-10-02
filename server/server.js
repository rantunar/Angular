const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');
const mongodb = require('mongodb')
const ObjectId = require('mongodb').ObjectId;
const MongoClient = mongodb.MongoClient

const connectionURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'devs'

const PORT = 3000;

const app = new express();
app.use(bodyparser.json());
app.use(cors());

app.post("/enroll", function(req,res) {
    console.log(req.body);
    const cl = new MongoClient(connectionURL);
    async function run() {
      try {
        const client = await cl.connect();
        const dbs = client.db(databaseName);
        const coll = dbs.collection("users");

        const rest = await coll.insertOne(req.body);
        res.send(rest);
      } catch (ex) {
        console.log("Error: " + ex);
      } finally {
        await cl.close();
      }
    }
    run().catch(console.dir);
});

app.get("/retrieve", (req,res)=>{
    const cl = new MongoClient(connectionURL);
    async function run() {
      try {
        const client = await cl.connect();
        const dbs = client.db(databaseName);
        const coll = dbs.collection("users");

        const cur = coll.find({}, {});

        let items = [];
        await cur.forEach(function(doc){
          items.push(doc);
        });
        res.send(items);
      } catch (ex) {
        console.log("Error: " + ex);
      } finally {
        await cl.close();
      }
    }
    run().catch(console.dir);
});

app.put("/update/:id", (req,res)=>{
    const cl = new MongoClient(connectionURL);
    async function run() {
      try {
        const client = await cl.connect();
        const dbs = client.db(databaseName);
        const coll = dbs.collection("users");

        var myquery = { '_id':new ObjectId(req.params.id) };
        var newvalues = { $set: req.body };
        const rst = await coll.updateOne(myquery, newvalues, {}); 
        res.send({"Updated": rst.modifiedCount});
      } catch (ex) {
        console.log("Error: " + ex);
      } finally {
        await cl.close();
      }
    }
    run().catch(console.dir);
});

app.delete("/delete/:id", (req,res)=>{
    const cl = new MongoClient(connectionURL);
    async function run() {
      try {
        const client = await cl.connect();
        const dbs = client.db(databaseName);
        const coll = dbs.collection("users");

        var myquery = { '_id':new ObjectId(req.params.id) };
        const rst = await coll.deleteOne(myquery); 
        res.send({"Deleted": rst.deletedCount});
      } catch (ex) {
        console.log("Error: " + ex);
      } finally {
        await cl.close();
      }
    }
    run().catch(console.dir);
});

app.listen(PORT, function(){
    console.log("Server running on port : "+PORT);
});
