const { ObjectId } = require('mongodb'),
      { mongoose } = require('./../db/mongoose'),
          { Todo } = require('./../server/models/todo'),
          { User } = require('./../server/models/user');


// Todo.remove({}).then((res) => {
//     console.log(res);
// })

Todo.findOneAndRemove({
    _id: new ObjectId("5ac61622bce7a35643e5c8b5")
}).then((res) => {
    console.log(res);
})

// Todo.findByIdAndRemove({
//    "5ac61622bce7a35643e5c8b5"
// }).then((res) => {
//     console.log(res); 
// })