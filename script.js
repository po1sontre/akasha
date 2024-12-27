// DOM Elements
const elements = {
    searchInput: document.getElementById('search-input'),
    googleButton: document.getElementById('google-button'),
    duckduckgoButton: document.getElementById('duckduckgo-button'),
    youtubeButton: document.getElementById('youtube-button'),
    githubButton: document.getElementById('github-button'),
    themeSwitch: document.getElementById('theme-switch'),
    settingsButton: document.getElementById('settings-button'),
    settingsModal: document.getElementById('settings-modal'),
    closeSettings: document.getElementById('close-settings'),
    loadingIndicator: document.getElementById('loading-indicator'),
    voiceSearch: document.getElementById('voice-search'),
    shortcutsButton: document.getElementById('keyboard-shortcuts'),
    shortcutsModal: document.getElementById('shortcuts-modal'),
    closeShortcuts: document.getElementById('close-shortcuts'),
    suggestions: document.getElementById('suggestions')
};

// Search engine URLs
const SEARCH_ENGINES = {
    google: 'https://www.google.com/search?q=',
    duckduckgo: 'https://duckduckgo.com/?q=',
    youtube: 'https://www.youtube.com/results?search_query=',
    github: 'https://github.com/search?q='
};

// Initialize the application
function init() {
    // Add click handlers for search buttons
    elements.googleButton.addEventListener('click', () => performSearch('google'));
    elements.duckduckgoButton.addEventListener('click', () => performSearch('duckduckgo'));
    elements.youtubeButton.addEventListener('click', () => performSearch('youtube'));
    elements.githubButton.addEventListener('click', () => performSearch('github'));

    // Add keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Add input handlers
    elements.searchInput.addEventListener('input', debounce(handleInput, 300));
    elements.searchInput.addEventListener('keydown', handleSearchKeydown);

    // Theme toggle
    elements.themeSwitch.addEventListener('click', toggleTheme);

    // Settings modal
    elements.settingsButton.addEventListener('click', toggleSettingsModal);
    elements.closeSettings.addEventListener('click', toggleSettingsModal);

    // Shortcuts modal
    elements.shortcutsButton.addEventListener('click', toggleShortcutsModal);
    elements.closeShortcuts.addEventListener('click', toggleShortcutsModal);

    // Voice search
    if ('webkitSpeechRecognition' in window) {
        setupVoiceSearch();
    } else {
        elements.voiceSearch.style.display = 'none';
    }

    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.style.display = 'none';
        }
    });

    // Initialize theme
    if (localStorage.getItem('theme') === 'light') {
        document.body.setAttribute('data-theme', 'light');
        elements.themeSwitch.querySelector('i').classList.replace('fa-moon', 'fa-sun');
    }
}

// Search functionality
function performSearch(engine) {
    const query = elements.searchInput.value.trim();
    if (!query) return;

    const searchUrl = SEARCH_ENGINES[engine] + encodeURIComponent(query);
    
    // Show loading indicator
    elements.loadingIndicator.style.display = 'flex';

    // Check if we should open in new tab (mobile devices)
    if (isMobile()) {
        window.open(searchUrl, '_blank');
        setTimeout(() => {
            elements.loadingIndicator.style.display = 'none';
        }, 500);
    } else {
        window.location.href = searchUrl;
    }
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
    // Focus search input with '/' key
    if (e.key === '/' && document.activeElement !== elements.searchInput) {
        e.preventDefault();
        elements.searchInput.focus();
    }

    // Alt + G for Google search
    if (e.altKey && e.key.toLowerCase() === 'g') {
        e.preventDefault();
        performSearch('google');
    }

    // Alt + D for DuckDuckGo search
    if (e.altKey && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        performSearch('duckduckgo');
    }

    // Alt + Y for YouTube search
    if (e.altKey && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        performSearch('youtube');
    }

    // Escape key to clear input or close modals
    if (e.key === 'Escape') {
        if (elements.settingsModal.style.display === 'block') {
            toggleSettingsModal();
        } else {
            elements.searchInput.value = '';
            elements.suggestions.innerHTML = '';
        }
    }
}

// Handle input changes
function handleInput(e) {
    const query = e.target.value.trim();
    if (query) {
        fetchSuggestions(query);
    } else {
        elements.suggestions.innerHTML = '';
    }
}

// Handle search input keyboard events
function handleSearchKeydown(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        performSearch('google'); // Default to Google search on Enter
    }
}

// Toggle theme
function toggleTheme() {
    const theme = document.body.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    
    const icon = elements.themeSwitch.querySelector('i');
    icon.classList.toggle('fa-moon');
    icon.classList.toggle('fa-sun');
}

// Toggle settings modal
function toggleSettingsModal() {
    elements.settingsModal.style.display = 
        elements.settingsModal.style.display === 'block' ? 'none' : 'block';
}

function toggleShortcutsModal() {
    elements.shortcutsModal.style.display = 
        elements.shortcutsModal.style.display === 'block' ? 'none' : 'block';
}


// Voice search setup
function setupVoiceSearch() {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    elements.voiceSearch.addEventListener('click', () => {
        recognition.start();
        elements.voiceSearch.classList.add('listening');
    });

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        elements.searchInput.value = transcript;
        elements.searchInput.focus();
    };

    recognition.onend = () => {
        elements.voiceSearch.classList.remove('listening');
    };
}

// Fetch search suggestions
async function fetchSuggestions(query) {
    try {
        const response = await fetch(
            `https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`
        );
        const [, suggestions] = await response.json();
        displaySuggestions(suggestions.slice(0, 5));
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
}

// Display search suggestions
function displaySuggestions(suggestions) {
    if (!suggestions.length) {
        elements.suggestions.innerHTML = '';
        return;
    }

    const html = suggestions.map(suggestion => `
        <div class="suggestion">
            <i class="fas fa-search"></i>
            <span>${suggestion}</span>
        </div>
    `).join('');

    elements.suggestions.innerHTML = html;

    // Add click handlers to suggestions
    document.querySelectorAll('.suggestion').forEach((element, index) => {
        element.addEventListener('click', () => {
            elements.searchInput.value = suggestions[index];
            elements.suggestions.innerHTML = '';
            performSearch('google');
        });
    });
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Check if user is on mobile device
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);