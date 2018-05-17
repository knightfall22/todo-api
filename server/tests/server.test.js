   const expect = require('expect'),
        request = require('supertest'),
          {app} = require('./../server'),
     {ObjectId} = require('mongodb'),
         {Todo} = require('./../models/todo'),
         {User} = require('../models/user'),
        {todos,populateTodos,users,populateUsers} = require('./seed/seed');
       


beforeEach(populateTodos);
beforeEach(populateUsers);



describe('POST/todo', () => {
    it('should create a new todo',(done) => {
        
        var text = 'Buy roses';
        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e))
            })
    });

    it('Should not create a todo with invalid body data',(done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err,res) => {
                if (err) {
                   return done(err) 
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2)
                    done()
                }).catch((e) => done(e))

            })
    })
});

describe('GET/ todos',() => {
    it('Should get all todos', (done) => {
        request(app)
          .get('/todos')
          .expect(200)
          .expect((res) => {
                expect(res.body.todos.length).toBe(2)
          })
          .end(done)
    })
});

describe('GET /todos/:id',() => {
    it('Should get a todo',(done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.text).toBe(todos[0].text)
            })
            .end(done)

    });

    it('Should return 404 if todo not found',(done) =>{
        var _id = new ObjectId();
        request(app)
            .get(`/todos/${_id.toHexString()}`)
            .expect(404)
            .end(done)
    });

    it('Should return 404 for non-objectId todos',(done) => {
        var _id = 123;
        request(app)
            .get(`/todos/${_id}`)
            .expect(404)
            .end(done)
    })
});

describe('DELETE /todos/:id',() => {
    it('Should delete a todo',(done) => {
        var hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId }`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(hexId).then((todo) => {
                    expect(todo).toNotExist;
                    done();
                }).catch((e) => done(e))
            })

    });

     it('Should return 404 if todo not found',(done) => {
         var _id = new ObjectId()
         request(app)
             .delete(`/todos/${_id}`)
             .expect(404)
             .end(done)
     });

     it('Should return 404 for non-objectId todos', (done) => {
         var _id = 123;
         request(app)
             .delete(`/todos/${_id}`)
             .expect(404)
             .end(done)
     });
});

describe('PATCH /todos/:id',() => {
    it('Should update todo',(done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
           .send({
               text:'Updated text',
               completed:true
            })
            .expect((res) => {
                expect(res.body.todo.completedAt).toNumber;
                expect(res.body.todo.completed).toBe(true);
            })
            .expect(200)
            .end(done);
    });

    it('Should clear completeAt when todo is is not complete',(done) => {
        var hexId = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send({
                text: 'Updated text',
                completed: false
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completedAt).toNotExist;
               
                expect(res.body.todo.completed).toBe(false);
            })
            .end(done)
    });
    it('Should return 404 if todo not found', (done) => {
        var _id = new ObjectId()
        request(app)
            .patch(`/todos/${_id}`)
            .expect(404)
            .end(done)
    });

    it('Should return 404 for non-objectId todos', (done) => {
        var _id = 123;
        request(app)
            .patch(`/todos/${_id}`)
            .expect(404)
            .end(done)
    });

});

describe('GET /users/me',() => {
    it('Should return a user if it is authenticated',(done) => {
        request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done)
    })

    it('Should return a 404 if not authenticated',(done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toBeEmpty;
            })
            .end(done)
    })
})

describe('POST /users',() => {
    it('Should create a new user',(done) => {
        let email = 'velo@gmail.com',
         password = 'pelumi11';

         request(app)
            .post('/users')
            .send({email,password})
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);

            })
            .end((err) => {
                if (err) {
                    done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user).toExist();
                    expect(user.password).toNotBe(password);
                    done();
                }).catch((e) => done(e))
            })
    });

    it('Should return a validation error if request is invalid',(done) => {
        let email = '[[[@gmail.com',
        password  = true;
        request(app)
            .post('/users')
            .send({email,password})
            .expect(400)
            .end(done)  
    });

    it('Should not create user if email in use',(done) => {
        let email = users[0].email;
        request(app)
            .post('/users')
            .send({email,password:'123'})
            .expect(400)
            .end(done);
    })
});

describe('POST /users/login',() => {
    it('Should login user and return auth token',(done) => {
        request(app)
            .post('/users/login')
            .send({
                email:users[1].email,
                password:users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err,res) => {
              if(err){
                  return done(err);
              } 
              
              User.findById(users[1]._id).then((user) => {
                expect(user.tokens[0]).toInclude({
                    access:'auth',
                    token:res.header['x-auth']
                });
                done();
              }).catch((e) => done(e))
            })
    });
    it('Should reject invalid login',(done) => {
             request(app)
            .post('/users/login')
            .send({
                email:users[1].email,
                password: 'Shiba'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err,res) => {
              if(err){
                  return done(err);
              } 
              
              User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(0)
                done();
              }).catch((e) => done(e))
            })
    })
})