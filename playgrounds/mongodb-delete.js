const { MongoClient, ObjectId } = require('mongodb');


MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Cannot connect to mongo servers', err);
    }
    console.log('Accessing db');

    //delete many 

    // db.collection('Todo').deleteMany({ text: "Read x-men" }).then((result) => {
    //     console.log(result);
    // });

    //deleteOne

    // db.collection('Todo').deleteOne({ text: "Read batman" }).then((result) => {
    //     console.log(result);
    // });

     //findOneAndDelete
    // db.collection('Todo').findOneAndDelete({completed:false}).then((result) => {
    //     console.log(result);
        
    // })

    //////////////
    //CHALLENGE//
    ////////////

    // db.collection('user').deleteMany({name:'pelumi'}).then((result) => {
    //     console.log(result);
    // })

    db.collection('user').findOneAndDelete({ _id: new ObjectId("5ab868b7b8ba78181864f667")}).then((result) => {
        console.log(JSON.stringify(result,undefined,2));
        
    });



    // db.close()
});