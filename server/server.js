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

    app.post('/todos', authenticate ,(req,res) => {
       var todo = new Todo({
           text:req.body.text,
           _creator: req.user._id
       }) 

       todo.save().then((doc) => {
           res.send(doc);
       }, (e) => {
          res.status(400).send(e.errors.text.message);
       })
    })

    app.get('/todos',authenticate,(req,res) => {
        Todo.find({
            _creator:req.user._id
        }).then((todos) => {
            res.send({todos})
        },(e) => {
            res.status(400).send(e)
        })
    });

    app.get('/todos/:id',authenticate,(req,res) => {
        var _id = req.params.id;
        if (!ObjectId.isValid(_id)) {
            return res.status(404).send();
        }
        Todo.findOne({
            _id,
            _creator:req.user._id
        }).then((todos) => {
            if(!todos){
              return res.status(404).send();  
            }
             res.send({todos})  
        },(e) => {
            res.status(400).send();
        })
    });

    app.delete('/todos/:id',authenticate, async (req,res) => {

        try {
            var id = req.params.id;
            //Validate _id
            if (!ObjectId.isValid(id)) {
                return res.status(404).send();
            }
            //Find by the id and remove

            const todo =  await Todo.findOneAndRemove({_id: id,_creator: req.user._id});

            if (!todo) {
                return res.status(404).send();
            }
            res.send({todo});
        } catch (e) {
            res.status(400).send(e);
        }
    //    var id = req.params.id;
    //    //Validate _id
    //    if (!ObjectId.isValid(id)) {
    //        return res.status(404).send();
    //    }
    //    //Find by the id and remove

       

    //    Todo.findOneAndRemove({
    //        _id:id,
    //        _creator:req.user._id
    //     }).then((todo) => {
    //     //Validate if a todo was found
    //         if (!todo) {
    //             return res.status(404).send();
    //         }
    //         res.send({todo});
    //    },(e) => {
    //         return res.status(400).send(e);
    //    })
    })

    app.patch('/todos/:id',authenticate,(req,res) => {
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

        Todo.findOneAndUpdate({
            _id:id,
            _creator:req.user._id
        },{$set:body},{new:true}).then((todo) => {
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
    app.post('/users', async (req,res) => {

        try {
            const body = _.pick(req.body, ['email','password']);
            const user = new User(body);
            await user.save();
            const token = user.generateAuthToken();
            res.header('x-auth', token).send(user);
        } catch (e) {
            res.status(400).send(e);
        }



        // user.save().then(() => {
        //     return user.generateAuthToken();
        // }).then((token) => {
        //     res.header('x-auth',token).send(user);
        // })
        // .catch((e) =>  {
        //     res.status(400).send(e)
        // });
    });

   

    app.get('/users/me',authenticate,(req,res) => {
           res.send(req.user);
    });

    app.post('/users/login',async(req,res) => {
        // const body = _.pick(req.body,['email','password']),


             try {
                const body = _.pick(req.body,['email','password']),
                user = await User.findByCredentials(body.email, body.password),
                token = await user.generateAuthToken();
                res.header('x-auth', token).send(user); 

             } catch (error) {
                res.status(400).send(error);
                console.log(error);
             }

        // User.findByCredentials(body.email,body.password).then((user) => {
        //    return user.generateAuthToken().then((token) => {
        //         res.header('x-auth', token).send(user);
        //    })
        // }).catch((e) => {
        //     res.status(400).send(e);
        //     console.log(e);
            
        // })
    });

    app.delete('/users/me/token', authenticate , async (req,res) => {

        try {
           await req.user.removeToken(req.token);
           res.status(200).send();
        } catch (error) {
            res.status(400).send()
        }

    });

    app.listen(port,() => {
        console.log(`server started ${port}`);
    });

    module.exports = {app};

