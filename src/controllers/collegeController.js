

const collegeModel = require("../models/collegeModel")
const internModel = require("../models/internModel")






const createCollege = async function (req, res) {
    try {
        let data = req.body
        let {name, fullName, logoLink, isDeleted } = req.body
        if(!name) res.status(400).send({status:false, msg:"name is required"})
        if(!fullName) res.status(400).send({status:false, msg:"fullName is required"})
        if(!logoLink) res.status(400).send({status:false, msg:"logoLink is required"})

        let collegeExist = await collegeModel.findOne({name:name})
        if(collegeExist) { return res.status(422).send({ status: false, error: `ERROR! : ${name} this college name already exist` }) }
        
        let collegeExist2 = await collegeModel.findOne({fullName:fullName})
        if(collegeExist2) { return res.status(422).send({ status: false, error: `ERROR! : ${fullName} this college fullName already exist` }) }

        let collegeExist3 = await collegeModel.findOne({logoLink:logoLink})
        if(collegeExist3) { return res.status(422).send({ status: false, error: `ERROR! : ${logoLinke} this college logolink already exist` }) }

        let savedData = collegeModel.create(data)
        res.status(201).send({status:true, data:data})

     


    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}

const getCollegeDetails = async function(req, res){
    try{
        if(!Object.keys(req.query).includes("collegeName")) return res.status(400).send({status:false,msg : "Wrong params in given"})

        let collegeName = req.query.collegeName
        if(!collegeName){
            return res.status(400).send({status:false,msg:"collegeName required"})
        }
        let collegeData = await collegeModel.findOne({name:collegeName,isDeleted : false})
        if(!collegeData){
             return res.status(404).send({status:false,msg:"College not found "})
        } 
        let result = {
            name: collegeData.name,
            fullName : collegeData.fullName,
            logoLink:collegeData.logoLink
        }
        let id = collegeData._id
        let interestedIntern = await internModel.find({collegeId:id,isDeleted:false}).select({name:1,email:1,mobile:1})
        if(interestedIntern.length ==0){
            result.interest = "No intern applied till now"
            return res.status(200).send({status:false,msg:result})
        }
        result.interest = interestedIntern
        return res.status(200).send({status:true,data:result})
        
    }
    catch(err){
        return res.status(500).send({status:false,msg: err.message})
    }
}








module.exports.createCollage = createCollege
module.exports.getCollegeDetails = getCollegeDetails

