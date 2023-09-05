// Function to retrieve the API key from chrome.storage.sync
const getApiKey = async () => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get('apiKey', ({ apiKey }) => {
      if (apiKey) {
        resolve(apiKey);
      } else {
        reject(new Error('API key not found'));
      }
    });
  });
};

// Function to save the API key to chrome.storage.sync
const setApiKey = async (apiKey) => {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.set({ apiKey }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        displayApiKey();
        resolve();
      }
    });
  });
};

// Function to display the API key if it exists
const displayApiKey = async () => {
  try {
    const apiKey = await getApiKey();
    const apiKeyDisplay = document.getElementById('apiKeyDisplay');
    if (apiKey) {
      const asterisks = '*'.repeat(apiKey.length - 4);
      const maskedApiKey = `${asterisks}${apiKey.slice(-4)}`;
      apiKeyDisplay.textContent = `API Key: ${maskedApiKey}`;
    }
  } catch (error) {
    console.error(error);
  }
};

// Call the displayApiKey function when the popup is loaded
document.addEventListener('DOMContentLoaded', async () => {
  await displayApiKey();
});

// Event listener for the change API key button
document.getElementById('changeApiKeyButton').addEventListener('click', async () => {
  const newApiKey = prompt('Enter your new API key:');
  if (newApiKey) {
    try {
      await setApiKey(newApiKey);
      console.log('API key saved:', newApiKey);
    } catch (error) {
      console.error(error);
    }
  }
});

// Event listener for the search button
document.getElementById('searchButton').addEventListener('click', async () => {
  try {
    const apiKey = await getApiKey();
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

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}` // Use the retrieved API key
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API error: ${errorData.error.message}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    responseElement.textContent = content;
  } catch (error) {
    const responseElement = document.getElementById('response');
    responseElement.textContent = 'An error occurred. Please try again. \nError code: ' + error.message;
    console.error(error);
  }
});


document.getElementById('query').addEventListener('keydown', event => {
  if (event.keyCode === 13) { // Check if the pressed key is Enter (key code 13)
    event.preventDefault(); // Prevent the default behavior of the Enter key (form submission)
    document.getElementById('searchButton').click(); // Programmatically trigger the search button click event
  }
});
