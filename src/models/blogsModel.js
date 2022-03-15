const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const blogsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true,
        maxlength: 500
    },
    authorId: {
        type: ObjectId,
        ref: 'Author',
        required: true,
    },

    tags:[{
        type:String
    }],

    category: {
        type: String,
        required: true,
        enum: ["technology", "entertainment", "life style", "food", "fashion"]
    },
    subcategory: {
        type: [String],
        required: true,

        
    },
    publishedAt: {
        type: String,
        default:''
    },

    isPublished: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: String

    },
    isDeleted: {
        type: Boolean,
        default: false
    }


}, { timestamps: true });

module.exports = mongoose.model('Blog', blogsSchema) //users

