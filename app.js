require('dotenv').config()
const { log } = require("console");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const request = require("request");
const ngrok = require("@ngrok/ngrok");

const app = express();

app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
})

// app.post("/", function(req, res){
//     const query = req.body.cityName;
//     const apiKey = process.env.WEATHER_INFO_API_KEY;
//     const unit = "Metric";
//     const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ apiKey +"&units="+ unit;

//     https.get(url, function(response){
//         console.log(response.statusCode);

//         response.on("data", function(data){
//             const weatherData = JSON.parse(data);
//             const temp = weatherData.main.temp;
//             const weatherDescription = weatherData.weather[0].description;
//             const icon = weatherData.weather[0].icon
//             const iconUrl = "https://openweathermap.org/img/wn/"+ icon +"@2x.png";

//             res.redirect("/weather")

//             // res.write(" <p>The weather is currently " + weatherDescription + " in " + query + "</p>");
//             // res.write('<image src='+ iconUrl +'>')
//             // res.write("<h1>The temperature in " + query + " is " + temp + " degrees celcius.</h1>");

//         });
//     });
// });

app.get("/home", function(req, res){
    res.render("home", {

    });
});

app.post("/home", function(req, res){
    const searchValue = req.body.cityName
    // console.log(searchValue);

    res.redirect("/weatherinfo/" + searchValue)
});



app.get("/weatherinfo/:searchParam", function(req, res){

    let search = req.params.searchParam;


    const query = search;
    const apiKey = process.env.WEATHER_INFO_API_KEY;
    const unit = "Metric"
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ query +"&appid="+ apiKey +"&units="+ unit;

    request(url, function(response, error, body){

        let data = JSON.parse(body)
        let cityName = data.name;
        let weather = data.weather[0].main;
        let description = data.weather[0].description;
        let temperature = data.main.temp;
        let windSpeed = data.wind.speed;
        let windGust = data.wind.gust;
        let highTemp = data.main.temp_max;
        let lowTemp = data.main.temp_min;
        let pressure = data.main.pressure;
        let humidity = data.main.humidity;

        let icon = data.weather[0].icon
        let iconUrl = "https://openweathermap.org/img/wn/"+ icon +"@2x.png";

        console.log(data);
        console.log(data.weather[0].main);

        res.render("weatherinfo", {
            cityName : cityName,
            weather : weather,
            description : description,
            temperature : Math.round(temperature),
            windSpeed : windSpeed,
            windGust : windGust,
            highTemp : Math.round(highTemp),
            lowTemp : Math.round(lowTemp),
            icon : icon,
            iconUrl : iconUrl,
            airPressure : pressure,
            humidity : humidity,
            // country : country,
        });
    });
});



app.listen(process.env.PORT, function(){
    console.log(`Server is running on port ${process.env.PORT}`);
}); 


// ngrok 

async function startNgrok (){
    const url = await ngrok.connect({
        addr: 3000,
        authtoken_from_env: true,
    });
    console.log(`Ingress established at: ${url}`);
}
// startNgrok();