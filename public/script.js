const form = document.getElementById('prompt-form');
const promptInput = document.getElementById('prompt-input');
const sqlOutput = document.getElementById('sql-output');
const dataOutput = document.getElementById('data-output');
const errorOutput = document.getElementById('error-output');

form.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission

    const prompt = promptInput.value.trim();
    if (!prompt) {
        showError('Please enter a prompt.');
        return;
    }

    // Clear previous results and errors
    clearResults();

    // Optionally show a loading indicator
    sqlOutput.textContent = 'Generating SQL...';
    dataOutput.textContent = 'Executing query...';

    try {
        const response = await fetch('generate-sql', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: prompt }),
        });

        const result = await response.json();

        if (!response.ok) {
            // Handle HTTP errors (like 500 Internal Server Error)
            throw new Error(result.error || `HTTP error! Status: ${response.status}`);
        }

        // Backend doesn't currently return the SQL, so we can't display it directly
        // We'll just show the prompt used for now.
        sqlOutput.textContent = `Query for prompt: "${prompt}"`; 
        
        if (result.results && result.results.length > 0) {
            dataOutput.textContent = JSON.stringify(result.results, null, 2);
        } else {
            dataOutput.textContent = 'Query executed successfully, but returned no data.';
        }

    } catch (error) {
        console.error('Error:', error);
        showError(`Failed to process query: ${error.message}`);
    }
});

function showError(message) {
    sqlOutput.textContent = 'Error';
    dataOutput.textContent = '';
    errorOutput.textContent = message;
}

function clearResults() {
    sqlOutput.textContent = 'SQL Query will appear here...';
    dataOutput.textContent = 'Data will appear here...';
    errorOutput.textContent = '';
} 