const mongoose = require('mongoose');
const validator = require('validator')
const ObjectId = mongoose.Schema.Types.ObjectId

const internSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true,
        trim:true
    },
    email: {
        type:String,
        required:true,
        unique:true,
        trim:true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email',
            isAsync: false
         
        }
    },
        mobile: {
            type:String,
            required:true, 
            unique:true
            
            
        },
        collageId: {
           type: ObjectId, 
            ref : "Collage"
        },
        isDeleted: {
            type:Boolean,
             default: false}

}, { timestamps: true });

module.exports = mongoose.model('Intern', internSchema) //interns


     
       