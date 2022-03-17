const { count } = require("console")
const { Module } = require("module")
const authorModel = require("../models/authorModel")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config({ path: "../config.env" })
const SECRET_KEY = process.env.SECRET_KEY
//const validator = require('validator')


const createAuthor = async function (req, res) {
    try {

        let { fname, lname, title, password, cpassword, email } = req.body
        if (!fname || !lname || !title || !password || !cpassword || !email) {
            return res.status(400).send({ msg: "Bad Request please fill all the fields" })
        }


        if (!cpassword) { return res.status(400).send({ status: false, msg: "cpassword field must be required" }) }
        if (password != cpassword) {  // checking password password is matchng or not
            return res.status(422).send({ error: "password are not matchong" })
        }

        let userExist = await authorModel.findOne({ email: email })
        if (userExist) { return res.status(422).send({ status: false, error: `ERROR! : ${email}this Email already exist` }) }


        delete req.body["cpassword"] // we are deleting the cpassword because don't need to save in dataBase

        let savedData = await authorModel.create(req.body)
        res.status(201).send({ status: true, data: savedData })


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

        if (!author) return resstatus(422).send({ status: false, msg: "Email or the password is not corerct" });

        let token = jwt.sign({ authorId: author._id.toString(), authorName: author.fname, authorEmail: author.email }, "SECRET_KEY");

        res.setHeader("x-auth-token", token);
        res.status(200).send({ status: true, data: token });
    } catch (error) {
        res.status(500).send(error.message)
    }

};



module.exports.createAuthor = createAuthor
module.exports.loginAuthor = loginAuthor