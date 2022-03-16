const { count } = require("console")
const BlogModel = require("../models/blogsModel")
const authorModel = require("../models/authorModel")
const { findByIdAndUpdate } = require("../models/authorModel")
const moment = require('moment')



const createBlog = async function (req, res) {
    try {
        let data = req.body
        let authorId = req.body.authorId



        if (Object.keys(data).length != 0) {


            let author = await authorModel.findById(authorId)

            if (!author) res.satus(404).send({ msg: "author with this id is not valid" })

            let savedData = await BlogModel.create(data)
            //console.log(savedData)
            res.status(201).send({ status: true, data: savedData })
        }
        else res.status(400).send({ msg: "BAD REQUEST" })
    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })

    }
}

const getData = async function (req, res) {
    try {
        let authorId = req.query.authorId;
        if (!authorId) { return res.status(400).send({ status: false, msg: "Bad request authorId is must" }) }
        let { category, tags, subcategory } = req.query;

        // console.log(tags)
        // console.log(category)

        if (!category && !tags && !subcategory && authorId ) {
            let data = await BlogModel.find({$or:[{ isDeleted: false, isPublished: true },{isDeleted:false, authorId:authorId } ]})

            
            if (data.length <= 0) {
                return res.status(404).send({ status: false, msg: "Data Not Found" })
            }
            return res.status(200).send({ status: true, msg: data })
        }

        let data = await BlogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }, { $or: [{ authorId: authorId, isDeleted: false }, { category: category }, { tags: tags }, { subcategory: subcategory }] }] })
        console.log("second Api")
        // we are showing unpublished data to it's author because author can see it's own Both published and unpublished data
        let data1 = await BlogModel.find({ authorId: authorId, isPublished: false })
        if (data.length <= 0 && data1.length <= 0) {
            return res.status(404).send({ status: false, masg: "sorry we couldn't find releted data" })
        }
        res.status(200).send({ status: true, msg: data, data1 })
    } catch (err) {
        //console.log("This is the error :", err.message)
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
            let tsobject = await BlogModel.findOne({ _id: blogId , isDeleted:false})
            if (!tsobject) { return res.status(404).send({ status: false, msg: "data is not Found" }) }
            if (tags) {

                let ptags = tsobject.tags
                tags = [...ptags, ...tags]
                tags = tags.filter((val, index, arr) => arr.indexOf(val) == index)
                req.body.tags = tags;


            }
            if (subcategory) {
                let psubcategory = tsobject.subcategory;
                subcategory = [...psubcategory, ...subcategory];
                subcategory = subcategory.filter((val, index, arr) => arr.indexOf(val) == index)
                req.body.subcategory = subcategory

            }

        }
        let blogData = req.body
        // console.log(blogData)
        await BlogModel.updateOne({ _id: blogId, isDeleted: false }, blogData)

        let blogsCollection = await BlogModel.find({ _id: blogId })

        if (!blogsCollection) { return res.status(404).send({ status: false, msg: "Data is Not Found" }) }
        
        res.status(200).send({ status: true, msg: blogsCollection })
    } catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}



const deleteBlog = async function (req, res) {
    try {
        let blogId = req.params.blogId
        
        if (!blogId) {
            res.status(400).send({ status: false, msg: "blogId is required, BAD REQUEST" })
        }
        let blogDetails = await BlogModel.find({ _id: blogId, isDeleted: false })
        
        if (blogDetails.length <= 0) {
            res.status(404).send({ status: false, msg: "blog not exist" })
        }
        // blogDetails.isDeleted = true
        let date = moment().format("YYYY-MM-DD[T]HH:mm:ss")

        await BlogModel.findByIdAndUpdate({ _id: blogId }, { isDeleted: true, deletedAt: date }, { new: true })
        res.status(200).send()
        

    }
    catch (error) {
        console.log(error)
        res.send({ msg: error.message })
    }
}








const deleteMultipleFields = async function (req, res) {
    try {
        //Delete blog documents by category, authorid, tag name, subcategory name, unpublished
        // let blogId = req.query.blogId
        let { blogId, authorId, category, tags, subcategory, isPublished } = req.query
        console.log(category)
        if (!req.query) {
            return res.status(400).send({ status: false, msg: "bad request" })
        }

        // let multipleDeletes = await BlogModel.find({ $and: [{ isDeleted: false},{ authorId: authorId }, { $or: [{ blogId: blogId }, { category: category }, { tags: tags }, { subcategory: subcategory }, { isPublished: isPublished }] }] })
        let multipleDeletes = await BlogModel.find({ $and: [{ isDeleted: false, authorId: authorId }, { $or: [{ authorId: authorId }, { blogId: blogId }, { category: category }, { tags: tags }, { subcategory: subcategory }, { isPublished: isPublished }] }] })
       
        if (multipleDeletes.length <= 0) {
            return res.status(404).send({ status: false, msg: "data not found" })
        }
        let date = moment().format("YYYY-MM-DD[T]HH:mm:ss")

        //console.log(multipleDeletes)
        for (let i = 0; i < multipleDeletes.length; i++) {
            let blogId = multipleDeletes[i]._id

            await BlogModel.findByIdAndUpdate(blogId, { $set: { isDeleted: true, deletedAt: date } }, { new: true })

        }

        return res.status(200).send()

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

