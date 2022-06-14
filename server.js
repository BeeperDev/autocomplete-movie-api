const express = require('express')
const app = express()
const cors = require('cors')
const {MongoClient, ObjectId} = require('mongodb')      // setting up ObjectId because we have to grab it from documents in db     
const PORT = 8000
require('dotenv').config()                              // obscure .env files


// declare variables
let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'sample_mflix',
    collection

MongoClient.connect(dbConnectionStr)                    //connect to the db
    .then(client => {
        console.log(`Connected to db!`)
        db = client.db(dbName)                          // set the name of the db = 'sample_mflix'
        collection = db.collection('movies')            // set the name of the specific collection 'movies'
    })

// enable middleware
app.use(cors())                                         // enable cors
app.use(express.urlencoded({extended: true}))           // Hey express, read some urls
app.use(express.json())                                 // Hey express, get ready to parse some json


app.get('/search', async (request, response) => {       //Hey Mongo, search the db for me
    try{
        let result = await collection.aggregate([       // await some results and aggregate into an array (take a group of things and bundle them together)
            {
                "$search": {                        // passing in a search
                    "autocomplete": {
                        "query": `${request.query.query}`,  //passing in a specific query
                        "path": "title",           // search within the 'title' property
                        "fuzzy": {                  // type of search
                            "maxEdits": 2,          // user can make up to two spelling errors
                            "prefixLength": 3       // user must type in at least 3 letters before autocomplete
                        }
                    }
                }
            }
        ]).toArray()                                // return db response into an array   
        response.send(result)                       // the response will be the result of the search query
    }catch (error) {
        response.status(500).send({message: error.message})
    }                                                 
})
// this GET will only run when I click on a title that results in the query list
app.get('/get/:id', async (request, response) => {
    try{
        let result = await collection.findOne({     // Hey mongoDB, find one item please
            "_id" : ObjectId(request.params.id)     // id of a db object id
        })
        response.send(result)
    }catch (error) {
        response.status(500).send({message: error.message})
    } 
})



app.listen(process.env.PORT || PORT , () => {
    console.log('Server is running!')
})