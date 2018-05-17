 require('./config/config');
 
 //3rd party modules
       const express = require('express'),
       bodyParser  = require('body-parser'),
        {ObjectId} = require('mongodb'),
                 _ = require('lodash'),
   //local modules
        {mongoose} = require('../db/mongoose'),
            {Todo} = require('./models/todo'),
            {User} = require('./models/user'),
    {authenticate} = require('./middleware/authenticate');    

    var app = express();

    app.use(bodyParser.json());

    var port = process.env.PORT;

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
//USERS
    app.post('/users',(req,res) => {

        var body = _.pick(req.body, ['email','password']);
        
        var user = new User(body);

        user.save().then(() => {
            return user.generateAuthToken();
        }).then((token) => {
            res.header('x-auth',token).send(user);
        })
        .catch((e) =>  {
            res.status(400).send(e)
        });
    });

   

    app.get('/users/me',authenticate,(req,res) => {
           res.send(req.user);
    })
//USERS /users/login
    app.post('/users/login',(req,res) => {
        let body = _.pick(req.body,['email','password']);

        User.findByCredentials(body.email,body.password).then((user) => {
           return user.generateAuthToken().then((token) => {
                res.header('x-auth', token).send(user);
           })
        }).catch((e) => {
            res.status(400).send(e);
            console.log(e);
            
        })
    })

    app.listen(port,() => {
        console.log(`server started ${port}`);
    });

    module.exports = {app};

