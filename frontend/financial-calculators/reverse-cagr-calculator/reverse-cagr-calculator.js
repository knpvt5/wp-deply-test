// Event listener for the Reverse CAGR calculator
document.getElementById('reverse-cagr-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get the input values for Reverse CAGR calculation
    const startingValue = parseFloat(document.getElementById('reverse-cagr-calculator-container').querySelector('#starting-value').value);
    const interestRate = parseFloat(document.getElementById('reverse-cagr-calculator-container').querySelector('#interest-rate').value) / 100;
    const timePeriod = parseFloat(document.getElementById('reverse-cagr-calculator-container').querySelector('#time-period').value);

    // Calculate the Future Value
    const futureValue = startingValue * Math.pow((1 + interestRate), timePeriod);

    // Populate the table with calculated values
    const resultTable = document.querySelector('#reverse-cagr-calculator-container .result').querySelectorAll('td');

    resultTable[1].textContent = `₹${startingValue.toFixed(2)}`;
    resultTable[3].textContent = `${timePeriod}`;
    resultTable[5].textContent = `${(interestRate * 100).toFixed(2)}%`;
    resultTable[7].textContent = `₹${futureValue.toFixed(2)}`;
});