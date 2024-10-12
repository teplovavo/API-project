// API key for the exchange rate API
const apiKey = '348d391ecec20f74720a63d0';

import { handleCountrySearch } from './search.js';

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

console.log("Hello");

// Fetch the list of currencies and populate dropdowns
async function getCurrencies() {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`);
        const data = await response.json();
        const currencyList = data.supported_codes; // Array of country-currency pairs
        displayCurrencies(currencyList); // Pass the list to display in the dropdowns
    } catch (error) {
        console.error('Error fetching currency list:', error);
    }
}

// Function to display the currencies in dropdowns
function displayCurrencies(currencyList) {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const amountInput = document.getElementById('amount');

    fromCurrency.innerHTML = '';
    toCurrency.innerHTML = '';

    currencyList.forEach(([code, name]) => {
        const optionFrom = document.createElement('option');
        optionFrom.value = code;
        optionFrom.text = `${code} - ${name}`;
        fromCurrency.appendChild(optionFrom);

        const optionTo = document.createElement('option');
        optionTo.value = code;
        optionTo.text = `${code} - ${name}`;
        toCurrency.appendChild(optionTo);
    });

    fromCurrency.value = 'USD';
    toCurrency.value = 'EUR';
    amountInput.value = 100;
}

// Function to handle currency conversion
async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    if (!amount || !fromCurrency || !toCurrency) {
        document.getElementById('result').innerText = 'Please fill in all fields';
        return;
    }

    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`);
        const data = await response.json();
        const rate = data.conversion_rates[toCurrency];

        if (!rate) {
            document.getElementById('result').innerText = 'Invalid currency code';
            return;
        }

        const convertedAmount = (amount * rate).toFixed(2);
        document.getElementById('result').innerText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    } catch (error) {
        document.getElementById('result').innerText = 'Error fetching conversion rates';
    }
}

// Function to swap the selected currencies and recalculate the conversion
function swapCurrencies() {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    convertCurrency();
}

// Base URL for MockAPI
const mockApiUrl = 'https://mockapi.io/clone/6709e018af1a3998baa28411';

// Function to send a POST request to MockAPI to save the country
async function saveFavoriteCountry(country) {
    try {
        const response = await fetch(mockApiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(country)
        });

        if (!response.ok) {
            throw new Error('Failed to save the country');
        }

        const savedCountry = await response.json();
        console.log('Country saved to MockAPI:', savedCountry);
        displaySavedCountries();
    } catch (error) {
        console.error('Error saving country to MockAPI:', error);
    }
}

// Function to display the list of saved favorite countries from MockAPI
async function displaySavedCountries() {
    const savedCountriesList = document.getElementById('savedCountriesList');
    savedCountriesList.innerHTML = ''; 

    try {
        const response = await fetch(mockApiUrl);
        if (!response.ok) {
            throw new Error('Failed to fetch saved countries');
        }

        const favorites = await response.json();
        favorites.forEach(country => {
            const listItem = document.createElement('li');
            listItem.textContent = `${country.name.common}`;
            savedCountriesList.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching countries from MockAPI:', error);
    }
}

// Function to handle saving a selected country from the search field
function handleCountrySave() {
    const searchInput = document.getElementById('countrySearch').value.trim();

    if (!searchInput) {
        document.getElementById('saveResult').innerText = 'Please enter a country name to save.';
        return;
    }

    const selectedCountry = { name: { common: searchInput } };
    saveFavoriteCountry(selectedCountry);
    document.getElementById('saveResult').innerText = `Saved country: ${selectedCountry.name.common}`;
}
