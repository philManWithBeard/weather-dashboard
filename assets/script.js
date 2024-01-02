// References to important DOM elements
const formHeadingEl = $("#form-heading");
const searchFormEl = $("#search-form");
const searchInputEl = $("#search-input");
const searchButtonEl = $("#search-button");
const historyEl = $("#history");
const todayEl = $("#today");
const forecastEl = $("#forecast");

// API key
const apiKey = "4ced624ce41090f360874722c5d79801";

// Handler for set data
let setData = (city) => {
  let data = getData(); // call getdata handler for getting data from localstorage
  let change = 0;

  // Look through existing data
  data.forEach((existingCity, i) => {
    // See if there's already an entry for this city
    if (existingCity == city) {
      change++;
    }
  });

  // If there's no existing entry then create one
  if (change === 0) {
    data.push(city);
  }

  // Convert to JSON and store data in localstorage
  data = JSON.stringify(data);
  localStorage.setItem("cityList", data);
};

// Handler for getting data
let getData = () => {
  // Get data from localstorage
  let data = JSON.parse(localStorage.getItem("cityList"));

  // If there's no data then create an empty array
  if (!data) {
    data = [];
  }

  // Create buttons for each saved entry
  historyEl.empty();
  data.forEach((city) => {
    historyEl.append(
      `<button type="submit" class="mt-2 btn-secondary" >${city}</button>`
    );
  });

  // Return the data that we've got
  return data;
};

// Validate input when the user clicks the search button
searchButtonEl.on("click", function (event) {
  // prevent the default button behaviour
  event.preventDefault();

  // Validate whether the user has entered anything
  if (searchInputEl.val() < 1) {
    alert("Error: Enter A City Name");
  }

  // Validate whether the user has entered letters or whitespace
  else if (!searchInputEl.val().match(/^[A-Za-z\s]*$/)) {
    alert("Error: City name can only contain letters");
  }

  // Validate whether the user has entered too much whitespace
  else if (searchInputEl.val().match(/\s{2,}/)) {
    alert("Error: City name has too many spaces");
  }

  // If it passes all validation tests then call the fetchData function, passing the user input in as a parameter
  else {
    fetchData(searchInputEl.val());
  }
});

// Function to retrieve forecast data
const fetchData = (cityName) => {
  // builds the query
  const locationQuery = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${apiKey}`;

  // Promise to query openweathermap geo and return json
  fetch(locationQuery)
    // Promise to parse json to a javascript object
    .then((response) => response.json())
    // Promise to call a second api
    .then((locationData) => {
      // Validate the first api call. If it returns an empty array then alert the user and return
      if (locationData.length === 0) {
        alert("Error: City has not been found");
        return;
      }

      // Call the set data function to save the city name
      setData(cityName);

      // Set variables to use in the 2nd api call
      const lat = locationData[0].lat;
      const lon = locationData[0].lon;

      // builds the query
      const weatherQuery = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;

      // Promise to query openweathermap forecast and return json
      fetch(weatherQuery)
        // Promise to parse json to a javascript object
        .then((response) => response.json())
        // Promise to call the presentWeather function using the javascript object as a parameter. Also  call the getData function to refresh the list of city buttons
        .then((weatherData) => {
          presentWeather(weatherData);
          getData();
        });
    })
    // console any errors returned
    .catch(console.error);
};

/ Display the weather in the browser
const presentWeather = (weatherData) => {
  // Reset any previous results
  todayEl.empty();
  forecastEl.empty();

  // What is the forecast for now
  const now = weatherData.list[0];

  // Display the forecast for now
  todayEl
    .addClass("border border-dark p-2")
    .append(
      `<h2 class="p-0">${weatherData.city.name} (${dayjs(now.dt_txt).format(
        "DD/MM/YYYY"
      )})<img src="https://openweathermap.org/img/wn/${
        now.weather[0].icon
      }@2x.png" height="50px" alt="${now.weather[0].main} emoji"></h2>`,
      `<p>Temp: ${now.main.temp}°C</p>`,
      `<p>Wind: ${now.wind.speed} KPH</p>`,
      `<p>Humidiity: ${now.main.humidity}°C</p>`
    );

  // Filter the data so that it only shows 5 days worth (40 results divided by 8)
  const fiveDays = weatherData.list.filter(
    (day, index) => (index + 1) % 8 === 0
  );

  // Create a div to hold the results
  const fiveDayEl = $(`<div class="fiveDayContainer">`);

  // Iterate over the 5 day forecast and append them to the five day container div
  fiveDays.forEach((day) => {
    const forecastContain = $(
      `<div class="forecastContainer p-3 bg-dark">`
    ).append(
      `<h5 class="">${dayjs(day.dt_txt).format("DD/MM/YYYY")}</h5>`,
      `<img src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" height="50px" alt="${day.weather[0].main} emoji">`,
      `<p>Temp: ${day.main.temp}°C</p>`,
      `<p>Wind: ${day.wind.speed} KPH</p>`,
      `<p>Humidiity: ${day.main.humidity}°C</p>`
    );

    fiveDayEl.append(forecastContain);
  });

  // Append section title
  forecastEl.append("<h3>5-Day Forecast:</h3>");

  // Append the results to the section
  forecastEl.append(fiveDayEl);
};