const searchInput = document.getElementById('search');
const searchBtn = document.getElementById('search-btn');

searchInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') searchCountriesByName();
});
searchBtn.addEventListener('click', searchCountriesByName);

function searchCountriesByName() {
  const query = searchInput.value.toLowerCase().trim();
  const filteredCountries = storedCountriesInfo.filter(
    (country) =>
      country.name.official.toLowerCase().includes(query) ||
      country.name.common.toLowerCase().includes(query)
  );
  rendercountries(filteredCountries);
}

window.addEventListener('load', init);