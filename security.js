// Security Configuration
const CONFIG = {
    SESSION_TIMEOUT: 30 * 60, // 30 minutes in seconds
    ACCESS_CODE: 'demo123', // Replace with server-side authentication
    WATERMARK_TEXT: 'CONFIDENTIAL',
    FULLSCREEN_REQUIRED: false,
    MAX_ZOOM: 3,
    MIN_ZOOM: 1,
    ANIMATION_DURATION: 300,
    PARALLAX_FACTOR: 0.5
};

// State Management
let sessionTimer;
let isFullscreen = false;
let lastActivity = Date.now();

// DOM Elements
const loginSection = document.getElementById('loginSection');
const contentSection = document.getElementById('contentSection');
const loginForm = document.getElementById('loginForm');
const warningModal = document.getElementById('warningModal');
const protectedContent = document.getElementById('protectedContent');
const timeLeftSpan = document.getElementById('timeLeft');

// Additional DOM Elements
const mainImage = document.getElementById('mainImage');
const thumbnails = document.querySelectorAll('.thumbnail');
const prevButton = document.getElementById('prevImage');
const nextButton = document.getElementById('nextImage');
const toggleFullscreenButton = document.getElementById('toggleFullscreen');
const zoomInButton = document.getElementById('zoomIn');
const zoomOutButton = document.getElementById('zoomOut');
const resetZoomButton = document.getElementById('resetZoom');
const watermarkOpacitySlider = document.getElementById('watermarkOpacity');
const downloadRequestForm = document.getElementById('downloadRequestForm');
const themeToggle = document.getElementById('themeToggle');
const loadingSpinner = document.getElementById('loadingSpinner');
const mobileNavItems = document.querySelectorAll('.nav-item');
const opacityValue = document.querySelector('.opacity-value');

// Image Gallery State
let currentImageIndex = 0;
let currentZoom = 1;
let isDragging = false;
let startPos = { x: 0, y: 0 };
let currentPos = { x: 0, y: 0 };

// Initialize Security Features
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Show loading spinner initially
        const loadingSpinner = document.getElementById('loadingSpinner');
        loadingSpinner.style.display = 'flex';

        // Initialize features
        await initializeSecurityFeatures();
        setupThemeToggle();
        setupParallaxEffect();
        createWatermark();
        setupEventListeners();
        setupGalleryFeatures();
        setupZoomFeatures();
        await updateViewerInfo();

        // Hide loading spinner and show login section
        loadingSpinner.style.display = 'none';
        loginSection.classList.add('active');
        contentSection.classList.remove('active');
        contentSection.classList.add('hidden');
    } catch (error) {
        console.error('Initialization error:', error);
        const loadingSpinner = document.getElementById('loadingSpinner');
        loadingSpinner.style.display = 'none';
        alert('An error occurred during initialization. Please refresh the page.');
    }
});

// Loading Spinner
function showLoadingSpinner() {
    loadingSpinner.classList.remove('hidden');
}

function hideLoadingSpinner() {
    loadingSpinner.classList.add('hidden');
}

// Theme Toggle
function setupThemeToggle() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    updateThemeIcon();

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const newTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        updateThemeIcon();
    });
}

function updateThemeIcon() {
    const isDark = document.body.classList.contains('dark-mode');
    themeToggle.innerHTML = `<i class="fas fa-${isDark ? 'sun' : 'moon'}"></i>`;
}

// Parallax Effect
function setupParallaxEffect() {
    const parallaxText = document.querySelector('.parallax-text');
    if (!parallaxText) return;

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        parallaxText.style.transform = `translateY(${scrolled * CONFIG.PARALLAX_FACTOR}px)`;
    });
}

// Security Features Initialization
function initializeSecurityFeatures() {
    // Disable right-click
    document.addEventListener('contextmenu', e => e.preventDefault());
    
    // Disable keyboard shortcuts
    document.addEventListener('keydown', e => {
        // Prevent common shortcuts
        if (
            (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 's' || e.key === 'S' || e.key === 'p' || e.key === 'P')) ||
            (e.key === 'PrintScreen') ||
            (e.metaKey && (e.key === 'c' || e.key === 'C' || e.key === 's' || e.key === 'S'))
        ) {
            e.preventDefault();
            showWarning();
            return false;
        }
    });

    // Disable drag and drop
    document.addEventListener('dragstart', e => e.preventDefault());
    document.addEventListener('drop', e => e.preventDefault());
    
    // Monitor DevTools
    setInterval(() => {
        if (window.outerWidth - window.innerWidth > 160 || window.outerHeight - window.innerHeight > 160) {
            showWarning();
        }
    }, 1000);

    // Add touch event prevention
    document.addEventListener('touchstart', preventTouchEvents, { passive: false });
    document.addEventListener('touchmove', preventTouchEvents, { passive: false });

    // Detect mobile orientation
    window.addEventListener('orientationchange', () => {
        if (window.orientation !== 0) {
            alert('Please use portrait orientation for secure viewing.');
        }
    });
}

function preventTouchEvents(e) {
    if (e.touches.length > 1) {
        e.preventDefault();
        showWarning();
    }
}

// Watermark Creation
function createWatermark() {
    const watermarkOverlay = document.getElementById('watermarkOverlay');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    ctx.fillStyle = 'rgba(200, 200, 200, 0.2)';
    ctx.font = '24px Poppins';
    ctx.rotate(-0.3);
    
    const timestamp = new Date().toLocaleString();
    const userInfo = `${CONFIG.WATERMARK_TEXT} - ${timestamp}`;
    
    for (let i = -canvas.width; i < canvas.width * 2; i += 300) {
        for (let j = -canvas.height; j < canvas.height * 2; j += 100) {
            ctx.fillText(userInfo, i, j);
        }
    }
    
    watermarkOverlay.style.background = `url(${canvas.toDataURL()})`;
    watermarkOverlay.style.opacity = watermarkOpacitySlider.value;
}

// Event Listeners Setup
function setupEventListeners() {
    // Login Form Submission
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const accessCode = document.getElementById('accessCode').value;
        
        if (accessCode === CONFIG.ACCESS_CODE) {
            loginSection.classList.remove('active');
            contentSection.classList.add('active');
            contentSection.classList.remove('hidden');
            startSession();
        } else {
            alert('Invalid access code');
        }
    });

    // Fullscreen Change Detection
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    
    // Tab Visibility
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            protectedContent.classList.add('blur-content');
        } else {
            protectedContent.classList.remove('blur-content');
        }
    });
    
    // Window Focus
    window.addEventListener('blur', () => {
        protectedContent.classList.add('blur-content');
    });
    
    window.addEventListener('focus', () => {
        protectedContent.classList.remove('blur-content');
    });

    // Mobile Navigation
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            mobileNavItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
        });
    });

    // Watermark Opacity Control with percentage display
    watermarkOpacitySlider.addEventListener('input', (e) => {
        const opacity = e.target.value;
        document.getElementById('watermarkOverlay').style.opacity = opacity;
        opacityValue.textContent = `${Math.round(opacity * 100)}%`;
    });

    // Window Resize Handler
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            createWatermark();
        }, 250);
    });
}

// Session Management
function startSession() {
    let timeLeft = CONFIG.SESSION_TIMEOUT;
    
    sessionTimer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay(timeLeft);
        
        if (timeLeft <= 0 || Date.now() - lastActivity > CONFIG.SESSION_TIMEOUT * 1000) {
            endSession();
        }
    }, 1000);
    
    // Track user activity
    document.addEventListener('mousemove', updateActivity);
    document.addEventListener('keypress', updateActivity);
}

function updateActivity() {
    lastActivity = Date.now();
}

function updateTimerDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timeLeftSpan.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function endSession() {
    clearInterval(sessionTimer);
    contentSection.classList.add('hidden');
    loginSection.classList.remove('active');
    document.exitFullscreen?.() || document.webkitExitFullscreen?.() || document.mozCancelFullScreen?.();
}

// Fullscreen Management
function requestFullscreen(element) {
    if (element.requestFullscreen) {
        element.requestFullscreen();
    } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
    } else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    }
}

function handleFullscreenChange() {
    isFullscreen = !!document.fullscreenElement || !!document.webkitFullscreenElement || !!document.mozFullScreenElement;
    
    if (CONFIG.FULLSCREEN_REQUIRED && !isFullscreen && contentSection.classList.contains('hidden') === false) {
        showWarning();
        protectedContent.classList.add('blur-content');
    } else {
        protectedContent.classList.remove('blur-content');
    }
}

// Warning Modal Management
function showWarning() {
    warningModal.classList.remove('hidden');
    warningModal.querySelector('.modal-content').style.animation = 'shake 0.5s ease-in-out';
    logSecurityEvent('Attempted content capture');
}

function closeWarningModal() {
    warningModal.classList.add('hidden');
}

// Security Logging
function logSecurityEvent(event) {
    // In production, send to server
    console.log(`Security Event: ${event} at ${new Date().toISOString()}`);
}

// Gallery Features Setup
function setupGalleryFeatures() {
    // Thumbnail Navigation
    thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener('click', () => {
            currentImageIndex = index;
            updateMainImage();
            updateThumbnailSelection();
        });
    });

    // Navigation Buttons
    prevButton.addEventListener('click', showPreviousImage);
    nextButton.addEventListener('click', showNextImage);
    
    // Fullscreen Toggle
    toggleFullscreenButton.addEventListener('click', toggleFullscreen);
}

function updateMainImage() {
    const newSrc = thumbnails[currentImageIndex].getAttribute('data-src');
    mainImage.src = newSrc;
    resetZoom();
}

function updateThumbnailSelection() {
    thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('active', index === currentImageIndex);
    });
}

function showPreviousImage() {
    currentImageIndex = (currentImageIndex - 1 + thumbnails.length) % thumbnails.length;
    updateMainImage();
    updateThumbnailSelection();
}

function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % thumbnails.length;
    updateMainImage();
    updateThumbnailSelection();
}

// Zoom Features
function setupZoomFeatures() {
    zoomInButton.addEventListener('click', () => adjustZoom(0.2));
    zoomOutButton.addEventListener('click', () => adjustZoom(-0.2));
    resetZoomButton.addEventListener('click', resetZoom);
    
    // Drag to Pan when zoomed
    mainImage.addEventListener('mousedown', startDragging);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', stopDragging);
    
    // Double click to zoom
    mainImage.addEventListener('dblclick', () => {
        if (currentZoom === 1) {
            adjustZoom(1); // Zoom in to 2x
        } else {
            resetZoom(); // Reset to 1x
        }
    });
}

function adjustZoom(delta) {
    const newZoom = Math.max(CONFIG.MIN_ZOOM, Math.min(CONFIG.MAX_ZOOM, currentZoom + delta));
    if (newZoom !== currentZoom) {
        currentZoom = newZoom;
        applyZoom();
    }
}

function resetZoom() {
    currentZoom = 1;
    currentPos = { x: 0, y: 0 };
    applyZoom();
}

function applyZoom() {
    mainImage.style.transform = `scale(${currentZoom}) translate(${currentPos.x}px, ${currentPos.y}px)`;
    mainImage.classList.toggle('zoomed', currentZoom > 1);
}

// Drag and Pan Functionality
function startDragging(e) {
    if (currentZoom > 1) {
        isDragging = true;
        startPos = {
            x: e.clientX - currentPos.x,
            y: e.clientY - currentPos.y
        };
    }
}

function drag(e) {
    if (!isDragging) return;
    
    currentPos = {
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y
    };
    
    applyZoom();
}

function stopDragging() {
    isDragging = false;
}

// Add the missing toggleZoom function
function toggleZoom() {
    if (currentZoom === 1) {
        adjustZoom(1); // Zoom in to 2x
    } else {
        resetZoom(); // Reset to 1x
    }
}

// Viewer Information
async function updateViewerInfo() {
    try {
        // In production, get from server
        const userIP = 'XX.XX.XX.XX';
        const userDevice = `${navigator.platform} - ${navigator.userAgent.split(') ')[0]})`;
        const lastAccessed = new Date().toLocaleString();
        
        document.getElementById('userIP').textContent = userIP;
        document.getElementById('userDevice').textContent = userDevice;
        document.getElementById('lastAccessed').textContent = lastAccessed;
    } catch (error) {
        console.error('Error updating viewer info:', error);
    }
}

// Modal Management
function closeDownloadRequestModal() {
    document.getElementById('downloadRequestModal').classList.add('hidden');
}

// Animation Keyframes (add to your CSS)
const styleSheet = document.createElement('style');
styleSheet.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(styleSheet); 