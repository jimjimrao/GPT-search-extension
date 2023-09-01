document.getElementById('searchButton').addEventListener('click', async () => {
  const apiKey = document.getElementById('apiKeyInput').value; // Get the entered API key
  const query = document.getElementById('query').value;
  const responseElement = document.getElementById('response');
  responseElement.textContent = 'Loading...';

  const requestBody = {
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: query
      }
    ],
    temperature: 0.8,
    max_tokens: 300
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // Use the entered API key
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    const content = data.choices[0].message.content;
    responseElement.textContent = content;
  } catch (error) {
    responseElement.textContent = 'An error occurred. Please try again. Here is the error: ' + error;
    console.error(error);
  }
});

document.getElementById('query').addEventListener('keydown', event => {
  if (event.keyCode === 13) { // Check if the pressed key is Enter (key code 13)
    event.preventDefault(); // Prevent the default behavior of the Enter key (form submission)
    document.getElementById('searchButton').click(); // Programmatically trigger the search button click event
  }
});