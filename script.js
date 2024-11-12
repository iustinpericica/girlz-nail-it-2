function getTextInput() {
    return document.getElementById('textInput').value;
}

function displayResult(message) {
    document.getElementById('result').innerText = message;
}

document.getElementById('analyzeButton').addEventListener('click', async () => {
    const text = getTextInput().trim();
    if (text === "") {
        displayResult("Please enter some text to analyze.");
        return;
    }
    try {
        const sentiment = await analyzeSentiment(text);
        displayResult(`Sentiment: ${sentiment}`);
    } catch (error) {
        displayResult("Error analyzing sentiment. Please try again.");
    }
});


async function analyzeSentiment(text) {
    const response = await fetch("https://api.openai.com/v1/engines/davinci-codex/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer YOUR_API_KEY`
        },
        body: JSON.stringify({
            prompt: `Analyze the sentiment of this text: "${text}"`,
            max_tokens: 10
        })
    });
    const data = await response.json();
    return data.choices[0].text.trim();
}
