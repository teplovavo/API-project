// API key for the exchange rate API
const apiKey = '348d391ecec20f74720a63d0';

// Function to fetch the list of countries and currencies from the API
export async function getCountryCurrencyData() {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`);
        const data = await response.json();
        return data.supported_codes; // Return the list of country-currency pairs
    } catch (error) {
        console.error('Error fetching country-currency data:', error);
        return [];
    }
}

// Function to filter countries based on the input search query
export function filterByCountry(searchQuery, countryCurrencyList) {
    // Filter the list to match the search query with country names
    return countryCurrencyList.filter(([code, country]) =>
        country.toLowerCase().includes(searchQuery.toLowerCase())
    );
}

// Function to handle country search
export async function handleCountrySearch() {
    const searchQuery = document.getElementById('countrySearch').value.trim(); // Get the search query
    const resultDisplay = document.getElementById('countryResult'); // Get the result display element

    // Clear previous search results
    resultDisplay.innerHTML = '';

    // If the search input is empty, show a message and stop the function
    if (!searchQuery) {
        resultDisplay.innerHTML = 'Please enter a country name';
        return;
    }

    try {
        // Fetch the country and currency data
        const countryCurrencyList = await getCountryCurrencyData();
        
        // Filter the data based on the user's search query
        const filteredCountries = filterByCountry(searchQuery, countryCurrencyList);

        // If no countries matched, show a message
        if (filteredCountries.length === 0) {
            resultDisplay.innerHTML = 'No countries found';
            return;
        }

        // Display the matching countries and their currencies
        filteredCountries.forEach(([currencyCode, countryName]) => {
            const listItem = document.createElement('li');
            listItem.textContent = `${countryName}: ${currencyCode}`;
            resultDisplay.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching country-currency data:', error);
        resultDisplay.innerHTML = 'Error fetching data';
    }
}
