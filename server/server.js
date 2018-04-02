   //3rd party modules
   var express = require('express'),
   bodyParser  = require('body-parser'),
   //local modules
    {mongoose} = require('../db/mongoose'),
        {Todo} = require('./models/todo'),
        {User} = require('./models/user');

    var app = express();

    app.use(bodyParser.json());

    app.post('/todos', (req,res) => {
       var todo = new Todo({
           text:req.body.text
       }) 

       todo.save().then((doc) => {
           res.send(doc);
       }, (e) => {
          res.status(400).send(e.errors.text.message);
       })
    })

    app.get('/todos',(req,res) => {
        Todo.find().then((todos) => {
            res.send({
                todos})
        },(e) => {
            res.status(400).send(e)
        })
    })

    app.listen(4000,() => {
        console.log('server started');
    });

    module.exports = {app};

