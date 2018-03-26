// const MongoClient = require('mongodb').MongoClient;
const {MongoClient,ObjectID} = require('mongodb');

// var id = new ObjectID();



MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
    if (err) {
        return console.log('Unable to connect to MongoDb server');
    }
    console.log('Connected to MongoDb server');
    
    // db.collection('Todo').insertOne({
    //     text:'Something to do',
    //     completed:false
    // },(err,result) => {
    //     if (err) {
    //         return console.log('Unable to insert todos',err);
    //     }
    //     console.log(JSON.stringify(result.ops,undefined,2));
        
    // })
    // db.collection('user').insertOne({
    //     name:'pelumi',
    //     age:17,
    //     location:'ibadan'
    // },(err,result) => {
    //     if (err) {
    //         return console.log('Unable to insert user',err);    
    //     }
    //     console.log(JSON.stringify(result.ops[0]._id.getTimestamp(),undefined,2));
        
    // })

    db.close();
    
})