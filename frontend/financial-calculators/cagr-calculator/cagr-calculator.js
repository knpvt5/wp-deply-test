// Event listener for the CAGR calculator
document.getElementById('cagr-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get the input values for CAGR calculation
    const startingValue = parseFloat(document.getElementById('starting-value').value);
    const endingValue = parseFloat(document.getElementById('ending-value').value);
    const timePeriod = parseFloat(document.getElementById('time-period').value);

    // Calculate the CAGR
    const cagr = Math.pow((endingValue / startingValue), (1 / timePeriod)) - 1;

    // Populate the table with calculated values
    const resultTable = document.querySelector('#cagr-calculator-container .result').querySelectorAll('td');

    resultTable[1].textContent = `₹${startingValue.toFixed(2)}`;
    resultTable[3].textContent = `₹${endingValue.toFixed(2)}`;
    resultTable[5].textContent = `${timePeriod}`;
    resultTable[7].textContent = `${(cagr * 100).toFixed(2)}%`;
});




