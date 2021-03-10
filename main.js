// API key and base
const api = {
    key: "65a151b09aa1602aaafe305fb5a6786a",
    base: "https://api.openweathermap.org/data/2.5/"
}

// get DOM
const searchCity = document.getElementById("searchCityButton");
let now;
let realTimeDate = document.getElementById("date");
let city = document.getElementById("city-name");
let weatherDescri = document.getElementById("weather-description");
let weatherIcon = document.getElementById("weather-icon");
let currentTemp = document.getElementById("current-temp");
let feelsLike = document.getElementById("feelslike-temp");


// function for when you search a city
const getResults = (city) => {
    fetch(`${api.base}weather?q=${city}&units=metric&appid=${api.key}`).then((res) => {
        console.log(res);
        if (res.status !== 200) {
            alert(`We've got a problem. The status code: ${res.status} `);
            return;
        }
        res.json().then((cityData) => {
            // setInterval("createElements(cityData)", 1000);
            createElements(cityData);
            console.log(cityData);
        })
    }).catch((err) => {
        console.log(`error ${err}`);
    })
}


// Get current date from "new Date()" and build a date to be shown
const dateBuilder = () => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    now = new Date();
    let day = days[now.getDay()];
    let date = now.getDate();
    let month = months[now.getMonth()];
    let year = now.getFullYear();
    let hour = makeDigitDouble(now.getHours());
    let time = makeDigitDouble(now.getMinutes());
    let second = makeDigitDouble(now.getSeconds());

    realTimeDate.textContent = (date === 1 || date === 21 || date === 31) ? `${day}, ${month} ${date}st, ${year} ${hour} : ${time} ${second}`
        : (date === 2 || date === 22) ? `${day}, ${month}  ${date}nd, ${year} ${hour} : ${time} ${second}`
        : (date === 3 || date === 23) ? `${day}, ${month}  ${date}rd, ${year} ${hour} : ${time} ${second}`
        : `${day}, ${month} ${date}th, ${year} ${hour}:${time} ${second}`

    
    // return `${day} ${date} ${month} ${year} ${hour} : ${time}`;
};

// Update the information every one second (because of the second)
setInterval(dateBuilder, 1000);

// function to put 0 for an hour and time when they are single digits
const makeDigitDouble = (num) => {
    num += "";
    return (num.length === 1) ? num = "0" + num : num;
};


// Create elements to show them on html
const createElements = (cityData) => {
    // createElements(cityData);
    // let now = new Date(cityData.dt * 1000);
    let iconCode = cityData.weather[0].icon;
    let iconUrl = "http://openweathermap.org/img/w/" + iconCode + ".png";

    weatherDescri.innerHTML = cityData.weather[0].main;
    weatherIcon.innerHTML = `<img src="${iconUrl}" alt=""></img>`;
    
    currentTemp.innerHTML = `${Math.round(cityData.main.temp)}<span>℃</span>`;
}


// when you visit the page
window.addEventListener("load", getResults("Vancouver"));
