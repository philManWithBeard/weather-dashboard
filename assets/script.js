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
