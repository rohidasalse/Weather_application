const cityInput = document.querySelector(".weather_inp");
const searchButton = document.querySelector(".search_btn");
const locationButton = document.querySelector(".current_location");
const currentWeatherDiv = document.querySelector(".weather_info");
const weatherCardsDiv = document.querySelector(".weather_card");
const API_KEY = "9d3b81b127dbf3d295f27ff53dcf4a0a";
const createWeatherCard = (cityName, weatherItem, index) => {
    if (index === 0) {
        return `<div class="details">
                        <h2>${cityName} (${weatherItem.dt_txt.split(" ")[0]})</h2>
                        <h4>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h4>
                        <h4>Wind: ${weatherItem.wind.speed} M/S</h4>
                        <h4>Humidity: ${weatherItem.main.humidity}%</h4>
                    </div>
                    <div class="img">
                         <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@4x.png" alt="weather-icon">
                        <h6>${weatherItem.weather[0].description}</h6>
                    </div>`;
    } else {
        return `
                    <li class="card">
                        <h3>(${weatherItem.dt_txt.split(" ")[0]})</h3>
                        <img src="https://openweathermap.org/img/wn/${weatherItem.weather[0].icon}@2x.png" alt="weather-icon">
                        <h6>${weatherItem.weather[0].description}</h6>
                        <h6>Temperature: ${(weatherItem.main.temp - 273.15).toFixed(2)}°C</h6>
                        <h6>Wind: ${weatherItem.wind.speed} M/S</h6>
                        <h6>Humidity: ${weatherItem.main.humidity}%</h6>
                    </li>`;
    }
}


const getWeatherDetails = (cityName, lat, lon) => {
    const WEATHER_API_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}`;
    fetch(WEATHER_API_URL).then(response => response.json()).then(data => {

        const uniqueForecastDays = [];
        const fiveDaysForecast = data.list.filter(forecast => {
            const forecastDate = new Date(forecast.dt_txt).getDate();
            if (!uniqueForecastDays.includes(forecastDate)) {
                return uniqueForecastDays.push(forecastDate);
            }
        });
        console.log(data);

        cityInput.value = "";
        currentWeatherDiv.innerHTML = "";
        weatherCardsDiv.innerHTML = "";
        fiveDaysForecast.forEach((weatherItem, index) => {
            const html = createWeatherCard(cityName, weatherItem, index);
            if (index === 0) {
                currentWeatherDiv.insertAdjacentHTML("beforeend", html);
            } else {
                weatherCardsDiv.insertAdjacentHTML("beforeend", html);
            }
        });

    }).catch(() => {
        alert("An error occurred while fetching the coordinates!");
    });

}

const getCityCoordinates = () => {
    const cityName = cityInput.value.trim();
    if (cityName === "") return;
    const API_URL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${API_KEY}`;

    fetch(API_URL).then(response => response.json()).then(data => {
        if (!data.length) return alert(`No coordinates found for ${cityName}`);
        const { name, lat, lon } = data[0];
        getWeatherDetails(name, lat, lon);
    }).catch(() => {
        alert("An error occurred while fetching the city!");
    });
}
const getUserCoordinates = () => {
    navigator.geolocation.getCurrentPosition(
        position => {
            const { latitude, longitude } = position.coords;
            const API_URL = `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`;
            fetch(API_URL).then(response => response.json()).then(data => {
                const { name } = data[0];
                getWeatherDetails(name, latitude, longitude);
            }).catch(() => {
                alert("An error occurred while fetching the current position!");
            });
        },
        Error => {
            if (error.code === error.PERMISSION_DENIED) {
                alert("Geolocation request denied. Please reset location permission to grant access again.");
            }
        }
    );
}
locationButton.addEventListener("click", getUserCoordinates);
searchButton.addEventListener("click", getCityCoordinates);
cityInput.addEventListener("keyup", e => e.key === "Enter" && getCityCoordinates());