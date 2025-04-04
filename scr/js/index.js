const input = document.querySelector("#city-input");
const timeElement = document.querySelector("#time");
const dateElement = document.querySelector("#date");
const locationElement = document.querySelector("#location");
const temperatureElement = document.querySelector("#temperature");
const descriptionElement = document.querySelector("#Description");
const countryElement = document.querySelector("#country");
const speedElement = document.querySelector("#speed");
const forecastDays = document.querySelectorAll(".forecast-day");
const weatherCard = document.querySelector(".weather-card");
const weatherForecast = document.querySelector(".weather-forecast");


const weatherImages = {
    "clear": "./scr/gifts/Vp9G.gif",
    "clouds": "./scr/gifts/clouds.gif",
    "rain": "./scr/gifts/Rainy_Day.gif",
    "drizzle": "./scr/gifts/Rainy_Day.gif",
    "thunderstorm": "./scr/gifts/storm.gif",
    "snow": "./scr/gifts/snowy.gif",
    "mist": "./scr/gifts/foggy.gif",
    "fog": "./scr/gifts/foggy.gif",
    "haze": "./scr/gifts/foggy.gif",
};

// Sayt açıldıqda hava məlumatları gizli olsun
weatherCard.style.display = "none";
weatherForecast.style.display = "none";

const API_KEY = "246533ebb4500f2a9d0397ffb19b6464";

async function searchWeather() {
    const city = input.value.trim();
    if (city === "") {
        alert("Zəhmət olmasa bir şəhər adı daxil edin!");
        return;
    }

    const API_URL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`;

    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        if (data.cod !== "200") {
            alert("Şəhər tapılmadı! Zəhmət olmasa düzgün şəhər adı daxil edin.");
            return;
        }

        updateCurrentWeather(data);
        updateForecast(data);
        console.log(data);
        
        // Hava məlumatlarını göstər
        weatherCard.style.display = "block";
        weatherForecast.style.display = "flex";
    } catch (error) {
        alert("Məlumat alınarkən xəta baş verdi. İnternet bağlantınızı yoxlayın!");
    }
}

function updateCurrentWeather(data) {
    locationElement.textContent = `${data.city.name}, ${data.city.country}`;
    temperatureElement.textContent = `${Math.round(data.list[0].main.temp)}°C`;
    descriptionElement.textContent = `Description: ${data.list[0].weather[0].description}`;
    countryElement.textContent = `Country: ${data.city.country}`;
    speedElement.textContent = `Wind Speed: ${data.list[0].wind.speed} m/s`;
    const weatherCondition = data.list[0].weather[0].main.toLowerCase();
    const backgroundImage = weatherImages[weatherCondition] || "./scr/gifts/default.gif"; 

    document.querySelector(".weather-container").style.backgroundImage = `url(${backgroundImage})`;
    document.querySelector(".weather-container").style.backgroundSize = "cover";
    document.querySelector(".weather-container").style.backgroundPosition = "center";
}

function updateForecast(data) {
    let forecastIndex = 0;
    let usedDates = new Set();

    for (let i = 0; i < data.list.length && forecastIndex < 4; i++) {
        const forecast = data.list[i];
        const date = new Date(forecast.dt_txt).toLocaleDateString("en-GB");

        if (!usedDates.has(date)) {
            usedDates.add(date);
            const day = new Date(forecast.dt_txt).toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
            const temp = Math.round(forecast.main.temp);
            const iconCode = forecast.weather[0].icon;
            const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

            forecastDays[forecastIndex].querySelector("p").textContent = day;
            forecastDays[forecastIndex].querySelector("img").src = iconUrl;
            forecastDays[forecastIndex].querySelector("img").alt = forecast.weather[0].description;
            forecastDays[forecastIndex].querySelectorAll("p")[1].textContent = `${temp}°C`;

            forecastIndex++;
        }
    }
}
function updateTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = days[now.getDay()];
    const date = now.getDate();
    const month = months[now.getMonth()];

    timeElement.textContent = `${hours}:${minutes}`;
    dateElement.textContent = `${day} | ${month} ${date}`;
}

setInterval(updateTime, 1000);
updateTime();