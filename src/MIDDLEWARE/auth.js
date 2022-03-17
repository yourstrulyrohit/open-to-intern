const jwt = require("jsonwebtoken");
const BlogModel = require('../models/blogsModel.js')
const ObjectId = require('../objectIdValidation/isObjectValid')
const dotenv = require("dotenv")

dotenv.config({ path: "../config.env" })
const SECRET_KEY = process.env.SECRET_KEY


const jwtauth1 = async function (req, res, next) {

  try {
    //authenticate
    let token = req.headers["x-Auth-token"];
    if (!token) token = req.headers["x-auth-token"];
    if (!token) return res.status(401).send({ status: false, msg: "token must be present" });


    let decodedToken = jwt.verify(token, "SECRETKEYISTHEIMPORTANTPARTOFTOKEN");
    if (!decodedToken) { return res.status(401).send({ status: false, msg: "token is invalid" }) };


    let authorId = req.query.authorId
    if (!authorId) authorId = req.params.authorId
    if (!authorId) authorId = req.body.authorId

    if (!authorId) { return res.status(400).send({ status: false, msg: "Bad request authorId is must" }) }

    if (!ObjectId.isValid(authorId)) { return res.status(422).send(`ERROR! This authorid: ${authorId} is invalid `) }

    let authorLoggedIn = decodedToken.authorId
    if (authorId != authorLoggedIn) return res.status(401).send({ status: false, msg: 'Author logged is not allowed to modify the requested authors data' })

    next()



  } catch (error) {
    return res.status(500).send(error.message)
  }

}








//// authorise using blogId
const jwtauth2 = async function (req, res, next) {

  try {

    //authenticate
    let token = req.headers["x-Auth-token"];
    if (!token) token = req.headers["x-auth-token"];
    if (!token) return res.status(401).send({ status: false, msg: "token must be present" });


    let decodedToken = jwt.verify(token, "SECRETKEYISTHEIMPORTANTPARTOFTOKEN");
    if (!decodedToken) { return res.status(401).send({ status: false, msg: "token is invalid" }) };



    let blogId = req.params.blogId
    if (!blogId) res.status(400).send({ status: false, msg: "blogid is not present" })
    if (!ObjectId.isValid(blogId)) { return res.status(422).send({ status: false, msg: `ERROR! This blogId: ${blogId} is invalid ` }) }

    let blogObject = await BlogModel.find({ _id: blogId, isDeleted: false });

    if (blogObject.length <= 0) { return res.status(404).send({ status: false, msg: `blog data with this blogId : ${blogId} is not Found` }) }
    let authorId = blogObject[0].authorId

    let authorLoggedIn = decodedToken.authorId
    console.log(authorId)
    console.log(authorLoggedIn)
    if (authorId != authorLoggedIn) return res.status(401).send({ status: false, msg: 'Author logged is not allowed to modify the requested authors data' })

    next()
  } catch (error) {
    return res.status(500).send(error)
  }

}



// authorise using both bolgId and authoeId
const jwtauth3 = async function (req, res, next) {

  try {



    //authenticate
    let token = req.headers["x-Auth-token"];
    if (!token) token = req.headers["x-auth-token"];
    if (!token) return res.status(401).send({ status: false, msg: "token must be present" });


    let decodedToken = jwt.verify(token, "SECRETKEYISTHEIMPORTANTPARTOFTOKEN");
    if (!decodedToken) { return res.status(401).send({ status: false, msg: "token is invalid" }) };



    let blogId = req.query.blogId
    if (!blogId) blogId = req.params.blogId
    if (!blogId) blogId = req.body.blogId
    console.log(blogId)
    if (blogId) {

      if (!ObjectId.isValid(blogId)) { return res.status(422).send({ status: false, msg: `ERROR! This blogId: ${blogId} is invalid ` }) }

      let blogObject = await BlogModel.find({ _id: blogId, isDeleted: false });

      if (blogObject.length <= 0) { return res.status(404).send({ status: false, msg: `blog data with this blogId : ${blogId} is not Found` }) }
      let authorId = blogObject[0].authorId

      let authorLoggedIn = decodedToken.authorId
      console.log(authorId)
      console.log(authorLoggedIn)
      if (authorId != authorLoggedIn) return res.status(401).send({ status: false, msg: 'Author logged is not allowed to modify the requested authors data' })
      req.query.authorId = authorId;
      next()

    } else {


      let authorId = req.query.authorId
      if (!authorId) authorId = req.params.authorId
      if (!authorId) authorId = req.body.authorId

      if (!authorId) { return res.status(400).send({ status: false, msg: "Bad request authorId is must" }) }

      if (!ObjectId.isValid(authorId)) { return res.status(422).send(`ERROR! This authorid: ${authorId} is invalid `) }

      let authorLoggedIn = decodedToken.authorId
      if (authorId != authorLoggedIn) return res.status(401).send({ status: false, msg: 'Author logged is not allowed to modify the requested authors data' })
      req.query.authorId = authorId
      next()


    }

  } catch (error) {
    return res.status(500).send(error)
  }

}









module.exports.jwtauth1 = jwtauth1
module.exports.jwtauth2 = jwtauth2
module.exports.jwtauth3 = jwtauth3

