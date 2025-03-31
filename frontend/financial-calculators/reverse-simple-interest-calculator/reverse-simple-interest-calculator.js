// Reverse Simple Interest Calculator
document.getElementById('reverse-si-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent form submission

    // Get the input values
    const startingValue = parseFloat(document.querySelector('#reverse-si-form #starting-value').value);
    const interestRate = parseFloat(document.querySelector('#reverse-si-form #interest-rate').value);
    const timePeriod = parseFloat(document.querySelector('#reverse-si-form #time-period').value);

    // Calculate Simple Interest and Future Value
    const simpleInterest = (startingValue * interestRate * timePeriod) / 100;
    const futureValue = startingValue + simpleInterest;

    // Calculate the percentage of Simple Interest relative to the starting value
    const simpleInterestPercentage = (simpleInterest / startingValue) * 100;

    // Populate the table with calculated values
    const resultTable = document.querySelector('#reverse-si-calculator-container .result').querySelectorAll('td');

    resultTable[1].textContent = `₹${startingValue.toFixed(2)}`;
    resultTable[3].textContent = `${timePeriod}`;
    resultTable[5].textContent = `${interestRate}%`;
    resultTable[7].textContent = `₹${futureValue.toFixed(2)}`;
    resultTable[9].textContent = `${simpleInterestPercentage.toFixed(2)}%`; // Display as percentage
});