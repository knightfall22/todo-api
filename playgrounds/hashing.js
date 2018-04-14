 const {SHA256} = require('crypto-js'),
            jwt = require('jsonwebtoken');

 let data = {
     id:10
 };

 let token = jwt.sign(data, '123abc');
 console.log(`The Encodded Data :${token}`);

 let decode = jwt.verify(token,'123abc');
 console.log(`The Encoded Data`,decode);
 
// let message = 'i am ready to be new again',
//       hash  = SHA256(message).toString();

// // console.log(`The Message: ${message}`);
// // console.log(`The Hash: ${hash}`);

// let data = {
//     id:4
// };

// let token = {
//     data,
//     hash: SHA256(JSON.stringify(data)+ 'somesecret').toString()
// }

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// let returnHash = SHA256(JSON.stringify(token.data)+ 'somesecret').toString();

// if(returnHash === token.hash){
//     console.log('Data was not changed');   
// }else{
//     console.log('Data was Changed');
// }