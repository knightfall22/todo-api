const mongoose = require('mongoose'),
     validator = require('validator'),
          jwt  = require('jsonwebtoken'),
            _  = require('lodash');

let UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
   tokens: [{
       access: {
           type:String,
           required:true
       },
       token: {
           type:String,
           required:true
       }
   }]
});

UserSchema.methods.toJSON = function () {
    var user = this;
    var userObject = user.toObject();

   return  _.pick(userObject,['_id','email']);
    
}

UserSchema.methods.generateAuthToken = function () {
    let user = this,
      access = 'auth',
      token  = jwt.sign({_id: user._id.toHexString(),access}, 'abc123').toString();
     
    user.tokens.push({access,token});

    return user.save().then(()=> {
        return token
    })
}

let User = mongoose.model('User', UserSchema);

// var newUser = new User({
//     email: ' pelumi@gmail.com  '
// });

// newUser.save().then((res) => {
//     console.log(res)
// }, (e) => {
//     console.log(e);

// })

module.exports = {User};