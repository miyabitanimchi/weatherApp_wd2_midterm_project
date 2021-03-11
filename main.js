// API key and base
const api = {
    key: "65a151b09aa1602aaafe305fb5a6786a",
    base: "https://api.openweathermap.org/data/2.5/"
}

// get DOM
const inputCity = document.getElementById("searchCity");
const searchCityBtn = document.getElementById("searchCityBtn");
const realTimeDate = document.getElementById("date");
const city = document.getElementById("city-name");
const weatherDescri = document.getElementById("weather-description");
const weatherIcon = document.getElementById("weather-icon");
const currentTemp = document.getElementById("current-temp");
const feelsLike = document.getElementById("feelslike-temp");
let cityValue;

// Declaration for building current local time
let now, currentLocalTime, getTimeEverySecond;



// function for when you search a city
const getResults = (city) => {
    fetch(`${api.base}weather?q=${city}&units=metric&appid=${api.key}`).then((res) => {
        console.log(res);
        if (res.status !== 200) {
            alert(`Input a city's name precisely`);
            return;
        }
        res.json().then((cityData) => {
            // setInterval("createElements(cityData)", 1000);
            currentLocalTime = (cityData.dt + cityData.timezone - (-28800)) * 1000;

            //  止めないと前のやつが動きっぱなしになるから
            getTimeEverySecond && clearInterval(getTimeEverySecond);
            // Update the information every one second (because of the second)
            getTimeEverySecond = setInterval(dateBuilder, 1000);
            createElements(cityData);
            console.log(cityData);

        })
    }).catch((err) => {
        console.log(`error ${err}`);
    })
}

const ppp = setInterval(() => {
    cityValue = inputCity.value;
    getResults(cityValue);
}, 120000);

// function to make the first letter of the value input in the search box
const firstLetterToUpperCase = () => {
    inputCity.value.slice(0, 1).toUpperCase()
}

// get a default time zone
// const getDefaultTimezone = (defTimeZone) => `${defTimeZone.timezone}`;

// get a value typed in the input to pass it to the parameter of "getResults"
const getInputValueToShow = () => {
    getResults(cityValue);
}

// [for an enter key activated] get a value typed in the input to pass it to the parameter of "getResults"
const getInputvalueWithEKey = (event) => {
    if (event.keyCode == 13) {
        getResults(cityValue);
        console.log(inputCity.value);
    } 
}
// Get current date from "new Date()" and build a date to be shown
const dateBuilder = () => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    now = new Date(currentLocalTime);
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

    currentLocalTime = currentLocalTime + 1000;

};



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

    city.textContent = `${cityData.name}, ${cityData.sys.country}`;
    weatherDescri.innerHTML = cityData.weather[0].main;
    weatherIcon.innerHTML = `<img src="${iconUrl}" alt=""></img>`;
    
    currentTemp.innerHTML = `${Math.round(cityData.main.temp)}<span>℃</span>`;
    feelsLike.innerHTML = `${Math.round(cityData.main.feels_like)}<span>℃</span>`;
}


// when you visit the page
window.addEventListener("load", getResults("Vancouver"));
// when you search for a city and click the button
window.searchCityBtn.addEventListener("click", getInputValueToShow);
// OR, when press an enter key
inputCity.addEventListener("keypress", getInputvalueWithEKey);