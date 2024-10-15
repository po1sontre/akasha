const loadingIndicator = document.createElement('div');
loadingIndicator.style.display = 'none'; // Hide initially
loadingIndicator.innerText = 'Loading...';
document.body.appendChild(loadingIndicator);

document.querySelectorAll('.search-button').forEach(button => {
    button.onclick = function() {
        const query = document.getElementById('search-input').value;
        loadingIndicator.style.display = 'block'; // Show loading

        let url;
        if (this.id === 'google-button') {
            url = 'https://www.google.com/search?q=' + encodeURIComponent(query);
        } else if (this.id === 'duckduckgo-button') {
            url = 'https://duckduckgo.com/?q=' + encodeURIComponent(query);
        } else if (this.id === 'youtube-button') {
            url = 'https://www.youtube.com/results?search_query=' + encodeURIComponent(query);
        }
        
        // Open the search in a new tab after a short delay
        setTimeout(() => {
            window.open(url, '_blank');
            loadingIndicator.style.display = 'none'; // Hide loading
        }, 200); // Adjust the delay as needed
    };
});
