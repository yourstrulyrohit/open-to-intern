const express = require('express');
const router = express.Router();

const authorController = require('../controllers/authorController')
const BlogController = require('../controllers/blogController')
const middleware = require('../MIDDLEWARE/auth')


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})
//phase1
router.post('/author', authorController.createAuthor)
router.post('/blog', middleware.jwtauth, BlogController.createBlog)

router.get('/getblogs', middleware.jwtauth, BlogController.getData)
router.put('/update/:blogId', middleware.jwtauth2, BlogController.updateData)

router.delete('/blogs/:blogId', middleware.jwtauth2, BlogController.deleteBlog)
router.delete('/blogs', middleware.jwtauth, BlogController.deleteMultipleFields)

//phase2
router.post('/login', authorController.loginAuthor)


module.exports = router;