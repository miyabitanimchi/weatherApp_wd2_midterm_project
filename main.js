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
        if (!response.ok) {
            alert(`The city name you input was not found`);
            return;
        }
        response.json().then((cityData) => {
           // Assign timezone to the global variable "currentLocalTimezone"
            currentLocalTimezone = (cityData.timezone) * 1000; // Times 1000 to convert the timezome to milliseconds
            // Clear the previous interval
            getTimeEverySecond && clearInterval(getTimeEverySecond); // If the left one is true, it goes to the right
            // The timer for a date gets executed
            getTimeEverySecond = setInterval(getDateAndShow, 1000);
            getForecastAndShow(cityData);
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
    console.log(Date()); // Just to show it updates every 2 mins
}, 120000); // Fetch API every 2 mins

// Function to chenge time where you currently are, to current local time of a city submitted
const getDateAndShow = () => {
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
    currentTimeHere = currentTimeHere + 1000; // Timer... add one second each interval
};

// Function to add 0 to single digits
const add0WhenSingleDigits = (num) => {
    num += "";
    return (num.length === 1) ? num = "0" + num : num;
};

// Function to elements and show them on the display
const getForecastAndShow = (cityData) => {
    let iconCode = cityData.weather[0].icon;
    let iconUrl = "http://openweathermap.org/img/wn/" + iconCode + "@2x.png";
    document.getElementById("city-name").textContent = `${cityData.name}, ${cityData.sys.country}`;
    document.getElementById("weather-description").textContent = cityData.weather[0].main;
    weatherIcon.innerHTML = `<img class="icon-image" src="${iconUrl}" alt=""></img>`;
   
    // For when users prefer to have fahrenheit and keep it even after they search for another city's forecast
    fahrenheit.forEach((val) => {
        if(!val.classList.contains("hide-fahrenheit")) { // = If F was shown already
            showTempWithF(cityData); // Show fahrenheit   
        } else {
            showTempWithC(cityData); // Show celcius
        }
    });
    //Convert C to F
    document.getElementById("convertToFBtn").addEventListener("click", () => {
        showTempWithF(cityData);
    });
    // Convert F to C
    document.getElementById("convertToCBtn").addEventListener("click", () => {
        showTempWithC(cityData);
    });
}

// function to show temperature with fahrenheit
const showTempWithF = (cityData) => {
    currentTemp.textContent = `${Math.round((cityData.main.temp) * 1.8 + 32)}`;
    hiTemp.textContent = `H: ${Math.round((cityData.main.temp_max) * 1.8 + 32)}`;
    lowTemp.textContent = `L: ${Math.round((cityData.main.temp_min) * 1.8 + 32)}`;
    feelsLike.textContent = `${Math.round((cityData.main.feels_like) * 1.8 + 32)}`;
    celcius.forEach((val) => {
        val.classList.add("hide-celcius"); // C will be hidden
    });
    fahrenheit.forEach((val) => {
        val.classList.remove("hide-fahrenheit"); // F will be shown 
        localStorage.setItem("keepF", "true"); // Add the key "keppF" in a storage with the value true
    });
}

// function to show temperature with celcius
const showTempWithC = (cityData) => {
    currentTemp.textContent = `${Math.round(cityData.main.temp)}`;
    hiTemp.textContent = `H: ${Math.round(cityData.main.temp_max)}`;
    lowTemp.textContent = `L: ${Math.round(cityData.main.temp_min)}`;
    feelsLike.textContent = `${Math.round(cityData.main.feels_like)}`;
    celcius.forEach((val) => {
        val.classList.remove("hide-celcius"); // C will be shown
        localStorage.setItem("keepF", "false"); // Add the key "keppF" in a storage with the value false
    });
    fahrenheit.forEach((val) => {
        val.classList.add("hide-fahrenheit");
    });
}
// Function to execute the dark mode ...onclick
const toggleDarkmode = () => {
    document.body.classList.toggle("darkmode");
    weatherContainer.classList.toggle("weatherContainerDarkmode");

    if (document.body.classList.contains("darkmode") 
    && weatherContainer.classList.contains("weatherContainerDarkmode")) {
        localStorage.setItem("darkmodeOn", "true"); 
        // localStorage.setItem(keyname, value) ...Both have to be strings
    } else {
        localStorage.setItem("darkmodeOn", "false");
    }
}
// when you visit the page
window.addEventListener("load", () => {
    // Conditional for when the dark mode was on
    if (localStorage.getItem("darkmodeOn") === "true") { // getItem(keyname) ...Has to be a string
        document.body.classList.add("darkmode"); 
        weatherContainer.classList.add("weatherContainerDarkmode");
       } 
    // Conditional for when farrenheit was chosen
    if (localStorage.getItem("keepF") === "true") {
        celcius.forEach((val) => {
            val.classList.add("hide-celcius");
        });
        fahrenheit.forEach((val) => {
            val.classList.remove("hide-fahrenheit");
        });
    }
    fetchAPIAndGetDataOfEachCity("Vancouver")
});

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

// Function to put in the inside of the click and enter addEventListeners above
const getAnotherCityInfo = () => {
    clearInterval(everyTwoMinUpdate);
    cityValue = inputCity.value;
    if (cityValue === "") {
        fetchAPIAndGetDataOfEachCity("Vancouver");
    } else {
        fetchAPIAndGetDataOfEachCity(cityValue);
    }
    everyTwoMinUpdate = setInterval(() => {
        fetchAPIAndGetDataOfEachCity(cityValue);
    }, 120000);
}
