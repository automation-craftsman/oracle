const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const hostnameElement = document.getElementById('hostname');
const newQuoteBtn = document.getElementById('new-quote-btn');

// Function to fetch and validate the BACKEND_URL from config.json
async function getBackendUrl() {
  try {
    // Fetch the config file
    const configResponse = await fetch('/config.json');
    if (!configResponse.ok) {
      throw new Error('Failed to fetch config.json');
    }
    const config = await configResponse.json();

    // Ensure BACKEND_URL exists in the config
    if (!config.BACKEND_URL) {
      throw new Error('BACKEND_URL not found in config.json');
    }

    // Test the BACKEND_URL by making a request to the /quote endpoint
    const testResponse = await fetch(`${config.BACKEND_URL}/quote`);
    if (!testResponse.ok) {
      throw new Error('BACKEND_URL is not reachable');
    }

    // If the test succeeds, return the BACKEND_URL
    return config.BACKEND_URL;
  } catch (error) {
    console.error('Error determining BACKEND_URL:', error);
    // Fallback to localhost if anything goes wrong
    return 'http://localhost:3000';
  }
}

// Function to fetch a quote using the determined BACKEND_URL
async function fetchQuote() {
  try {
    const BASE_URL = await getBackendUrl();
    const response = await fetch(`${BASE_URL}/quote`);
    const data = await response.json();

    quoteElement.textContent = `"${data.quote}"`;
    authorElement.textContent = `- ${data.author}`;
    hostnameElement.textContent = `[${data.hostname}]`;
  } catch (error) {
    console.error('Error fetching quote:', error);
    quoteElement.textContent = '"Be the change you wish to see in the world."';
    authorElement.textContent = '- Mahatma Gandhi';
    hostnameElement.textContent = '[Unknown Host]';
  }
}

window.onload = fetchQuote;
newQuoteBtn.addEventListener('click', fetchQuote);
