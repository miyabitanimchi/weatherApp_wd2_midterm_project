// API key and base
const api = {
    key: "65a151b09aa1602aaafe305fb5a6786a",
    base: "https://api.openweathermap.org/data/2.5/"
}

// get DOM
const inputCity = document.getElementById("searchCity");
const weatherContainer = document.getElementById("weather-container")
const weatherIcon = document.getElementById("weather-icon");
const currentTemp = document.getElementById("current-temp");
const feelsLike = document.getElementById("feelslike-temp");
const hiTemp = document.getElementById("hi-temp");
const lowTemp = document.getElementById("low-temp");
const celcius = document.querySelectorAll(".hide-celcius");
const fahrenheit = document.querySelectorAll(".hide-fahrenheit");

let currentTimeHere = new Date().getTime();  // get time with milliseconds at where you currently are 
let cityValue;  // Global variable for 2 min function
let now, currentLocalTimezone, getTimeEverySecond; // Global variables for building current local time

// Function to fetch API and get the data of each city
const fetchAPIAndGetDataOfEachCity = (cityName) => {
    fetch(`${api.base}weather?q=${cityName}&units=metric&appid=${api.key}`).then((response) => {
        console.log(response);
        if (response.status !== 200) {
            alert(`Input a correct name of a city`);
            return;
        }
        response.json().then((cityData) => {
            // The data of each timezone is seconds, so times 1000 to change it to miliseconds, 
            // and assign it to the global variable "currentLocalTimezone"
            currentLocalTimezone = (cityData.timezone) * 1000; 

            //  Clear a previous interval
            getTimeEverySecond && clearInterval(getTimeEverySecond);
            // Update the information every one second (because of the second)
            getTimeEverySecond = setInterval(createDate, 1000);
            createElementsAndShow(cityData);
            console.log(cityData);

        })
    }).catch((err) => {
        console.log(`error ${err}`);
    })
}

let everyTwoMinUpdate = setInterval(() => {
    cityValue = inputCity.value;
    if (cityValue === "") {
        fetchAPIAndGetDataOfEachCity("Vancouver");  // to try not to get the error 400 when the input box is empty
    } else {
        fetchAPIAndGetDataOfEachCity(cityValue);
    }
}, 120000); // Fetch API every 2 mins

// Function to chenge time where you currently are, to current local time of a city submitted
const createDate = () => {
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    
    now = moment(currentTimeHere).utc().add(currentLocalTimezone); // Method from moment JS.  currentLocalTimezone... milliseconds

    let day = days[now.get("day")];
    let date = now.get("date");
    let month = months[now.get("month")];
    let year = now.get("year");
    let hour = add0WhenSingleDigits(now.get("hour"));
    let time = add0WhenSingleDigits(now.get("minute"));
    let second = add0WhenSingleDigits(now.get("second"));

    document.getElementById("date").textContent = 
    `${day}, ${month} ${date}, ${year} ${hour}:${time}:${second}`;
    currentTimeHere = currentTimeHere + 1000;
};

// Function to add 0 to single digits
const add0WhenSingleDigits = (num) => {
    num += "";
    return (num.length === 1) ? num = "0" + num : num;
};

// Create elements and show them on the display
const createElementsAndShow = (cityData) => {
    let iconCode = cityData.weather[0].icon;
    let iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    document.getElementById("city-name").textContent = `${cityData.name}, ${cityData.sys.country}`;
    document.getElementById("weather-description").innerHTML = cityData.weather[0].main;
    weatherIcon.innerHTML = `<img class="icon-image" src="${iconUrl}" alt=""></img>`;
    
    // For when users prefer to have fahrenheit and keep it even after they search for another city's forecast
    fahrenheit.forEach((val) => {
        if(!val.classList.contains("hide-fahrenheit")) {
            showTempWithF(cityData);
        } else {
            showTempWithC(cityData);
        }
    });
    //Convert C to F
    document.getElementById("convertToFBtn").addEventListener("click", () => {
        showTempWithF(cityData);
    });
    // Convert F to C
    document.getElementById("convertToCBtn").addEventListener("click", () => {
        fahrenheit.forEach((val) => {
            val.classList.add("hide-fahrenheit");
        });
        showTempWithC(cityData);
    });
}

// function to show temperature with fahrenheit
const showTempWithF = (cityData) => {
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
const showTempWithC = (cityData) => {
    currentTemp.innerHTML = `${Math.round(cityData.main.temp)}`;
    hiTemp.innerHTML = `H: ${Math.round(cityData.main.temp_max)}`;
    lowTemp.innerHTML = `L: ${Math.round(cityData.main.temp_min)}`;
    feelsLike.innerHTML = `${Math.round(cityData.main.feels_like)}`;
    celcius.forEach((val) => {
        val.classList.remove("hide-celcius");
    })
}

// when you search for a city and click the button
window.document.getElementById("searchCityBtn").addEventListener("click", () => {
        getAnotherCityInfo();
});
// OR, when press an enter key
inputCity.addEventListener("keypress", (event) => {
    if (event.keyCode == 13) {
        getAnotherCityInfo();
    } 
});

// Function to put in the inside of the click and enter functions above
const getAnotherCityInfo = async () => {
    clearInterval(everyTwoMinUpdate);
    cityValue = inputCity.value;
    await fetchAPIAndGetDataOfEachCity(cityValue);
    everyTwoMinUpdate = setInterval(() => {
        fetchAPIAndGetDataOfEachCity(cityValue);
    }, 120000);
}

// Function to execute dark mode
toggleDarkmode = () => {
    document.body.classList.toggle("darkmode");
    weatherContainer.classList.toggle("wContainerDarkmode");

    if (document.body.classList.contains("darkmode") 
    && weatherContainer.classList.contains("wContainerDarkmode")) {
        localStorage.setItem("darkmodeOn", "true");
    } else {
        localStorage.setItem("darkmodeOn", "false");
    }
}

// when you visit the page
window.addEventListener("load", () => {
    if (localStorage.getItem("darkmodeOn") === "true") { // String
        document.body.classList.add("darkmode");
        weatherContainer.classList.add("wContainerDarkmode");
       } 
    fetchAPIAndGetDataOfEachCity("Vancouver")
   });