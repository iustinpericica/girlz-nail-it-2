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
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer YOUR-KEY`
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
    return data.choices[0].message.content;
}
