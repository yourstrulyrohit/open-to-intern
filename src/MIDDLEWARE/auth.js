const jwt = require("jsonwebtoken");
const BlogModel = require('../models/blogsModel.js')



const jwtauth = async function (req, res, next) {

  try {
    //authenticate
    let token = req.headers["x-Auth-token"];
    if (!token) token = req.headers["x-auth-token"];

    if (!token) return res.status(401).send({ status: false, msg: "token must be present" });


    let decodedToken = jwt.verify(token, "SECRETKEYISTHEIMPORTANTPARTOFTOKEN");
    
    if (!decodedToken)
      return res.status(401).send({ status: false, msg: "token is invalid" });

    // authorise
    let authorId = req.query.authorId
    if (!authorId) authorId = req.params.authorId
    if (!authorId) authorId = req.body.authorId
    
    if (!authorId) { return res.status(400).send({ status: false, msg: "Bad request authorId is must" }) }
 

    let authorLoggedIn = decodedToken.authorId
    if (authorId != authorLoggedIn) return res.status(401).send({ status: false, msg: 'Author logged is not allowed to modify the requested authors data' })

    next()
  } catch (error) {
    return res.status(500).send(error.message)
  }

}






const jwtauth2 = async function (req, res, next) {

  try {
    //authenticate
    let token = req.headers["x-Auth-token"];
    if (!token) token = req.headers["x-auth-token"];

    if (!token) return res.status(401).send({ status: false, msg: "token must be present" });
   
    let decodedToken = jwt.verify(token, "SECRETKEYISTHEIMPORTANTPARTOFTOKEN");
   
    if (!decodedToken)
      return res.status(401).send({ status: false, msg: "token is invalid" });




    // authorise
    let blogId = req.params.blogId
    if (!blogId) res.status(400).send({ status: false, msg: "blogid is not present" })


    let tsobject = await BlogModel.findById(blogId);
    if (!tsobject) { return res.status(404).send({ status: false, msg: "data is not Found" }) }
    let authorId = tsobject.authorId

    let authorLoggedIn = decodedToken.authorId

    if (authorId != authorLoggedIn) return res.status(401).send({ status: false, msg: 'Author logged is not allowed to modify the requested authors data' })

    next()
  } catch (error) {
    return res.status(500).send(error.message)
  }

}







module.exports.jwtauth = jwtauth
module.exports.jwtauth2 = jwtauth2
