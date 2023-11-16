// Selecting elements from the DOM
const app = document.querySelector('.weather-app');
const temp = document.querySelector('.temp');
const dateOutput = document.querySelector('.date');
const timeOutput = document.querySelector('.time');
const conditionOutput = document.querySelector('.condition');
const nameOutput = document.querySelector('.name');
const icon = document.querySelector('.icon');
const cloudOutput = document.querySelector('.cloud');
const humidityOutput = document.querySelector('.humidity');
const windOutput = document.querySelector('.wind');
const form = document.querySelector('#locationInput');
const search = document.querySelector('.search');
const btn = document.querySelector('.submit');
const cities = document.querySelectorAll('.city');

// Default city input
let cityInput = "Harare";

// Adding click event listeners to city elements
cities.forEach((city) => {
    city.addEventListener('click', (e) => {
        // Update city input and fetch weather data
        cityInput = e.target.innerHTML;
        fetchWeatherData();
        // Hide the app temporarily
        app.style.opacity = "1";
    });
});

// Adding submit event listener to the form
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check if search input is empty
    if (search.value.length === 0) {
        alert('Please type in a city name');
    } else {
        // Update city input with the search value and fetch weather data
        cityInput = search.value;
        await fetchWeatherData();
        // Clear search input and hide the app temporarily
        search.value = "";
        app.style.opacity = "1";
    }
});

// Function to get the day of the week
function dayOfTheWeek(day, month, year) {
    const weekday = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
    ];
    return weekday[new Date(`${year}/${month}/${day}`).getDay()];
}

// Function to fetch weather data
async function fetchWeatherData() {
    try {
        // Fetch weather data from the API
        const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=fd91071278f14cf89c5193335233110&q=${cityInput}`);
        const data = await response.json();

        // Log the retrieved data to the console
        console.log(data);

        // Extract and display relevant weather information
        temp.innerHTML = data.current.temp_c + "&#176;";
        conditionOutput.innerHTML = data.current.condition.text;

        const date = data.location.localtime;
        const y = parseInt(date.substr(0, 4));
        const m = parseInt(date.substr(5, 2));
        const d = parseInt(date.substr(8, 2));
        const time = date.substr(11);
        const iconCode = data.current.condition.icon;
        const iconParts = iconCode.split('/');
        const iconId = iconParts[iconParts.length - 1].split('.')[0];

        dateOutput.innerHTML = `${dayOfTheWeek(d, m, y)} ${d}, ${m} ${y}`;
        timeOutput.innerHTML = time;
        nameOutput.innerHTML = data.location.name;
        const icon = document.querySelector('.icon img');

        cloudOutput.innerHTML = data.current.cloud + "%";
        humidityOutput.innerHTML = data.current.humidity + "%";
        windOutput.innerHTML = data.current.wind_kph + "km/h";

        let timeOfDay = "day";
        const code = data.current.condition.code;

        if (!data.current.is_day) {
            timeOfDay = "night";
        }

        // Set background image and button background based on weather conditions
        if (code == 1000) {
            app.style.backgroundImage = `url(./images/${timeOfDay}/clear.jpg)`;
            btn.style.background = "#e5ba92";
            if (timeOfDay == "night") {
                btn.style.background = "#181e27";
            }
        } else if (
            code == 1003 ||
            code == 1006 ||
            code == 1009 ||
            // ... (other condition codes)
            code == 1282
        ) {
            app.style.backgroundImage = `url(./images/${timeOfDay}/cloudy.jpg)`;
            btn.style.background = "#fa6d1b";
            if (timeOfDay == "night") {
                btn.style.background = "#181e27";
            }
        } else if (
            code == 1063 ||
            // ... (other condition codes)
            code == 1252
        ) {
            app.style.backgroundImage = `url(./images/${timeOfDay}/rainy.jpg)`;
            btn.style.background = "#647d75";
            if (timeOfDay == "night") {
                btn.style.background = "#325c80";
            }
        } else {
            app.style.backgroundImage = `url(./images/${timeOfDay}/snowy.jpg)`;
            btn.style.background = "#4d72aa";
            if (timeOfDay == "night") {
                btn.style.background = "#1b1b1b";
            }
        }

        // Show the app with updated information
        app.style.opacity = "1";
    } catch (error) {
        // Handle errors during data fetching
        console.error('Error fetching data:', error);
        alert('City not found, please try again');
        // Show the app even if there's an error to avoid a black overlay
        app.style.opacity = "1";
    }
}

// Initial fetch of weather data when the page loads
fetchWeatherData();
// Show the app after the initial data fetch
app.style.opacity = "1";
