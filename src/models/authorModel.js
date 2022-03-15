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
        minlength:[8, "length is shorter than the minimum allowed length (8)."]
    },
    cpassword:{
        type:String
        
    }

}, { timestamps: true });



module.exports = mongoose.model('Author', authorSchema) //users
