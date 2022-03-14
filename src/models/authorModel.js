const mongoose = require('mongoose');
const validator = require('validator')

const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
        trim:true
    },
    lname: {
        type: String,
        required: true,
        trim:true
    },
    title: {
        type: String,
        required: true,
        enum: ['Mr', 'Mrs', 'Miss']
    },
    email: {
        type: String,
        required: true,
        unique: true,
        //validate: [ validator.isEmail, 'invalid email' ]
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false //The validator dosn't play well with mongoose to get rid of the warning set isAsync to false


        }
    },
    password: {
        type: String,
        required: true,
    },
    cpassword:{
        type:String,
        required:true
    }

}, { timestamps: true });


// { 
// "fname":"Chetan", 
// "lname": "Bhagat",
//  "title": "Mr",
//  "email": "chetanbagat1432@gmail.com", 
//  "password": "chetudon123",
//  "cpassword": "chetudon123",
//  }

module.exports = mongoose.model('Author', authorSchema) //users
