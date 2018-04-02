const {ObjectId} = require('mongodb'),
      {mongoose} = require('./../db/mongoose'),
          {Todo} = require('./../server/models/todo'),
          {User} = require('./../server/models/user');

// var id = '5abfb1f91b1bb30438c0886011';
var userId = '5abb46aa2b3fe5374083cdbe';

// if(!ObjectId.isValid(id)){
//     console.log('Id not valid');
    
// }

// Todo.find({
//     _id:id
// }).then((todos) => {
//     console.log('Todos:',todos); 
// })
// Todo.findOne({
//     _id: id
// }).then((todo) => {
//     console.log('Todo:',JSON.stringify(todo,undefined,2));
// })

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//     console.log('Todo By Id:', JSON.stringify(todo, undefined, 2));
// }).catch((e) => console.log(e))

User.findById({
    _id:userId
}).then((user) => {
    if (!user) {
      return console.log('No user found!!!!')  
    }
    console.log(JSON.stringify(user,undefined,2));
}).catch((e) => console.log(e))