// Constants
const STORAGE_KEYS = {
    ACCESS_CODES: 'masterArtTZ_accessCodes',
    GALLERY_CONTENT: 'masterArtTZ_galleryContent'
};

// Function to initialize demo content
function initializeDemoContent() {
    const demoImage = {
        id: 'demo1',
        name: 'Demo Image',
        data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5EZW1vIEltYWdlPC90ZXh0Pjwvc3ZnPg==',
        uploadDate: new Date(),
        accessCode: 'DEMO123'
    };
    
    const demoContent = [[demoImage.id, demoImage]];
    const demoCode = {
        code: 'DEMO123',
        data: {
            created: new Date(),
            expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            status: 'active',
            uses: 0,
            content: [demoImage.id]
        }
    };
    
    localStorage.setItem(STORAGE_KEYS.GALLERY_CONTENT, JSON.stringify(demoContent));
    localStorage.setItem(STORAGE_KEYS.ACCESS_CODES, JSON.stringify([demoCode]));
    return { content: demoContent, code: demoCode };
}

// Function to check access code and display content
function checkAccessCode(code) {
    if (!code) {
        showError('Please enter an access code');
        return false;
    }

    try {
        // Get stored data
        let storedCodes = localStorage.getItem(STORAGE_KEYS.ACCESS_CODES);
        let storedContent = localStorage.getItem(STORAGE_KEYS.GALLERY_CONTENT);
        
        // Initialize demo content if no content exists
        if (!storedContent || !storedCodes) {
            const demo = initializeDemoContent();
            storedContent = JSON.stringify(demo.content);
            storedCodes = JSON.stringify([demo.code]);
        }
        
        const normalizedCode = code.toUpperCase().trim();
        
        // Parse stored data
        const codesData = JSON.parse(storedCodes);
        const contentData = JSON.parse(storedContent);
        
        // Convert to Map for easier access
        const codesMap = new Map(codesData.map(item => [item.code, item.data]));
        const contentMap = new Map(contentData);
        
        // Check if it's the demo code
        if (normalizedCode === 'DEMO123') {
            const content = Array.from(contentMap.values());
            displayImages(content);
            return true;
        }
        
        // Check regular access code
        const codeData = codesMap.get(normalizedCode);
        
        if (!codeData) {
            showError('Invalid access code');
            return false;
        }

        if (codeData.status !== 'active') {
            showError('This access code has expired');
            return false;
        }

        if (new Date() > new Date(codeData.expiry)) {
            showError('This access code has expired');
            return false;
        }

        // Get content for this code
        const content = codeData.content
            .map(id => contentMap.get(id))
            .filter(item => item != null);

        if (content.length === 0) {
            showError('No content available for this access code');
            return false;
        }

        // Display the content
        displayImages(content);
        return true;
    } catch (error) {
        console.error('Error validating access code:', error);
        showError('An error occurred. Please try again.');
        return false;
    }
}

// Function to display images
function displayImages(images) {
    const container = document.getElementById('gallery-container');
    if (!container) {
        console.error('Gallery container not found');
        return;
    }

    container.innerHTML = '';
    
    images.forEach(image => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="${image.data}" alt="${image.name}">
            <div class="image-info">
                <h3>${image.name}</h3>
                <p>Uploaded: ${new Date(image.uploadDate).toLocaleDateString()}</p>
            </div>
        `;
        container.appendChild(item);
    });

    // Show the gallery section
    document.getElementById('login-section')?.classList.add('hidden');
    document.getElementById('gallery-section')?.classList.remove('hidden');
}

// Function to show error message
function showError(message) {
    const errorElement = document.getElementById('error-message');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        setTimeout(() => {
            errorElement.style.display = 'none';
        }, 3000);
    } else {
        alert(message);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Handle form submission
    const form = document.getElementById('access-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const codeInput = document.getElementById('access-code');
            if (codeInput) {
                checkAccessCode(codeInput.value);
            }
        });
    }
}); 