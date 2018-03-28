const { MongoClient, ObjectId } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Cannot connect to mongo servers', err);
    }
    console.log('Accessing db');

    // db.collection('Todo').findOneAndUpdate({
    //     _id: new ObjectId('5ab953825aa7f11775f6522a')
    // },{
    //     $set : {
    //         completed:true
    //     }
    // },{
    // returnOriginal:false}).then((res) => {
    //     console.log(JSON.stringify(res,undefined,2));
    // })


    db.collection('user').findOneAndUpdate({
        _id: new ObjectId("5abb399917538f2dc8271f66")
    },{
        $set:{
          name:'garvey'
        },
        $inc: {
           age: 1
         }
    },{
        returnOriginal:false
    }).then((res) => {
        console.log(JSON.stringify(res, undefined, 2));
    })

    // db.collection('user').insertOne({
    //     name:'pelumi',
    //     age:17,
    //     location:'ibadan'
    // }).then((res) => {
    //     console.log(JSON.stringify(res, undefined, 2));
    //     db.close();
    // },(err) => {
    //     console.log('Insertion Failed',err)
    // })

    // db.close()
});