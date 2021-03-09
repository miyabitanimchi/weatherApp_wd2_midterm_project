// API key and base
const api = {
    key: "65a151b09aa1602aaafe305fb5a6786a",
    base: "https://api.openweathermap.org/data/2.5/"
}

// get DOM
const searchCity = document.getElementById("searchCityButton");
let now = new Date();
let date = document.getElementById("date");
let city = document.getElementById("city-name");
let weatherDescri = document.getElementById("weather-description");
let weatherIcon = document.getElementById("weather-icon");
let currentTemp = document.getElementById("current-temp");
let feelsLike = document.getElementById("feelslike-temp");


// fn for when you search a city
const getResults = (city) => {
    fetch(`${api.base}weather?q=${city}&units=metric&appid=${api.key}`).then((res) => {
        console.log(res);
        if (res.status !== 200) {
            alert(`We've got a problem. The status code: ${res.status} `);
            return;
        }
        res.json().then((data) => {
            console.log(data);
        })
    }).catch((err) => {
        console.log(`error ${err}`);
    })
}
getResults("Toronto");

// Get current date from "new Date()" and build a date to be shown
const dateBuilder = (d) => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    let day = days[d.getDay()];
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day} ${date} ${month} ${year}`;

};

// when you visit the page
window.addEventListener("load", getResults("Vancouver"));

