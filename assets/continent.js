const regionSelect = document.getElementById('region-select');
const searchBtnRegion = document.getElementById('search-btn-region');

function searchCountriesByRegion() {
  const region = regionSelect.value.toLowerCase();
  const filteredCountries = storedCountriesInfo.filter((country) =>
    country.region.toLowerCase().includes(region)
  );
  rendercountries(filteredCountries);
}

searchBtnRegion.addEventListener('click', searchCountriesByRegion);

window.addEventListener('load', init);