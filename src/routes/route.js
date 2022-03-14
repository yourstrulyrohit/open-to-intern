const express = require('express');
const router = express.Router();
// const CowinController= require("../controllers/cowinController")
// const Weather = require('../controllers/weather')
// const meme = require('../controllers/memeController')
const authorController = require('../controllers/authorController')


router.get("/test-me", function (req, res) {
    res.send("My first ever api!")
})

router.post('/author', authorController.createAuthor)

// router.get("/cowin/states", CowinController.getStates)
// router.get("/cowin/districtsInState/:stateId", CowinController.getDistricts)
// router.get("/cowin/getByPin", CowinController.getByPin)
// router.get("/cowin/getByDisDate", CowinController.getByDIstrictsAndDate)
// router.post("/cowin/getOtp", CowinController.getOtp)

// router.get("/weatherapp/getTempInfo", Weather.getTempInfo)
// router.get("/weatherapp/getLondonTemp", Weather.getLondonTemp)
// router.post('/meme/memeCreater',meme.memeCreater)

// WRITE A GET API TO GET THE LIST OF ALL THE "vaccination sessions by district id" for any given district id and for any given date



module.exports = router;