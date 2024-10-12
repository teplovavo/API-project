// API key 
const apiKey = '348d391ecec20f74720a63d0';

import { handleCountrySearch } from './search.js';
console.log("Travel");


// Ensure that all event listeners are added after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('countrySearchBtn').addEventListener('click', handleCountrySearch);
    document.getElementById('convertBtn').addEventListener('click', convertCurrency);
    document.getElementById('swapBtn').addEventListener('click', swapCurrencies);
    document.getElementById('saveCountryAction').addEventListener('click', handleCountrySave);

    // Fetch and display the list of currencies
    getCurrencies();

    // Display saved countries from MockAPI when the page loads
    displaySavedCountries();
});



// Fetch the list of currencies and populate dropdowns
async function getCurrencies() {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`); //API link
        const data = await response.json();
        const currencyList = data.supported_codes; // Array of country-currency pairs
        displayCurrencies(currencyList); // Pass the list to display in the dropdowns
    } catch (error) {
        console.error('Error fetching currency list:', error); //Error handling
    }
}

// Function to display the currencies in dropdowns
function displayCurrencies(currencyList) {
    const fromCurrency = document.getElementById('fromCurrency'); 
    const toCurrency = document.getElementById('toCurrency');
    const amountInput = document.getElementById('amount');

    fromCurrency.innerHTML = ''; //Clear list
    toCurrency.innerHTML = ''; //Clear list

    currencyList.forEach(([code, name]) => {
        const optionFrom = document.createElement('option'); 
        optionFrom.value = code;
        optionFrom.text = `${code} - ${name}`; //Display country currency pair
        fromCurrency.appendChild(optionFrom); //Add to dropdown

        const optionTo = document.createElement('option'); //Create new dropdown
        optionTo.value = code; //Set currency code
        optionTo.text = `${code} - ${name}`; //Display country currency pair
        toCurrency.appendChild(optionTo); //Add to dropdown
    });

    // Set default values
    fromCurrency.value = 'USD'; 
    toCurrency.value = 'EUR';
    amountInput.value = 100;
}

// Function to handle currency conversion
async function convertCurrency() {
    const amount = document.getElementById('amount').value; //Get amount
    const fromCurrency = document.getElementById('fromCurrency').value; //Get from currency
    const toCurrency = document.getElementById('toCurrency').value; //Get to currency

    if (!amount || !fromCurrency || !toCurrency) {
        document.getElementById('result').innerText = 'Please fill in all fields'; //Error handling
        return; //Stop execution
    }

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`); //API link
        const data = await response.json(); //Get data
        const rate = data.conversion_rates[toCurrency]; //  Get conversion rate

        if (!rate) {
            document.getElementById('result').innerText = 'Invalid currency code'; //Error handling
            return;
        }

        const convertedAmount = (amount * rate).toFixed(2);  //Calculate converted amount
        document.getElementById('result').innerText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`; //Display result
    } catch (error) {
        document.getElementById('result').innerText = 'Error fetching conversion rates'; //Error handling
    }
}

// Function to swap the selected currencies and recalculate the conversion
function swapCurrencies() {
    const fromCurrency = document.getElementById('fromCurrency');  //Get from currency
    const toCurrency = document.getElementById('toCurrency');  //Get to currency
    const temp = fromCurrency.value;  //Get from currency value
    fromCurrency.value = toCurrency.value;  //Set from currency value to to currency
    toCurrency.value = temp; //Set to currency value to from currency
    convertCurrency(); //Recalculate conversion
}


// Function to handle country save
// Base URL for MockAPI
const mockApiUrl = 'https://mockapi.io/clone/6709e018af1a3998baa28411';

// Function to send a POST request to MockAPI to save the country
async function saveFavoriteCountry(country) {
    try {
        const response = await fetch(mockApiUrl, {
            method: 'POST', // POST request
            headers: {
                'Content-Type': 'application/json'  // Specify the content type
            },
            body: JSON.stringify(country)  // Convert the country object to a JSON string
        });

        if (!response.ok) {
            throw new Error('Failed to save the country');  // Error handling
        }

        const savedCountry = await response.json(); // Get the saved country
        console.log('Country saved to MockAPI:', savedCountry); // Log the saved country
        displaySavedCountries(); // Display the list of saved countries
    } catch (error) {
        console.error('Error saving country to MockAPI:', error); // Error handling
    }
}


// Function to display the list of saved favorite countries from MockAPI
async function displaySavedCountries() {
    const savedCountriesList = document.getElementById('savedCountriesList'); // Get the list of saved countries
    savedCountriesList.innerHTML = ''; // Clear the list

    try {
        const response = await fetch(mockApiUrl); // Fetch the list of saved countries
        if (!response.ok) {  // Check if the request was successful
            throw new Error('Failed to fetch saved countries'); // Error handling
        }

        const favorites = await response.json(); // Get the list of saved countries
        favorites.forEach(country => { // Loop through the list of saved countries
            const listItem = document.createElement('li');  // Create a list item
            listItem.textContent = `${country.name.common}`;    // Set the list item text
            savedCountriesList.appendChild(listItem);   // Add the list item to the list
        });
    } catch (error) {
        console.error('Error fetching countries from MockAPI:', error); //  Error handling
    }
}




// Function to handle saving a selected country from the search field
function handleCountrySave() {
    const searchInput = document.getElementById('countrySearch').value.trim(); // Get the search query

    if (!searchInput) {  // Check if the search input is empty
        document.getElementById('saveResult').innerText = 'Please enter a country name to save.'; // Error handling
        return; // Stop execution
    }

    const selectedCountry = { name: { common: searchInput } };   // Create the country object

    saveFavoriteCountry(selectedCountry); // Call the function to save the country

    document.getElementById('saveResult').innerText = `Saved country: ${selectedCountry.name.common}`; // Display the saved country
}
