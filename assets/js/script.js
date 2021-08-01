// DOM elements
var searchInputEl = document.querySelector("#search input");
var searchButtonEl = document.querySelector("#search button");
var userCitiesEl = document.getElementById("user-cities");
var currentWeatherEl = document.getElementById("current-weather");
var forecastFlexEl = document.getElementById("forecast-flex");

// get localStorage
var userCitiesArr = JSON.parse(localStorage.getItem("userCitiesArr"));

if (userCitiesArr) {
  coordFetch(userCitiesArr[0]);
  for (var i = 0; i < userCitiesArr.length; i++) {
    saveCity(userCitiesArr[i]);
  }
} else {
  userCitiesArr = [];
}

var initializeListeners = function() {
  // search event listener
  searchButtonEl.addEventListener("click", searchEventHandler);

  // saved cities event listener
  userCitiesEl.addEventListener("click", function(event) {
    coordFetch(event.target.textContent);
  });
};

var searchEventHandler = function(event) {
  event.preventDefault();
  var cityName = searchInputEl.value;
  coordFetch(cityName);
};

var coordFetch = function(cityName) {
  fetch("https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=16f410708e75046ab09456e2842dea35")
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          console.log(data);
          cityName = data.name;
          var lat = data.coord.lat;
          var lon = data.coord.lon;
          weatherFetch(lat, lon, cityName);
        });
      } else {
        alert("Something went wrong");
      }
    });
};

var weatherFetch = function(lat, lon, cityName) {
  fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=16f410708e75046ab09456e2842dea35")
    .then(function(response) {
      if (response.ok) {
        response.json().then(function(data) {
          console.log(data);
          parseData(data, cityName);
        });
      } else {
        alert("Something went wrong");
      }
    });
}; 

var parseData = function(data, cityName) {
  // clear previous data
  currentWeatherEl.innerHTML = "";
  forecastFlexEl.innerHTML = "";
  
  // data from the returned JSON
  var date = data.current.dt;
  var icon = data.current.weather[0].icon;
  var iconDescription = data.current.weather[0].description;
  var temp = data.current.temp;
  var wind = data.current.wind_speed;
  var humidity = data.current.humidity;
  var uvIndex = data.current.uvi;

  // Dynamic DOM variables
  // Title
  var titleEl = document.createElement("h2");
  titleEl.textContent = cityName + " " + luxon.DateTime.fromSeconds(date).toFormat("(D)");

  var iconEl = document.createElement("img");
  iconEl.setAttribute("src", "https://openweathermap.org/img/w/" + icon + ".png");
  iconEl.setAttribute("alt", "An icon denoting " + iconDescription);
  titleEl.appendChild(iconEl);

  currentWeatherEl.appendChild(titleEl);

  // Temperature
  var tempEl = document.createElement("p");
  tempEl.textContent = "Temp: " + temp + "°F";
  currentWeatherEl.appendChild(tempEl);

  // Wind
  var windEl = document.createElement("p");
  windEl.textContent = "Wind: " + wind + " MPH";
  currentWeatherEl.appendChild(windEl);

  // Humidity
  var humidityEl = document.createElement("p");
  humidityEl.textContent = "Humidity: " + humidity + "%";
  currentWeatherEl.appendChild(humidityEl);

  // UV Index
  var uvEl = document.createElement("p");
  uvEl.textContent = "UV Index: ";

  // UV Index Rating
  var uvSpanEl = document.createElement("span");
  uvSpanEl.textContent = uvIndex;
  if (uvIndex < 3) {
    uvSpanEl.className = "uv-low";
  } else if (uvIndex < 6) {
    uvSpanEl.className = "uv-moderate";
  } else if (uvIndex < 8) {
    uvSpanEl.className = "uv-high";
  } else if (uvIndex < 11) {
    uvSpanEl.className = "uv-very-high";
  } else {
    uvSpanEl.className = "uv-extreme";
  }
  uvEl.appendChild(uvSpanEl);

  currentWeatherEl.appendChild(uvEl);

  // 5 Day Forecast
  for (var i = 0; i < 5; i++) {
    var date = data.daily[i].dt;
    var icon = data.daily[i].weather[0].icon;
    var iconDescription = data.daily[i].weather[0].description;
    var temp = data.daily[i].temp.day;
    var wind = data.daily[i].wind_speed;
    var humidity = data.daily[i].humidity;

    var forecastCardEl = document.createElement("div");
    forecastCardEl.className = "forecast-card";
    
    // Date
    var forecastDateEl = document.createElement("h4");
    forecastDateEl.textContent = luxon.DateTime.fromSeconds(date).toFormat("(D)");
    forecastCardEl.appendChild(forecastDateEl);

    // Icon
    var forecastIconEl = document.createElement("img");
    forecastIconEl.setAttribute("src", "https://openweathermap.org/img/w/" + icon + ".png");
    forecastIconEl.setAttribute("alt", "An icon denoting " + iconDescription);
    forecastCardEl.appendChild(forecastIconEl);

    // Temperature
    var forecastTempEl = document.createElement("p");
    forecastTempEl.textContent = "Temp: " + temp + "°F";
    forecastCardEl.appendChild(forecastTempEl);

    // Wind
    var forecastWindEl = document.createElement("p");
    forecastWindEl.textContent = "Wind: " + wind + " MPH";
    forecastCardEl.appendChild(forecastWindEl);

    // Humidity
    var forecastHumidityEl = document.createElement("p");
    forecastHumidityEl.textContent = "Humidity: " + humidity + "%";
    forecastCardEl.appendChild(forecastHumidityEl);

    forecastFlexEl.appendChild(forecastCardEl);
  }

  saveCity(cityName);
};

var saveCity = function(cityName) {
  // create button saving the city search
  var cityEl = document.createElement("button");
  cityEl.className = "city";
  cityEl.textContent = cityName;
  userCitiesEl.appendChild(cityEl);

  
};

initializeListeners();