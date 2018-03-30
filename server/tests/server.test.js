const expect = require('expect'),
        request = require('supertest'),
        {app}   = require('./../server'),
        {Todo}  = require('./../models/todo');

beforeEach((done) => {
    Todo.remove({}).then(() => done())
})

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
                    return done(err)
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done()
                }).catch((e) => e)
            })
    })

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
                    expect(todos.length).toBe(0)
                    done()
                }).catch((e) => e)

            })
    })
})