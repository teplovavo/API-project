console.log("Hello")



const apiKey = '348d391ecec20f74720a63d0'; 

        //get the list of currencies
        async function getCurrencies() {
            try {
                // Call the API to get supported currency codes
                const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`);
                const data = await response.json();
                const currencyList = data.supported_codes;

                // Get the dropdown elements
                const fromCurrency = document.getElementById('fromCurrency');
                const toCurrency = document.getElementById('toCurrency');

                // Loop through the currency list and create options for dropdowns
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


            } catch (error) {
                //log the error
                console.error('Error fetching currency list:', error);
            }

        }


        
        // Call the function to get currencies when the page loads
        window.onload = getCurrencies;

        // Function to convert currency
        async function convertCurrency() {
            // Get values from the inputs
            const amount = document.getElementById('amount').value; 
            const fromCurrency = document.getElementById('fromCurrency').value; 
            const toCurrency = document.getElementById('toCurrency').value; 

            // Check if the user filled all fields
            if (!amount || !fromCurrency || !toCurrency) {
                document.getElementById('result').innerText = 'Please fill in all fields'; // Show error message
                return; // Stop if fields are empty
            }

            try {
                // Fetch exchange rate data for the selected currency
                const response = await fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/latest/${fromCurrency}`); 
                const data = await response.json(); 
                const rate = data.conversion_rates[toCurrency]; 

                // Check if the target currency is valid
                if (!rate) {
                    document.getElementById('result').innerText = 'Invalid currency code';
                    return;
                }

                // Calculate the converted amount and show it
                const convertedAmount = (amount * rate).toFixed(2);
                document.getElementById('result').innerText = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
            } catch (error) {
                // If there's an error during the fetch, show an error message
                document.getElementById('result').innerText = 'Error fetching conversion rates';
            }
        }