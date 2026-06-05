const apiKey = "03387144bc89163e6ddc7b6b6595a451";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?units=metric&q=";
const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

function getIconSrc(condition) {
    if (condition == "Clouds") return "clouds.png";
    if (condition == "Clear") return "clear.png";
    if (condition == "Rain") return "rain.png";
    if (condition == "Drizzle") return "drizzle.png";
    if (condition == "Mist") return "mist.png";
    if (condition == "Snow") return "snow.png";
    return "clear.png";
}

async function checkWeather(city) {
    const response = await fetch(apiUrl + city + "&appid=" + apiKey);
    if (response.status === 404) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
        document.querySelector(".forecast").style.display = "none";
    } else {
        const data = await response.json();
        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";
        weatherIcon.src = getIconSrc(data.weather[0].main);
        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";
        getForecast(city);
    }
}

async function getForecast(city) {
    const response = await fetch(forecastUrl + city + "&appid=" + apiKey);
    const data = await response.json();
    const dailyForecasts = {};
    data.list.forEach(function(item) {
        const date = new Date(item.dt * 1000);
        const day = date.toLocaleDateString("en-US", { weekday: "short" });
        if (!dailyForecasts[day]) { dailyForecasts[day] = item; }
    });
    const forecastContainer = document.getElementById("forecastContainer");
    forecastContainer.innerHTML = "";
    Object.keys(dailyForecasts).slice(0, 5).forEach(function(day) {
        const item = dailyForecasts[day];
        const card = document.createElement("div");
        card.classList.add("forecast-card");
        card.innerHTML = "<p class='forecast-day'>" + day + "</p><img src='" + getIconSrc(item.weather[0].main) + "' class='forecast-icon'/><p class='forecast-temp'>" + Math.round(item.main.temp) + "C</p><p class='forecast-condition'>" + item.weather[0].main + "</p>";
        forecastContainer.appendChild(card);
    });
    document.querySelector(".forecast").style.display = "block";
}

searchBtn.addEventListener("click", function() { checkWeather(searchBox.value); });
searchBox.addEventListener("keypress", function(e) { if (e.key === "Enter") checkWeather(searchBox.value); });
checkWeather("New York");
