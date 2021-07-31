// DOM elements
var currentWeatherEl = document.getElementById("current-weather");

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
}

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
} 

var parseData = function(data, cityName) {
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
  tempEl.textContent = "Temp: " + temp;
  currentWeatherEl.appendChild(tempEl);

  // Wind
  var windEl = document.createElement("p");
  windEl.textContent = "Wind: " + wind;
  currentWeatherEl.appendChild(windEl);

  // Humidity
  var humidityEl = document.createElement("p");
  humidityEl.textContent = "Humidity: " + humidity;
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
    
  }

}

coordFetch("Atlanta");