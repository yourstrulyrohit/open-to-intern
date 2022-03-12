const axios  = require("axios")



const memeCreater = async function(req, res){
    try{
        const {template_id,text0,text1,username,password } = req.query;
        console.log(template_id,text0,text1,username,password)
        
        const memeObj = {
            method:"post",
           url:`https://api.imgflip.com/caption_image?template_id=${template_id}&text0=${text0}&text1=${text1}&username=${username}&password=${password}`
           // url:`https://api.imgflip.com/caption_image?template_id=181913649&text0=hellow&text1=welcome&username=chewie12345&password=meme@123`
        }
        const result = await axios(memeObj)
        return res.status(200).send({msg:result.data})

    }catch(error){
        res.status(500).send(error.message)
    }


} 

module.exports.memeCreater = memeCreater