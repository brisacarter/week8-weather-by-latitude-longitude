/*
Name: Brisa Carter
Assignment: Week 8 - Weather by Latitude and Longitude
Description: Find the weather by latitude and longitude using the OpenWeather API
Date: 03/07/25
*/

const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const mySecret = process.env["week8"];
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Displays index.html of root path
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Invoked after hitting go in the html form
app.post("/", function (req, res) {
  // Takes in the longitude and latitude from the html form
  const longInput = String(req.body.longInput);
  const latInput = String(req.body.latInput);
  console.log(req.body.longInput);
  console.log(req.body.latInput);

  // Build up the URL for the JSON query
  const units = "metric";

  const apiKey = mySecret;
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latInput}&lon=${longInput}&units=${units}&appid=${apiKey}`;

  // This gets the data from OpenWeather API
  https.get(url, function (response) {
    console.log(response.statusCode);

    response.on("data", function (data) {
      const weatherData = JSON.parse(data);
      if (weatherData.cod === 200) {
        const temp = weatherData.main.temp;
        //Convert to imperial
        let tempImperial = (parseInt(temp) * 9/5 +32);
        const feels_like = weatherData.main.feels_like;
        let feelsLikeImperial = (parseInt(feels_like) * 9/5 +32);
        const city = weatherData.name;
        const humidity = weatherData.main.humidity;
        const speed = weatherData.wind.speed;
        //convert speed to mph, rounding to 2 decimal places
        let speedMph = ((parseInt(speed) * 2.23694).toFixed(2));
        
        const cloudiness = weatherData.clouds.all;
        const weatherDescription = weatherData.weather[0].description;
        const icon = weatherData.weather[0].icon;
        const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
        //Convert to decimal
 let decHumidity = humidity/100;
 let decCloudiness = cloudiness/100;
        // Displays the output of the results
        res.write(`<h1>The weather is ${weatherDescription}</h1>`);
        res.write(`<img src=${imageURL}>`);
        res.write(
          `<h2>The Temperature in ${city} is ${temp} &deg;C (${tempImperial}&deg;F).</h2>`,
        );
        res.write(
          `<h2>It feels like ${feels_like} &deg;C (${feelsLikeImperial}&deg;F).</h2>`
        );

      
        res.write(`<h2>The Humidity is ${humidity} % (${decHumidity}).</h2>`);
        res.write(
          `<h2>The Wind Speed is ${speed} meter/sec (${speedMph} mph).</h2>`,
        );
        res.write(
          `<h2>The Cloudiness is  ${cloudiness} % (${decCloudiness}).</h2>`,
        );

        res.send();
      } else {
        res.write("<h1>Location not found!</h1>");
        res.send();
      }
    });
  });
});

// Code will run on port 3000 or any available open port
app.listen(process.env.PORT || 3000, function () {
  console.log("Server is running on port");
});
