const {ObjectId} = require('mongodb'),
      {mongoose} = require('../../.././db/mongoose'),
          {Todo} = require('../.././models/todo'),
          {User} = require('../.././models/user'),
            jwt  = require('jsonwebtoken');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const users = [{
    _id: userOneId,
    email: 'pelumi066@gmail.com',
    password: 'userpass21@',
    tokens: [{
        access:'auth',
        token: jwt.sign({_id:userOneId.toHexString(),access:'auth'},'abc123').toString()
    }]
},
{
    _id:userTwoId,
    email:'Squeeeeeps@gmai.com',
    password: 'user2pass@'
}]

const todos = [{
    _id: new ObjectId(),
    text: 'buy flowers',
    completed: true,
    completedAt: new Date().getTime()
}, {
    _id: new ObjectId(),
    text: 'buy new tv',
    completed: false,

}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos)
    }).then(() => {
        return done();
    })
}

const populateUsers = (done) => {
    User.remove({}).then(() => {
        let userOne = new User(users[0]).save(),
            userTwo = new User(users[1]).save();

       return Promise.all([userOne,userTwo])
    }).then(() => done())
}
module.exports = {todos,populateTodos,users,populateUsers};