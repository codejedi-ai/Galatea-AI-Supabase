function getCount() {
    return fetch('/count')
        .then(response => response.json())
        .then(data => parseInt(data.count))
        .catch(error => console.error('Error fetching count:', error));
}

function displayCount(count) {
    let display = document.getElementById('countDisplay');
    display.innerText = count;
}

function incrementCount() {
    getCount().then(count => {
        count++;
        displayCount(count); // Update the display with the new count
        console.log(count);

        // Send the updated count to the server
        fetch('/update-count', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ count: count }),
        })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => console.error('Error:', error));
    });
}

async function handleCount() {
    try {
      const count = await getCount(); // Waits for getCount() to resolve
      displayCount(count); // Now count is an integer
    } catch (error) {
      console.error('Error:', error);
    }
  }
  
  handleCount();