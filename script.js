const history = []; // Array to store notes

// Load history from Local Storage
function loadHistoryFromLocalStorage() {
    const savedHistory = JSON.parse(localStorage.getItem('historyLog')) || [];
    savedHistory.forEach(entry => history.push(entry)); // Load into history array
    updateHistoryLog();
}

// Save history to Local Storage
function saveHistoryToLocalStorage() {
    localStorage.setItem('historyLog', JSON.stringify(history));
}

// Function to get input text
function getTextInput() {
    return document.getElementById('textInput').value;
}

// Function to display result
function displayResult(message) {
    document.getElementById('result').innerText = message;
}

// Function to update history log display
function updateHistoryLog() {
    const historyLog = document.getElementById('historyLog');
    historyLog.innerHTML = ""; // Clear the existing log
    history.forEach((entry) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.date}: ${entry.note}`;
        historyLog.appendChild(listItem);
    });
}

// Function to add note to history
function addNote() {
    const text = getTextInput().trim();
    if (text === "") {
        displayResult("Please enter some text to add to the history.");
        return;
    }
    const date = new Date().toLocaleString();
    const newEntry = { date, note: text };
    history.push(newEntry);
    updateHistoryLog();
    saveHistoryToLocalStorage(); // Save updated history to Local Storage
    displayResult("Note added to history.");
    document.getElementById('textInput').value = ""; // Clear input after adding
}

// Function to analyze all notes together
async function analyzeAllNotes() {
    if (history.length === 0) {
        displayResult("No notes in history to analyze.");
        return;
    }
    const allNotesText = history.map(entry => entry.note).join(". ");
    try {
        const sentiment = await analyzeSentiment(allNotesText);
        displayResult(`Combined Sentiment: ${sentiment}`);
    } catch (error) {
        displayResult("Error analyzing sentiment. Please try again.");
    }
}

// Function to send the text to GPT-4-turbo for sentiment analysis
async function analyzeSentiment(text) {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${config.API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant for analyzing sentiment." },
                { role: "user", content: `Analyze the sentiment of this text: "${text}"` }
            ],
            max_tokens: 1000
        })
    });
    const data = await response.json();
    return data.choices[0].message.content.trim();
}

// Function to clear history
function clearHistory() {
    history.length = 0; // Clear the history array
    updateHistoryLog(); // Update display
    localStorage.removeItem('historyLog'); // Remove from Local Storage
    displayResult("History cleared.");
}

// Load history when page loads
window.addEventListener('load', loadHistoryFromLocalStorage);

// Event listeners
document.getElementById('addNoteButton').addEventListener('click', addNote);
document.getElementById('analyzeAllButton').addEventListener('click', analyzeAllNotes);
document.getElementById('clearHistoryButton').addEventListener('click', clearHistory);
