// Simple Interest Calculator
document.getElementById('si-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get the input values
    const startingValue = parseFloat(document.querySelector('#si-form #starting-value').value);
    const endingValue = parseFloat(document.querySelector('#si-form #ending-value').value);
    const timePeriod = parseFloat(document.querySelector('#si-form #time-period').value);

    // Calculate Simple Interest and Future Value
    const simpleInterest = (endingValue - startingValue);

    // Calculate the percentage of Simple Interest relative to the starting value
    const simpleInterestPercentage = (simpleInterest / startingValue) * 100;

    // Populate the table with calculated values
    const resultTable = document.querySelector('#si-calculator-container .result').querySelectorAll('td');

    resultTable[1].textContent = `₹${startingValue.toFixed(2)}`;
    resultTable[3].textContent = `₹${endingValue.toFixed(2)}`;
    resultTable[5].textContent = `${timePeriod}`;
    resultTable[7].textContent = `${simpleInterestPercentage.toFixed(2)}%`; // Display as percentage
});


