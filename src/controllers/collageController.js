
const collageModel = require("../models/collageModel")






const createCollage = async function (req, res) {
    try {
        let data = req.body
        let {name, fullName, logoLink, isDeleted } = req.body
        if(!name) res.status(400).send({status:false, msg:"name is required"})
        if(!fullName) res.status(400).send({status:false, msg:"fullName is required"})
        if(!logoLink) res.status(400).send({status:false, msg:"logoLink is required"})
        
        

        let savedData = collageModel.create(data)
        res.status(201).send({status:true, data:data})

     


    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}









module.exports.createCollage = createCollage
