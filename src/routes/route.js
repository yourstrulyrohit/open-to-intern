const express = require('express');
const router = express.Router();

const authorController = require('../controllers/authorController')
const BlogController = require('../controllers/blogController')
const middleware = require('../middleware/auth')


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})
//author
router.post('/author', authorController.createAuthor)
router.post('/login', authorController.loginAuthor)

//blogs
router.post('/blog', middleware.jwtauth1, BlogController.createBlog)

router.get('/getblogs', middleware.jwtauth1, BlogController.getData)
router.put('/update/:blogId', middleware.jwtauth2, BlogController.updateData)

//delete
router.delete('/blogs/:blogId', middleware.jwtauth2, BlogController.deleteBlog)
router.delete('/blogs', middleware.jwtauth3, BlogController.deleteMultipleFields)


//The 404 Route (ALWAYS Keep this as the last route)
router.get('*', function(req, res){
    res.status(404).send({status:false, ERROR:"page not found"});
  });



module.exports = router;