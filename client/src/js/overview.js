function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false);
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
window.onload = function () {
    document.getElementById("hiname").innerText = localStorage.getItem("name") + ",";
    let response = JSON.parse(httpGet("http://ip-api.com/json"));
    showCountry(response.country, response.city, response.regionName);
    getDate(response.timezone);
    getTime();
    getWeather(response.city);
    let countryCode=(response.countryCode);
    let regionName = (response.regionName).toLowerCase();
    getCovid(countryCode,regionName);
    displayGlobalCases();
    if (response) {
        document.querySelector(
            "#loader").style.display = "none";
        document.querySelector(
            "#container").style.display = "block";
    }
    setInterval(function clearStorage() {
        localStorage.clear();
        displayGlobalCases();
    }, 86400000);
}
function getDate(timezone) {
    let options = {
        timeZone: timezone,
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    },
        formatter = new Intl.DateTimeFormat([], options);
    document.getElementById("date").innerHTML = "<p>" + formatter.format(new Date()) + "</p>";
}
function getTime() {
    let date = new Date();
    let hr = date.getHours();
    let m = date.getMinutes();
    let s = date.getSeconds();
    if (m < 10) {
        m = "0" + m;
    }
    if (s < 10) {
        s = "0" + s;
    }
    document.getElementById("time").innerHTML = hr + ":" + m + ":" + s;
    setTimeout("getTime()", 500);
}
function getWeather(cityName) {
    let weatherResponse = JSON.parse(httpGet("http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&appid=3edb7b335caeed003f029ba92133ef77"));
    document.getElementById("weather").innerHTML = "<p>Weather:" + weatherResponse.weather[0].description + "</p>" +
        "<p>Temperature:" + getCelsius(weatherResponse.main.temp) + "&#8451;" + " /" + getFahrenheit(weatherResponse.main.temp) + "&#8457;" + "</p>" +
        "<p>Feeslike:" + getCelsius(weatherResponse.main.feels_like) + "&#8451;" + " /" + getFahrenheit(weatherResponse.main.feels_like) + "&#8457;" + "</p>" +
        "<p>Humidity:" + weatherResponse.main.humidity + "%" + "</p>";
}
function getCovid(countrycode,regionname) {
   /* const requestURL = countrycode === "US" ? "https://disease.sh/v3/covid-19/states/"+regionname : "https://covid19.mathdro.id/api/countries/"+countrycode*/
   if(countrycode==="US")
   {
    let currentDetailsResponse = JSON.parse(httpGet("https://disease.sh/v3/covid-19/states/"+regionname));
    document.getElementById("covidcases").innerHTML = "<p>TotalConfirmed:" + " " + currentDetailsResponse.cases + "</p>" +
    "<p>TotalDeaths:" + " " + currentDetailsResponse.deaths + "</p>";
   }
   else{
   let currentDetailsResponse = JSON.parse(httpGet( "https://covid19.mathdro.id/api/countries/"+countrycode));
    document.getElementById("covidcases").innerHTML = "<p>TotalConfirmed:" + " " + currentDetailsResponse.confirmed.value + "</p>" +
        "<p>TotalDeaths:" + " " + currentDetailsResponse.deaths.value + "</p>";
   }
}
function showCountry(countryName, cityName, region) {
    document.getElementById("country").innerHTML = "<h2>" + countryName + " - " + cityName + "/" + region + "</h2>";
}
function getCelsius(temperature) {
    return Math.round(temperature - 273.15);
}
function getFahrenheit(temperature) {
    return Math.round((temperature - 273.15) * 9 / 5 + 32);
}
function displayGlobalCases() {
    let globalCases = localStorage.getItem("covidDetails");
    if (!globalCases) {
        globalCases = httpGet("https://api.covid19api.com/summary");
        localStorage.setItem("covidDetails", globalCases);
    }
    let globalCasesResponse = JSON.parse(globalCases);
    let globalObj = globalCasesResponse.Global;
    document.getElementById("globalcase").innerHTML = "<div>" +
        displayCard("Confirmed", "New", "Total", globalObj.NewConfirmed, globalObj.TotalConfirmed) +
        displayCard("Deaths", "New", "Total", globalObj.NewDeaths, globalObj.TotalDeaths) +
        displayCard("Recovered", "New", "Total", globalObj.NewRecovered, globalObj.TotalRecovered) +
        "</div>"
}
function displayCard(title, displayStr, displayStr1, newCount, totalCount) {
    return (
        "<div class='column'>" +
        "<div class='card'>" +
        "<h3>" + title + "</h3>" +
        "<p>" + displayStr + " " + ":" + " " + newCount + "</p>" +
        "<p>" + displayStr1 + " " + ":" + " " + totalCount + "</p>" +
        "</div>" +
        "</div>"
    )
}
