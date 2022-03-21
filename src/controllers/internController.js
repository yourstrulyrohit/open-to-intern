
const internModel = require("../models/internModel")
const collageModel = require("../models/collageModel")




const createIntern = async function (req, res) {
    try {
        
let{name, email, mobile, collageId} = req.body
if(!name) res.status(400).send({status:false, msg:"name is required"})
if(!email) res.status(400).send({status:false, msg:"email is required"})
if(!mobile) res.status(400).send({status:false, msg:"mobile is required"})
if(!collageId) res.status(400).send({status:false, msg:"collageId is required"})

let internExist = await internModel.findOne({ email: email })
if (internExist) { return res.status(422).send({ status: false, error: `ERROR! : ${email} this Email already exist` }) }

let internExist2 = await internModel.findOne({ mobile: mobile })
if (internExist2) { return res.status(422).send({ status: false, error: `ERROR! : ${mobile} this number already exist` }) }

let savedData = internModel.create(req.body)
res.status(201).send({status:true, data:req.body})

       


    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })

    }
}








module.exports.createIntern = createIntern

