const { count } = require("console")
const authorModel = require("../models/authorModel")
//const validator = require('validator')


const createAuthor = async function (req, res) {
    try {
        let data = req.body
        let { password, cpassword,email} = req.body
        console.log(data);
        if(!cpassword){return res.status(400).send({status: false , msg:"cpassword field must required"})}
        if (password != cpassword) {  // checking password password is matchng or not
            return res.status(422).send({ error: "password are not matchong" })
        }

       let userExist = await authorModel.findOne({email:email})
        if (userExist) {
            return res.status(422).send({ error: "Email already exist" })
        }
    

        delete req.body["cpassword"]
        if (Object.keys(data).length != 0) {
            let savedData = await authorModel.create(data)
            res.status(201).send({ status: true, data: savedData })
        }
        else res.status(400).send({ msg: "BAD REQUEST" })

    }
    catch (err) {
        console.log("This is the error :", err.message)
        res.status(500).send({ msg: "Error", error: err.message })
    }
}




module.exports.createAuthor = createAuthor
