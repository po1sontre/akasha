document.getElementById('google-button').addEventListener('click', function() {
    const query = document.getElementById('search-input').value;
    const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    window.location.href = googleUrl;
});

document.getElementById('duckduckgo-button').addEventListener('click', function() {
    const query = document.getElementById('search-input').value;
    const duckDuckGoUrl = `https://www.duckduckgo.com/?q=${encodeURIComponent(query)}`;
    window.location.href = duckDuckGoUrl;
});
function toggleDropdown() {
    const dropdownContent = document.getElementById("dropdown-content");
    dropdownContent.style.display = dropdownContent.style.display === "block" ? "none" : "block";
}

document.addEventListener('DOMContentLoaded', function () {
    const dropbtn = document.querySelector('.dropbtn');
    const dropdownContent = document.querySelector('.dropdown-content');

    dropbtn.addEventListener('click', function () {
        dropdownContent.classList.toggle('show');
    });

    // Optional: Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function (event) {
        if (!dropbtn.contains(event.target) && !dropdownContent.contains(event.target)) {
            dropdownContent.classList.remove('show');
        }
    });
});