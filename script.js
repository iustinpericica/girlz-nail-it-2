function getTextInput() {
    return document.getElementById('textInput').value;
}

function displayResult(message) {
    alert(message);
}

document.getElementById('analyzeButton').addEventListener('click', () => {
    const text = getTextInput();
    displayResult(`Analyzing sentiment for: "${text}"`);
});
