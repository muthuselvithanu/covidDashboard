var countryDetailArray = [];
var globalCasesResponse;
function httpGet(theUrl) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); // false for synchronous request
    xmlHttp.send(null);
    return xmlHttp.responseText;
}
window.onload = function () {
    let globalCases = localStorage.getItem("covidDetails");
    if (!globalCases) {
        alert("error processing your request");
        window.location.href = "loginpage.html";
    }
    globalCasesResponse = JSON.parse(globalCases);
    document.getElementById("countryList").innerHTML = "<div>" + printCountries(globalCasesResponse.Countries) + "</div>";
}
function printCountries(countries) {
    let resultString = countries.map((country, index) => {
        return "<div class='countrylist'>" +
            "<div class='country' onclick='displayCountry(event);'id='" + country.Country + "'>" + country.Country + "<span id='count' style='float:right';>" + country.TotalConfirmed + "</span>" + "</div>" +
            "<div id='" + index + "' style='display:none;backgorund-color:white;padding:10px' class='countrytable'></div>" +
            "</div>";
    }).join('');
    return resultString;
}
function displayCountry(e) {
    let countryName=e.target.id;
     if(countryName.indexOf("(")!=-1)
    {
countryName=countryName.replace("(","");
countryName=countryName.replace(")","");
    }
    let countryDetails = JSON.parse(httpGet("https://api.covid19api.com/total/country/" + countryName));
    e.target.nextElementSibling.innerHTML = "<table class='display'>" +
        "<thead>" +
        "<th>Date</th>" + "<th>Confirmed</th>" + "<th>Death</th>" + "<th>Recovered</th>" + "<th>Active</th>" +
        "</tr>" +
        "</thead>" +
        "<tbody>" +
        displayDetailsTable(countryDetails) +
        "</tbody>" +
        "</table>";
    if (e.target.nextElementSibling.style.display === "none") {
        e.target.nextElementSibling.style.display = "block";
        if (countryDetailArray.length !== 0) {
            document.getElementById(countryDetailArray[0]).style.display = "none";
            countryDetailArray = [];
        }
        countryDetailArray.push(e.target.nextElementSibling.id);
    }
    else {
        e.target.nextElementSibling.style.display = "none";
        countryDetailArray = [];
    }
}
function displayDetailsTable(countryDetails) {
    let today = new Date();
    today.setDate(today.getDate() - 10);
    let startDate = today.toISOString();
    let latestCountryDetails = countryDetails.filter((detail) => (detail.Date >= startDate));
    return latestCountryDetails.map((countrydetail) => {
        let d = new Date(countrydetail.Date);
        return "<tr>" +
            "<td>" + (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear() + "</td>" + "<td>" + countrydetail.Confirmed + "</td>" + "<td>" + countrydetail.Deaths + "</td>" + "<td>" + countrydetail.Recovered + "</td>" + "<td>" + countrydetail.Active + "</td>" +
            "</tr>";
    }).join('');
}

function countryCheck(e) {
    let matchCountry = globalCasesResponse.Countries.filter((country) => (
        (country.Country.toUpperCase()).startsWith(e.target.value.toUpperCase())
    ));
    document.getElementById("countryList").innerHTML = "<div>" + printCountries(matchCountry) + "</div>";
}
