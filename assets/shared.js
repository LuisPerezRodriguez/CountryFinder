const sideNav = document.getElementById('sidenav-container');
const modal = document.getElementById('modal');
const modalNameCommon = document.getElementById('modal-name-common');
const modalNameOfficial = document.getElementById('modal-name-official');
const modalCapital = document.getElementById('modal-capital');
const modalPopulation = document.getElementById('modal-population');
const modalFlag = document.getElementById('modal-flag');
let map;
let marker;

let storedCountriesInfo = [];

function setMapCoordinates(lat, lng) {
  if (!map) {  // Check if the map has been initialized
    map = L.map('map').setView([lat, lng], 2);  // Initialize map with the provided coordinates
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    // Add the marker for the first time
    marker = L.marker([lat, lng]).addTo(map);
  } else {
    // Update the map's center position
    map.setView([lat, lng], 2);  

    if (marker) {
      marker.setLatLng([lat, lng]);  // Update the marker's position without removing it
    } else {
      // If no marker exists, add a new one
      marker = L.marker([lat, lng]).addTo(map);
    }
  }
}


window.addEventListener('resize', () => (sideNav.style.display = 'none'));

function openSidenav() {
  sideNav.style.display = 'block';
}
function closeSidenav() {
  sideNav.style.display = 'none';
}
window.addEventListener('resize', () => (sideNav.style.display = 'none'));

function closeModal() {
  modal.style.display = 'none';
}

async function retrieveCountriesInfo() {
  if (!manageLocalStorage()) {
    await fetchCountriesInfo();
  }
  return storedCountriesInfo;
}

function manageLocalStorage() {
  const localData = localStorage.getItem('countries');
  if (localData) {
    storedCountriesInfo = JSON.parse(localData);
    return true;
  }
  else{
    return false;
  }
}

async function fetchCountriesInfo() {
  try {
    const response = await fetch('https://restcountries.com/v3.1/all');
    if (!response.ok)
      throw new Error(
        'Error retrieving countries information please try again later'
      );
    storedCountriesInfo = await response.json();
    localStorage.setItem('countries', JSON.stringify(storedCountriesInfo));
  } catch (error) {
    alert(error);
  }
}

async function init() {
  const countries = await retrieveCountriesInfo();
  rendercountries(countries);
}

function rendercountries(countries) {
  const searchResultsContainer = document.getElementById('search-results');
  searchResultsContainer.innerHTML = '';
  if (countries.length === 0) {
    searchResultsContainer.innerHTML = '<h3 class="result-msg">No countries found.</h3>';
    return;
  }
  countries.forEach((country) => {
    const countryCard = document.createElement('div');
    countryCard.className = 'card country-card';
    countryCard.innerHTML = `
      <img src='${country.flags.png}' alt='Flag of ${country.name.official}' class='flag''>
      <div class = 'country-info'>  
        <h3>${country.name.common}</h3>
        <p>${country.name.official}</p>
      </div>
    `;
    countryCard.addEventListener('click', () => {
      modal.style.display = 'flex'; // Show modal
      modalNameCommon.textContent = `Common name: ${country.name.common}`;
      modalNameOfficial.textContent = `Official name: ${country.name.official}`;
      modalCapital.textContent = `Capital: ${country.capital}`;
      modalPopulation.textContent = `Population: ${country.population}`;
      modalFlag.innerHTML = `<img src='${country.flags.png}' alt='Flag of ${country.name.official}' class='modal-flag'>`;
      let latlng = country.latlng;  // latlng is an array
      let lat = parseFloat(latlng[0]);  // Convert to float
      let lng = parseFloat(latlng[1]);  
      setMapCoordinates(lat,lng);
    });

    searchResultsContainer.appendChild(countryCard);
  });
}