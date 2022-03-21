const express = require('express');
const router = express.Router();

const collageController = require('../controllers/collageController')
const internController = require('../controllers/internController')



router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})
//collage
router.post('/functionUp/collage', collageController.createCollage)
//intern
router.post('/functionUp/intern', internController.createIntern)





router.get('*', function(req, res){
    res.status(404).send({status:false, ERROR:"page not found"});
  });



module.exports = router;