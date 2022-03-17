const { count } = require("console")
const BlogModel = require("../models/blogsModel")
const authorModel = require("../models/authorModel")
const { findByIdAndUpdate } = require("../models/authorModel")
const moment = require('moment')



const createBlog = async function (req, res) {
    try {
        let data = req.body
        let { title, body, authorId, category, subcategory, isPublished } = req.body
        if (!title || !body || !authorId || !category || !subcategory) { return res.status(400).send({ status: true, msg: "ERROR! : BAD REQUEST please fill all fields" }) }
        if (isPublished == true) {
            let Date = moment().format("YYYY-MM-DD[T]HH:mm:ss")
            req.body.publishedAt = Date

        }

        let author = await authorModel.findById(authorId)

        if (!author) res.satus(404).send({ msg: "author with this id is not valid" })

        let savedData = await BlogModel.create(data)
        //console.log(savedData)
        res.status(201).send({ status: true, data: savedData })


    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })

    }
}

const getData = async function (req, res) {
    try {
        let authorId = req.query.authorId;
        let { title, category, tags, subcategory } = req.query;


        if (!title && !category && !tags && !subcategory && authorId) {
            let data = await BlogModel.find({ $or: [{ isDeleted: false, isPublished: true }, { isDeleted: false, authorId: authorId, isDeleted: false }] })

            if (data.length <= 0) {
                return res.status(404).send({ status: false, msg: "Data Not Found" })
            }
            return res.status(200).send({ status: true, msg: data })
        }


        let data = await BlogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }, { $or: [{ authorId: authorId, isDeleted: false }, { category: category }, { tags: tags }, { subcategory: subcategory }] }] })
        console.log("second Api")

        // we are showing unpublished data to it's author because author can see it's own Both published and unpublished data
        let data1 = await BlogModel.find({ $and: [{ authorId: authorId }, { isPublished: false }, { isDeleted: false }] })




        if (data.length > 0 && data1.length <= 0) {
            res.status(200).send({ status: true, msg: data, your_unpublished_data: "You don't have unpublished data" })
        }
        if (data.length <= 0 && data1.length > 0) {
            res.status(200).send({ status: true, msg: "we don't find given filter data", your_unpublished_data: data1 })
        }

        if (data.length <= 0 && data1.length <= 0) {
            return res.status(404).send({ status: false, masg: "sorry we couldn't find releted data" })
        }
        res.status(200).send({ status: true, msg: data, your_unpublished_data: data1 })



    } catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}




const updateData = async function (req, res) {
    try {
        let blogId = req.params.blogId

        if (!blogId) res.status(400).send({ status: false, msg: "Bad Request" })
        let { isPublished, tags, subcategory } = req.body;
        //console.log(isPublished)
        if (isPublished && isPublished == true) {
            let Date = moment().format("YYYY-MM-DD[T]HH:mm:ss")
            req.body.publishedAt = Date
            //console.log(isPublished)
        }
        // console.log(tags, typeof (tags))
        if (tags || subcategory) {
            // console.log('hello')
            let blogObject = await BlogModel.findOne({ _id: blogId, isDeleted: false })

            if (tags) {

                let dbtags = blogObject.tags
                tags = [...dbtags, ...tags]
                tags = tags.filter((val, index, arr) => arr.indexOf(val) == index)
                req.body.tags = tags;


            }
            if (subcategory) {
                let dbsubcategory = blogObject.subcategory;
                subcategory = [...dbsubcategory, ...subcategory];
                subcategory = subcategory.filter((val, index, arr) => arr.indexOf(val) == index)
                req.body.subcategory = subcategory

            }

        }
        let blogData = req.body

        await BlogModel.updateOne({ _id: blogId, isDeleted: false }, blogData)

        let blogsCollection = await BlogModel.find({ _id: blogId })

        if (!blogsCollection) { return res.status(404).send({ status: false, msg: "Data is Not updated" }) }

        res.status(200).send({ status: true, msg: blogsCollection })

    } catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}



const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId


        await BlogModel.find({ _id: blogId, isDeleted: false })


        // blogDetails.isDeleted = true
        let date = moment().format("YYYY-MM-DD[T]HH:mm:ss")

        const datas = await BlogModel.findByIdAndUpdate({ _id: blogId }, { isDeleted: true, deletedAt: date }, { new: true })
        res.status(200).send()


    }
    catch (error) {
        console.log(error)
        res.send({ msg: error.message })
    }
}








const deleteMultipleFields = async function (req, res) {
    try {

        let data = req.query
        if (!req.query) {
            return res.status(400).send({ status: false, msg: "bad request" })
        }



        //logic if any one field with authorId matches with blog then delete

        // let { blogId, authorId, category, tags, subcategory, isPublished } = req.query
        // //let multipleDeletes1 = await BlogModel.find({$and: [{ isDeleted: false }, {authorId: authorId }, {$or: [ { blogId: blogId }, {category: category }, {tags: tags} , {subcategory: subcategory} , {isPublished: isPublished }] }]})
        // let multipleDeletes1 = await BlogModel.find({$and:[{ isDeleted: false} ,{ authorId : authorId}]})

        // if (multipleDeletes1.length <= 0) {
        //     return res.status(404).send({ status: false, msg: "data not found" })
        // }
        // let date1 = moment().format("YYYY-MM-DD[T]HH:mm:ss")

        // let count1 = 0
        // for(let i=0; i<multipleDeletes1.length; i++){
        //     let M = multipleDeletes1[i];
        //     if(M.blogId ==blogId || M.category==category || M.tags.includes(tags) || M.subcategory.includes(subcategory) || M.isPublished == isPublished){
        //         let ID = multipleDeletes1[i]._id
        //         await BlogModel.findByIdAndUpdate(ID, { $set: { isDeleted: true, deletedAt: date1 } }, { new: true })
        //         count1++
        //     }
        // }
        // if (count1 > 0) {
        //     return res.status(200).send()
        // } else {

        //     return res.status(404).send({ status: false, msg: " there is no such data is found" })

        // }



        // logic if all fields matches with blog then delete 

        let multipleDeletes = await BlogModel.find(data)
        console.log("deleted count", multipleDeletes.length)
        if (multipleDeletes.length <= 0) {
            return res.status(404).send({ status: false, msg: "data not found" })
        }
        let date = moment().format("YYYY-MM-DD[T]HH:mm:ss")

        //console.log(multipleDeletes)
        let count = 0
        for (let i = 0; i < multipleDeletes.length; i++) {
            if (multipleDeletes[i].isDeleted == false) {
                let blogId = multipleDeletes[i]._id
                count++
                await BlogModel.findByIdAndUpdate(blogId, { $set: { isDeleted: true, deletedAt: date } }, { new: true })
            }
        }
        if (count > 0) {
            return res.status(200).send()
        } else {

            return res.status(404).send({ status: false, msg: " there is no such data is found" })

        }





    } catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}











module.exports.createBlog = createBlog
module.exports.getData = getData
module.exports.updateData = updateData
module.exports.deleteBlog = deleteBlog
module.exports.deleteMultipleFields = deleteMultipleFields

