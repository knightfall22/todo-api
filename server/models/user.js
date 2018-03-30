var mongoose = require('mongoose');

var User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        trim: true,
        minLength: 1
    }
})

// var newUser = new User({
//     email: ' pelumi@gmail.com  '
// });

// newUser.save().then((res) => {
//     console.log(res)
// }, (e) => {
//     console.log(e);

// })

module.exports = {User}