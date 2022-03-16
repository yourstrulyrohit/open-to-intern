const { count } = require("console")
const { Module } = require("module")
const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")
//const validator = require('validator')


const createAuthor = async function (req, res) {
    try {
        let data = req.body
        let { password, cpassword, email } = req.body
        console.log(data);
        if (!cpassword) { return res.status(400).send({ status: false, msg: "cpassword field must be required" }) }
        if (password != cpassword) {  // checking password password is matchng or not
            return res.status(422).send({ error: "password are not matchong" })
        }

        let userExist = await authorModel.findOne({ email: email })
        if (userExist) {
            return res.status(422).send({ error: "Email already exist" })
        }


        //delete req.body["cpassword"]
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





const loginAuthor = async function (req, res) {
    try {
        
        const { email, password } = req.body

        if (!email || !password) { return res.send({ msg: ' Bad request' }) }

        let author = await authorModel.findOne({ email: email, password: password });

        if (!author) return res.send({ status: false, msg: "authorEmail or the password is not corerct" });

        let token = jwt.sign({ authorId: author._id.toString(), authorName: author.fname, authorEmail: author.email }, "SECRETKEYISTHEIMPORTANTPARTOFTOKEN");

        res.setHeader("x-auth-token", token);
        res.status(200).send({ status: true, data: token });
    } catch (error) {
        res.status(500).send(error.message)
    }

};



module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor