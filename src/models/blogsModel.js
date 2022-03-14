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

    tags:[String],

    category: {
        type: String,
        required: true,
        enum: ["technology", "entertainment", "life style", "food", "fashion"]
    },
    subcategory: {
        type: [String],
        required: true,

        // examples[technology-[web development, mobile development,  AI,ML etc]],
        // enum:["web development", mobile development,  AI,ML etc]
        //  
    },
    publishedAt: {
        type: String

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


// {
//     "title": "How to win friends",
//     "body": "Blog body",
//     "tags": ["Book", "Friends", "Self help"],
//     "category": "Book",
//     "subcategory": ["Non fiction", "Self Help"],
//     "published": false,
//     "publishedAt": "", // if published is true publishedAt will have a date 2021-09-17T04:25:07.803Z
//     "deleted": false,
//     "deletedAt": "", // if deleted is true deletedAt will have a date 2021-09-17T04:25:07.803Z,
//     "createdAt": "2021-09-17T04:25:07.803Z",
//     "updatedAt": "2021-09-17T04:25:07.803Z",
//   }
// // String, Number
// // Boolean, Object/json, array