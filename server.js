///===============
/// DEPENDENCIES
///===============
const express = require("express")
const morgan = require("morgan")
const moment = require("moment")
require("dotenv").config()
const app = express()


let weatherData


///==============
/// MIDDLEWARE
///==============
app.use(morgan("dev"))
app.use(express.json())
app.use(express.urlencoded({extended: true}))



const fetchResults = async (zip) => {
    const weatherURL = `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&units=imperial&appid=${process.env.API_KEY}`
    
    try {
        const weatherResponse = await fetch(weatherURL)
        weatherData = await weatherResponse.json()
        // console.log(weatherData)
        return weatherData

    } catch (error) {
        console.log("Error",error)
    }
}

//===========
// ROUTERS
//============


// Home route - form
app.get("/", (req, res) => {
    res.render("index.ejs")
})

// Form submission - POST
app.post("/weather", async (req, res) => {
    weatherData = await fetchResults(req.body.zip)
    if(!weatherData || weatherData.cod !== 200 ){
        return res.send("Invalid ZIP Code or error retrieving weather.")

    }

    res.render("show.ejs", {weatherData, moment})

})


///===============
/// LISTENER
///===============
app.listen(3000, () => {
    console.log("Server is running")
})