// Get the search input and button elements
const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');

// Add an event listener to the input field for the 'Enter' key press
searchInput.addEventListener('keydown', (event) => {
  // When 'Enter' key is pressed, trigger the search function
  if (event.key === 'Enter') searchCountriesByName();
});

// Add an event listener to the search button for click event
searchBtn.addEventListener('click', searchCountriesByName);

// Function to search for countries by name
function searchCountriesByName() {
  // Get the search query, convert to lowercase, and remove extra spaces
  const query = searchInput.value.toLowerCase().trim();

  // Filter countries based on the query (match either official or common name)
  const filteredCountries = storedCountriesInfo.filter(
    (country) =>
      country.name.official.toLowerCase().includes(query) ||
      country.name.common.toLowerCase().includes(query)
  );

  // Render the filtered list of countries
  rendercountries(filteredCountries);
}

// Add event listeners to load the country data and initialize the app
window.addEventListener('load', fetchCountriesInfo); // Fetch country data on page load
window.addEventListener('load', init); // Initialize the app and render countries on page load
