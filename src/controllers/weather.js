
const axios = require('axios')




const getTempInfo = async (req, res) => {
    try {
        let cityArray = ["Bengaluru", "Mumbai", "Delhi", "Kolkata", "Chennai", "London", "Moscow"]
       
        const weatherReport = [];
        for (let i = 0; i < cityArray.length; i++) {
            
            const obj = { city: cityArray[i] }

            let tempr = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cityArray[i]}&APPID=e4ae4db4d902ffd1f5ab717f55178ce6`)
            //console.log(tempr)
           
            obj.temp = tempr.data.main.temp
        
            weatherReport.push(obj)
            console.log(weatherReport)
        }

        const tempOrder = weatherReport.sort((a, b) => { return a.temp - b.temp })
        const tempdegree = tempOrder.map(obj => { obj.temp = obj.temp + " kelvin"; return obj })

        res.status(200).send({ msg: tempdegree })
    } catch (error) {

        res.status(500).send(error.message)
    }

}






const getLondonTemp = async (req, res) => {
    try {
        let city = {
            method: "get",
            url: `http://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=e4ae4db4d902ffd1f5ab717f55178ce6`
        }
        console.log(city);
        let temp = await axios(city)
        console.log(temp.data)
        let ftemp = temp.data.main.temp


        res.status(200).send(`Londom: ${ftemp} kelvin `)
    } catch (error) {

        res.status(500).send(error.message)
    }

}














module.exports.getTempInfo = getTempInfo
module.exports.getLondonTemp = getLondonTemp
