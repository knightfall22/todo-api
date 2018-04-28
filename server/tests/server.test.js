   const expect = require('expect'),
        request = require('supertest'),
          {app} = require('./../server'),
     {ObjectId} = require('mongodb'),
         {Todo} = require('./../models/todo'),
        {todos,populateTodos,users,populateUsers} = require('./seed/seed');
       



beforeEach(populateUsers);



describe('POST/todo',() => {
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
                expect(res.body.todo.text).not.toBe(todos[1].text)
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
                expect(res.body.todo.text).not.toBe(todos[1].text)
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