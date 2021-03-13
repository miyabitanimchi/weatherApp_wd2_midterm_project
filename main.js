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
const hiTemp = document.getElementById("hi-temp");
const lowTemp = document.getElementById("low-temp");
const convertToF = document.getElementById("convertToF");
const convertToC = document.getElementById("convertToC");
const celcius = document.querySelectorAll(".hide-celcius");
const fahrenheit = document.querySelectorAll(".hide-fahrenheit");

let testTime = new Date().getTime();
console.log(testTime);

// For 2 min function
let cityValue;

// Declaration for building current local time
let now, currentLocalTime, getTimeEverySecond, defaultTimeZone;

// function for when you search a city
const getResults = (city) => {
    fetch(`${api.base}weather?q=${city}&units=metric&appid=${api.key}`).then((res) => {
        console.log(res);
        if (res.status !== 200) {
            alert(`Input a correct name of a city`);
            return;
        }
        res.json().then((cityData) => {
            timeZone = cityData.timezone;
            console.log(timeZone);

            currentLocalTime = timeZone * 1000;

            //  Clear an previous interval
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

let everyTwoMinUpdate = setInterval(() => {
    cityValue = inputCity.value;
    if (cityValue === "") {
        getResults("Vancouver");  // to try not to get the error 400 when the input box is empty
    } else {
        getResults(cityValue);
    }
}, 120000);

// Get current date from "new Date()" and build a date to be shown
const dateBuilder = () => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    now = moment(testTime).utc().add(currentLocalTime);
    // console.log(now);

    // currentLocalTime... milliseconds
    let day = days[now.get("day")];
    let date = now.get("date");
    let month = months[now.get("month")];
    let year = now.get("year");
    let hour = makeDigitDouble(now.get("hour"));
    // console.log(hour);
    let time = makeDigitDouble(now.get("minute"));
    let second = makeDigitDouble(now.get("second"));

    realTimeDate.textContent = `${day}, ${month} ${date}, ${year} ${hour}:${time}:${second}`;
    testTime = testTime + 1000;

};

// function to put 0 for an hour and time when they are single digits
const makeDigitDouble = (num) => {
    num += "";
    return (num.length === 1) ? num = "0" + num : num;
};

// Create elements to show them on html
const createElements = (cityData) => {
    let iconCode = cityData.weather[0].icon;
    let iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    city.textContent = `${cityData.name}, ${cityData.sys.country}`;
    weatherDescri.innerHTML = cityData.weather[0].main;
    weatherIcon.innerHTML = `<img class="icon-image" src="${iconUrl}" alt=""></img>`;
    
    // When users prefer to have fahrenheit and keep it even after they search for another city's forecast
    fahrenheit.forEach((val) => {
        if(!val.classList.contains("hide-fahrenheit")) {
            showTempFahrenheit(cityData);
        } else {
            showTempCelcius(cityData);
        }
    });

    //Convert C to F
    convertToF.addEventListener("click", () => {
        showTempFahrenheit(cityData);
    });

    // Convert F to C
    convertToC.addEventListener("click", () => {
        fahrenheit.forEach((val) => {
            val.classList.add("hide-fahrenheit");
        });
        showTempCelcius(cityData);
    });
}

// function to show temperature with fahrenheit
const showTempFahrenheit = (cityData) => {
    currentTemp.innerHTML = `${Math.round((cityData.main.temp) * 1.8 + 32)}`;
    hiTemp.innerHTML = `H: ${Math.round((cityData.main.temp_max) * 1.8 + 32)}`;
    lowTemp.innerHTML = `L: ${Math.round((cityData.main.temp_min) * 1.8 + 32)}`;
    feelsLike.innerHTML = `${Math.round((cityData.main.feels_like) * 1.8 + 32)}`;
    celcius.forEach((val) => {
        val.classList.add("hide-celcius");
    });
    fahrenheit.forEach((val) => {
        val.classList.remove("hide-fahrenheit");
    });
}

// function to show temperature with celcius
const showTempCelcius = (cityData) => {
    currentTemp.innerHTML = `${Math.round(cityData.main.temp)}`;
    hiTemp.innerHTML = `H: ${Math.round(cityData.main.temp_max)}`;
    lowTemp.innerHTML = `L: ${Math.round(cityData.main.temp_min)}`;
    feelsLike.innerHTML = `${Math.round(cityData.main.feels_like)}`;
    celcius.forEach((val) => {
        val.classList.remove("hide-celcius");
    })
}

// when you search for a city and click the button
window.searchCityBtn.addEventListener("click", () => {
        getAnotherCityInfo();
});
// OR, when press an enter key
inputCity.addEventListener("keypress", (event) => {
    if (event.keyCode == 13) {
        getAnotherCityInfo();
    } 
});

// function for the inside of the click and enter functions
const getAnotherCityInfo = async () => {
    clearInterval(everyTwoMinUpdate);
    cityValue = inputCity.value;
    await getResults(cityValue);
    everyTwoMinUpdate = setInterval(() => {
        getResults(cityValue);
    }, 120000);
}

// Function to execute dark mode
toggleDarkmode = () => {
    document.body.classList.toggle("darkmode");
    if (document.body.classList.contains("darkmode")) {
        localStorage.setItem("darkmodeOn", "true");
    } else {
        localStorage.setItem("darkmodeOn", "false");
    }
}


// when you visit the page
window.addEventListener("load", () => {
    if (localStorage.getItem("darkmodeOn") === "true") { // String
        document.body.classList.add("darkmode");
       } 
    getResults("Vancouver")
   
   });
    

// Storage dark mode
// const storageDarkmode = () => {
//     localStorage.setItem("darkmodeOn", true);
//     if (localStorage.getItem("darkmodeOn") === 'true') {
//         document.body.classList.add("darkmode");
//     } 
// }

// storageDarkmode();

