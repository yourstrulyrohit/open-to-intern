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
            if (!authorId) { res.send({ msg: "author id must provided." }) }
            let id = req.body.author
            let author = await authorModel.findById(id)

            if (!author) res.send({ msg: "author id not valid" })

            let savedData = await BlogModel.create(data)
            console.log(savedData)
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
        let category = req.query.category;
        let tags = req.query.tags
        console.log(tags)
        console.log(category)

        if (!authorId && !category && !tags) {
            let data = await BlogModel.find({ isDeleted: false, isPublished: true })
            if (!data) {
                return res.status(404).send({ status: false, msg: "Data Not Found" })
            }
            return res.status(200).send({ status: true, msg: data })
        }

        let data = await BlogModel.find({ $and: [{ isDeleted: false }, { isPublished: true }, { $or: [{ authorId: authorId }, { category: category }, { tags: tags }] }] })
        if (!data) {
            return res.status(404).send({ status: false, masg: "sorry we couldn't find releted data" })
        }
        res.status(200).send({ status: true, msg: data })
    } catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

const updateData = async function (req, res) {
    try {
        let blogId = req.params.blogId
        if (!blogId) res.status(400).send({ status: false, msg: "blogid is not present" })
        let { isPublished, tags, subcategory } = req.body;
        console.log(isPublished)
        if (isPublished && isPublished == true) {
            let Date = moment().format("YYYY-MM-DD[T]HH:mm:ss")
            req.body.publishedAt = Date
            console.log(isPublished)
        }
        console.log(tags, typeof (tags))
        if (tags || subcategory) {
            console.log('hello')
            let tsobject = await BlogModel.findOne({ _id: blogId })
            if (!tsobject) { return res.status(404).send({ status: false, msg: "data is not Found" }) }
            if (tags) {

                let ptags = tsobject.tags
                tags = [...ptags, ...tags]
                req.body.tags = tags;

            }
            if (subcategory) {
                let psubcategory = tsobject.subcategory;
                subcategory = [...psubcategory, ...subcategory];
                req.body.subcategory = subcategory

            }

        }
        let blogData = req.body
        console.log(blogData)
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
        console.log(blogId)
        if (!blogId) {
            res.status(400).send({ status: false, msg: "blogId is required, BAD REQUEST" })
        }
        let blogDetails = await BlogModel.find({ _id: blogId, isDeleted: false })
        console.log(blogDetails)
        if (!blogDetails) {
            res.status(404).send({ status: false, msg: "blog not exist" })
        }
        // blogDetails.isDeleted = true
        let date = moment().format("YYYY-MM-DD[T]HH:mm:ss")

        await BlogModel.findByIdAndUpdate({ _id: blogId }, { isDeleted: true, deletedAt: date }, { new: true })
        res.status(200).send()
        // console.log(blogDetails)
        // console.log(objdelete)

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

        let multipleDeletes = await BlogModel.find({ $and: [{ isDeleted: false }, { $or: [{ blogId: blogId }, { authorId: authorId }, { category: category }, { tags: tags }, { subcategory: subcategory }, { isPublished: isPublished }] }] })
        console.log(multipleDeletes)

        if (multipleDeletes.length <= 0) {
            return res.status(404).send({ status: false, msg: "data not found" })
        }
        let date = moment().format("YYYY-MM-DD[T]HH:mm:ss")

        //console.log(multipleDeletes)
        await BlogModel.updateMany({ multipleDeletes }, { $set: { isDeleted: true ,deletedAt: date} })

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

