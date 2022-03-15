const express = require('express');
const router = express.Router();

const authorController = require('../controllers/authorController')
const BlogController = require('../controllers/blogController')


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post('/author', authorController.createAuthor)
router.post('/blog', BlogController.createBlog)
router.get('/getblogs',BlogController.getData )
router.put('/update/:blogId',BlogController.updateData)
router.delete('/blogs/:blogId',BlogController.deleteBlog)
router.delete('/blogs',BlogController.deleteMultipleFields)



module.exports = router;