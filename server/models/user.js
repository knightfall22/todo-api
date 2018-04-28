const mongoose = require('mongoose'),
     validator = require('validator'),
          jwt  = require('jsonwebtoken'),
            _  = require('lodash'),
      bcryptjs = require('bcryptjs');

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
    let user = this;
    let userObject = user.toObject();

   return  _.pick(userObject,['_id','email']);
    
}


UserSchema.methods.generateAuthToken = function () {
    let user = this,
      access = 'auth',
      token  = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
    //   token  = jwt.sign({_id:user._id.toHexString(),access},'abc123').toString();
      user.push({access,token});

      return user.save().then(() => {
          return token;
      })
    
    // user.tokens.push({access,token})

    // return user.save().then(() => {
    //     return token;
    // })
     

}

UserSchema.statics.findByToken = function (token) {
    let User = this,
        decoded;
    try {
        decoded = jwt.verify(token,'abc123');
    } catch (e) {
        // return new Promise((resolve,reject) => {
        //     reject();
        // })
        return Promise.reject(); 
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token':token,
        'tokens.access':'auth'
    })
};

UserSchema.pre('save', function (next){
    let user = this;
    if(user.isModified('password')) {
        bcryptjs.genSalt(10,(err,salt) => {
            bcryptjs.hash(user.password,salt, (err,hash) => {
                user.password = hash;
                next();
            })
        })
    }
    else{
        next();
    }
    
})

let User = mongoose.model('User', UserSchema);

// let newUser = new User({
//     email: ' pelumi@gmail.com  '
// });

// newUser.save().then((res) => {
//     console.log(res)
// }, (e) => {
//     console.log(e);

// })

module.exports = {User};