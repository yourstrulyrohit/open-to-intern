const mongoose = require('mongoose');


const collageSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    logoLink: {
        type: String,
        required: true,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        dafault:false
    }
},
    { timestamps: true });



module.exports = mongoose.model('Collage', collageSchema) //colleges
