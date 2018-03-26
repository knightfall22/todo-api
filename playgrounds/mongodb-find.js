const {MongoClient,ObjectId} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db) => {
    if (err) {
        return console.log('Cannot connect to mongo servers',err);
    }
    console.log('Accessing db');
    
//     db.collection('Todo').find({ 
//         _id: new ObjectId("5ab84b4247cf2e2e80756df0")
// }).toArray().then((docs) =>{
//         console.log('Todos');
//         console.log(JSON.stringify(docs,undefined,2));
        
//     },(err) => {
//         console.log('Unable to fetch todos',err);
        
//     })

    // db.collection('Todo').find().count().then((count) => {
    //     console.log(`Todos Count: ${count}`);
    // }, (err) => {
    //     console.log('Unable to fetch todos', err);

    // })

    db.collection('user').find({name:'pelumi'}).count().then((count) => {
        console.log(`Users count: ${count}`);
    },(err) => {
        console.log('Error accesing user db, terminating intruders',err);
        
    })

    // db.close()
});