// API key for the exchange rate API
const apiKey = '348d391ecec20f74720a63d0';

import { handleCountrySearch } from './search.js';

// Adding event listeners for the buttons
document.getElementById('countrySearchBtn').addEventListener('click', handleCountrySearch);
document.getElementById('convertBtn').addEventListener('click', convertCurrency);
document.getElementById('swapBtn').addEventListener('click', swapCurrencies);

console.log("Hello");

// Fetch the list of currencies and populate dropdowns
async function getCurrencies() {
    try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`);
        const data = await response.json();
        const currencyList = data.supported_codes; // Array of country-currency pairs
        displayCurrencies(currencyList); // Pass the list to display in the dropdowns
    } catch (error) {
        console.error('Error fetching currency list:', error); // Log any errors from the API
    }
}

// Function to display the currencies in dropdowns
function displayCurrencies(currencyList) {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const amountInput = document.getElementById('amount');

    // Clear current dropdown options before adding new ones
    fromCurrency.innerHTML = '';
    toCurrency.innerHTML = '';

    // Populate dropdowns with available currencies
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

    // Set default currencies to USD and EUR for user convenience
    fromCurrency.value = 'USD';
    toCurrency.value = 'EUR';

    // Set default amount to 100
    amountInput.value = 100;
}

// Function to handle currency conversion
async function convertCurrency() {
    const amount = document.getElementById('amount').value;
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;

    // Check if all fields are filled in
    if (!amount || !fromCurrency || !toCurrency) {
        document.getElementById('result').innerText = 'Please fill in all fields';
        return;
    }

    try {
        // Fetch exchange rate data for the selected currency
        const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`);
        const data = await response.json();
        const rate = data.conversion_rates[toCurrency];

        // Check if the currency conversion rate is available
        if (!rate) {
            document.getElementById('result').innerText = 'Invalid currency code';
            return;
        }

        // Calculate the converted amount and display it
        const convertedAmount = (amount * rate).toFixed(2);
        document.getElementById('result').innerText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
    } catch (error) {
        // Handle any errors during the API request
        document.getElementById('result').innerText = 'Error fetching conversion rates';
    }
}

// Function to swap the selected currencies and recalculate the conversion
function swapCurrencies() {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');

    // Swap the selected currencies
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    // Recalculate the conversion after swapping
    convertCurrency();
}

// Fetch and display the list of currencies when the page loads
window.onload = getCurrencies;
