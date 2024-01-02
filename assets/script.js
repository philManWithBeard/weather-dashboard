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
