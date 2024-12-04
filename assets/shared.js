// Elements for side navigation and modal dialog
const sideNav = document.getElementById('sidenav-container');
const modal = document.getElementById('modal');
const modalNameCommon = document.getElementById('modal-name-common');
const modalNameOfficial = document.getElementById('modal-name-official');
const modalCapital = document.getElementById('modal-capital');
const modalPopulation = document.getElementById('modal-population');
const modalFlag = document.getElementById('modal-flag');

// Variables for the map and marker
let map;
let marker;

// Array to store countries' data
let storedCountriesInfo = [];

// Function to set map coordinates and add a marker
function setMapCoordinates(lat, lng) {
  if (!map) {
    // Initialize the map if it hasn't been initialized
    map = L.map('map').setView([lat, lng], 2); // Set initial map view with coordinates
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);
    marker = L.marker([lat, lng]).addTo(map); // Add the marker on the map
  } else {
    map.setView([lat, lng], 2); // Update the map's view with new coordinates
    if (marker) {
      marker.setLatLng([lat, lng]); // Update the marker's position
    } else {
      marker = L.marker([lat, lng]).addTo(map); // Add a new marker if none exists
    }
  }
}

// Event listener to hide the side navigation on window resize
window.addEventListener('resize', () => (sideNav.style.display = 'none'));

// Functions to control side navigation visibility
function openSidenav() {
  sideNav.style.display = 'block'; // Show the side navigation
}

function closeSidenav() {
  sideNav.style.display = 'none'; // Hide the side navigation
}

// Function to close the modal
function closeModal() {
  modal.style.display = 'none'; // Hide the modal
}

// Function to retrieve country data, either from local storage or from the API
async function retrieveCountriesInfo() {
  if (!manageLocalStorage()) {
    // If data is not in localStorage, fetch it
    await fetchCountriesInfo();
  }
  return storedCountriesInfo; // Return the stored countries info
}

// Function to check if country data is available in localStorage
function manageLocalStorage() {
  const localData = localStorage.getItem('countries');
  if (localData) {
    // If data exists in localStorage, parse and use it
    storedCountriesInfo = JSON.parse(localData);
    return true;
  } else {
    return false; // No data in localStorage
  }
}

// Function to fetch country data from the API
async function fetchCountriesInfo() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    if (!response.ok) {
      throw new Error(
        'Error retrieving countries information, please try again later'
      );
    }
    storedCountriesInfo = await response.json(); // Parse the response data
    localStorage.setItem('countries', JSON.stringify(storedCountriesInfo)); // Save data to localStorage
  } catch (error) {
    console.error(error); // Log any errors
    alert('Failed to load countries information. Please try again later.'); // Show error message
  }
}

// Initialize the app by fetching and rendering countries data
async function init() {
  const countries = await retrieveCountriesInfo(); // Fetch country info
  rendercountries(countries); // Render country data
}

// Function to render the countries' information in the DOM
function rendercountries(countries) {
  const searchResultsContainer = document.getElementById('search-results');
  searchResultsContainer.innerHTML = ''; // Clear the results container before adding new content

  // If no countries are found, display a message
  if (countries.length === 0) {
    searchResultsContainer.innerHTML =
      '<h3 class="result-msg">No countries found.</h3>';
    return;
  }

  // Iterate through the countries and create cards for each
  countries.forEach((country) => {
    const countryCard = document.createElement('div');
    countryCard.className = 'card country-card'; // Set class for styling
    countryCard.innerHTML = `
      <img src='${country.flags.png}' alt='Flag of ${country.name.official}' class='flag'>
      <div class='country-info'>
        <h3>${country.name.common}</h3>
        <p>${country.name.official}</p>
      </div>
    `;

    // Add an event listener for when a country card is clicked
    countryCard.addEventListener('click', () => {
      // Format the population number with commas
      const formattedPopulation = country.population.toLocaleString();

      // Display in the modal

      modal.style.display = 'flex'; // Show the modal with country details
      modalNameCommon.textContent = `Common name: ${country.name.common}`;
      modalNameOfficial.textContent = `Official name: ${country.name.official}`;
      modalCapital.textContent = `Capital: ${country.capital}`;
      modalPopulation.textContent = `Population: ${formattedPopulation}`;
      modalFlag.innerHTML = `<img src='${country.flags.png}' alt='Flag of ${country.name.official}' class='modal-flag'>`;

      // Check if coordinates exist, then set map coordinates
      if (country.latlng && country.latlng.length >= 2) {
        let lat = parseFloat(country.latlng[0]);
        let lng = parseFloat(country.latlng[1]);
        setMapCoordinates(lat, lng); // Update map coordinates
      } else {
        console.error(`No coordinates available for ${country.name.common}`); // Log error if no coordinates
      }
    });

    // Append the country card to the search results container
    searchResultsContainer.appendChild(countryCard);
  });
}
