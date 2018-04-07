   //3rd party modules
   var express = require('express'),
   bodyParser  = require('body-parser'),
    {ObjectId} = require('mongodb'),
             _ = require('lodash'),
   //local modules
    {mongoose} = require('../db/mongoose'),
        {Todo} = require('./models/todo'),
        {User} = require('./models/user');

    var app = express();

    app.use(bodyParser.json());

    var port = process.env.PORT || 3000;

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
    });

    app.get('/todos/:id',(req,res) => {
        var _id = req.params.id;
        if (!ObjectId.isValid(_id)) {
            return res.status(404).send();
        }
        Todo.findById({_id}).then((todos) => {
            if(!todos){
              return res.status(404).send();  
            }
             res.send({todos})  
        },(e) => {
            res.status(400).send();
        })
    });

    app.delete('/todos/:id',(req,res) => {
       var id = req.params.id;
       //Validate _id
       if (!ObjectId.isValid(id)) {
           return res.status(404).send();
       }
       //Find by the id and remove
       Todo.findByIdAndRemove(id).then((todo) => {
        //Validate if a todo was found
            if (!todo) {
                return res.status(404).send();
            }
            res.send({todo});
       },(e) => {
            return res.status(400).send(e);
       })
    })

    app.patch('/todos/:id',(req,res) => {
        var id = req.params.id;
        var body = _.pick(req.body, ['text','completed']);

        //Validate _id
        if (!ObjectId.isValid(id)) {
            return res.status(404).send();
        }

        if (_.isBoolean(body.completed) && body.completed) {
            body.completedAt = new Date().getTime(); 
        }else{
            body.completed = false;
            body.completedAt = null;
        }

        Todo.findByIdAndUpdate(id,{$set:body},{new:true}).then((todo) => {
            if(!todo){
                return res.status(404).send();
            }
            res.send({todo});
            console.log(todo);
        }).catch((e) => {
            return res.status(400).send(e);
        })
    })


    app.listen(port,() => {
        console.log('server started');
    });

    module.exports = {app};

