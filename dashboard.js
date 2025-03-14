// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');
const uploadModal = document.getElementById('uploadModal');
const fileInput = document.getElementById('fileInput');
const uploadArea = document.querySelector('.upload-area');
const uploadPreview = document.querySelector('.upload-preview');

// Store active access codes and content
let activeAccessCodes = new Map();
let galleryContent = new Map();
let analytics = {
    totalViews: 0,
    activeCodes: 0,
    totalImages: 0,
    activeUsers: 0,
    contentViews: {},
    viewsByDate: {},
    recentActivity: []
};

// Constants
const STORAGE_KEYS = {
    ACCESS_CODES: 'masterArtTZ_accessCodes',
    GALLERY_CONTENT: 'masterArtTZ_galleryContent',
    ANALYTICS: 'masterArtTZ_analytics',
    THEME: 'masterArtTZ_theme'
};

// Navigation
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        showSection(targetId);
        updateActiveLink(link);

        // Initialize analytics charts when navigating to analytics section
        if (targetId === 'analytics') {
            analyticsFeatures.initCharts();
        }
    });
});

function showSection(sectionId) {
    sections.forEach(section => {
        if (section.id === `${sectionId}-section`) {
            section.style.display = 'block';
            // Initialize analytics if showing analytics section
            if (sectionId === 'analytics') {
                analyticsFeatures.initCharts();
            }
        } else {
            section.style.display = 'none';
        }
    });
}

function updateActiveLink(activeLink) {
    navLinks.forEach(link => link.parentElement.classList.remove('active'));
    activeLink.parentElement.classList.add('active');
}

// Load stored data
function loadStoredData() {
    try {
        const storedCodes = localStorage.getItem(STORAGE_KEYS.ACCESS_CODES);
        const storedContent = localStorage.getItem(STORAGE_KEYS.GALLERY_CONTENT);
        const storedAnalytics = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
        
        // Initialize Maps
        activeAccessCodes = new Map();
        galleryContent = new Map();
        
        if (storedCodes) {
            const codesData = JSON.parse(storedCodes);
            codesData.forEach(item => {
                const data = item.data;
                data.created = new Date(data.created);
                data.expiry = new Date(data.expiry);
                activeAccessCodes.set(item.code, data);
            });
        }
        
        if (storedContent) {
            const contentData = JSON.parse(storedContent);
            contentData.forEach(([id, data]) => {
                data.uploadDate = new Date(data.uploadDate);
                galleryContent.set(id, data);
            });
        }

        if (storedAnalytics) {
            analytics = JSON.parse(storedAnalytics);
        }

        // Initialize demo content if no content exists
        if (galleryContent.size === 0) {
            const demoImage = {
                id: 'demo1',
                name: 'Demo Image',
                data: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5EZW1vIEltYWdlPC90ZXh0Pjwvc3ZnPg==',
                uploadDate: new Date(),
                accessCode: 'DEMO123'
            };
            galleryContent.set(demoImage.id, demoImage);
            
            // Add demo access code
            activeAccessCodes.set('DEMO123', {
                created: new Date(),
                expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                status: 'active',
                uses: 0,
                content: [demoImage.id]
            });
            
            // Add demo analytics
            analytics = {
                totalViews: 0,
                activeCodes: 1,
                totalImages: 1,
                activeUsers: 0,
                contentViews: {},
                viewsByDate: {},
                recentActivity: [{
                    type: 'init',
                    message: 'Demo content initialized',
                    timestamp: new Date().toISOString()
                }]
            };
            
            saveDataToStorage();
        }

        updateDashboardStats();
        updateGalleryDisplay();
        updateAccessCodesTable();
        updateRecentActivity();
    } catch (error) {
        console.error('Error loading stored data:', error);
        resetData();
    }
}

// Reset data
function resetData() {
    activeAccessCodes = new Map();
    galleryContent = new Map();
    analytics = {
        totalViews: 0,
        activeCodes: 0,
        totalImages: 0,
        activeUsers: 0,
        contentViews: {},
        viewsByDate: {},
        recentActivity: []
    };
    saveDataToStorage();
}

// Save data to storage
function saveDataToStorage() {
    try {
        // Convert access codes from Map to array of objects
        const accessCodesData = Array.from(activeAccessCodes.entries()).map(([code, data]) => ({
            code: code,
            data: data
        }));
        
        // Convert gallery content to array
        const galleryContentData = Array.from(galleryContent.entries());

        localStorage.setItem(STORAGE_KEYS.ACCESS_CODES, JSON.stringify(accessCodesData));
        localStorage.setItem(STORAGE_KEYS.GALLERY_CONTENT, JSON.stringify(galleryContentData));
        localStorage.setItem(STORAGE_KEYS.ANALYTICS, JSON.stringify(analytics));
    } catch (error) {
        console.error('Error saving data:', error);
        alert('Error saving data. Storage might be full.');
    }
}

// Update dashboard stats
function updateDashboardStats() {
    const activeCodesCount = Array.from(activeAccessCodes.values()).filter(code => code.status === 'active').length;
    
    document.querySelector('[data-stat="views"]').textContent = analytics.totalViews;
    document.querySelector('[data-stat="codes"]').textContent = activeCodesCount;
    document.querySelector('[data-stat="images"]').textContent = galleryContent.size;
    document.querySelector('[data-stat="users"]').textContent = analytics.activeUsers;
}

// Update gallery display
function updateGalleryDisplay() {
    const galleryGrid = document.querySelector('.gallery-grid');
    if (!galleryGrid) return;
    
    galleryGrid.innerHTML = '';
    
    galleryContent.forEach((imageData, id) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-image-id', id);
        
        const date = new Date(imageData.uploadDate).toLocaleDateString();
        item.innerHTML = `
            <img src="${imageData.data}" alt="${imageData.name}">
            <div class="gallery-item-overlay">
                <h3>${imageData.name}</h3>
                <p>Access Code: ${imageData.accessCode}</p>
                <p>Uploaded: ${date}</p>
                <button class="action-btn delete-btn" onclick="deleteImage('${id}')">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        galleryGrid.appendChild(item);
    });
}

// Update access codes table
function updateAccessCodesTable() {
    const tbody = document.querySelector('.codes-table tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    activeAccessCodes.forEach((data, code) => {
        const row = document.createElement('tr');
        row.setAttribute('data-code', code);
        const status = data.status || 'active';
        row.innerHTML = `
            <td>${code}</td>
            <td>${data.created.toLocaleDateString()}</td>
            <td>${data.expiry.toLocaleDateString()}</td>
            <td><span class="status ${status}">${status}</span></td>
            <td>${data.uses || 0}</td>
            <td>
                <button class="action-btn" onclick="copyCode('${code}')">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="action-btn" onclick="deactivateCode('${code}')">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Update recent activity
function updateRecentActivity() {
    const activityList = document.querySelector('.activity-list');
    if (!activityList) return;
    
    activityList.innerHTML = '';
    
    analytics.recentActivity.slice(0, 10).forEach(activity => {
        const item = document.createElement('div');
        item.className = 'activity-item';
        item.innerHTML = `
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-details">
                <p>${activity.message}</p>
                <small>${new Date(activity.timestamp).toLocaleString()}</small>
            </div>
        `;
        activityList.appendChild(item);
    });
}

// Add activity
function addActivity(message, icon = 'fa-info-circle') {
    const activity = {
        message,
        icon,
        timestamp: new Date().toISOString()
    };
    
    analytics.recentActivity.unshift(activity);
    if (analytics.recentActivity.length > 50) {
        analytics.recentActivity.pop();
    }
    
    saveDataToStorage();
    updateRecentActivity();
}

// Generate access code
function generateAccessCode() {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const now = new Date();
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 30);

    activeAccessCodes.set(code, {
        created: now,
        expiry: expiry,
        status: 'active',
        uses: 0,
        content: []
    });

    addActivity(`New access code generated: ${code}`, 'fa-key');
    saveDataToStorage();
    updateAccessCodesTable();
    updateDashboardStats();
    
    return code;
}

// Copy access code
function copyCode(code) {
    navigator.clipboard.writeText(code);
    alert('Access code copied to clipboard!');
}

// Deactivate access code
function deactivateCode(code) {
    if (confirm('Are you sure you want to deactivate this access code?')) {
        const codeData = activeAccessCodes.get(code);
        if (codeData) {
            codeData.status = 'expired';
            addActivity(`Access code deactivated: ${code}`, 'fa-ban');
            saveDataToStorage();
            updateAccessCodesTable();
            updateDashboardStats();
        }
    }
}

// Delete image
function deleteImage(id) {
    if (confirm('Are you sure you want to delete this image?')) {
        galleryContent.delete(id);
        addActivity('Image deleted', 'fa-trash');
        saveDataToStorage();
        updateGalleryDisplay();
        updateDashboardStats();
    }
}

// Upload images
async function uploadImages() {
    const files = fileInput.files;
    if (files.length === 0) {
        alert('Please select files to upload');
        return;
    }

    try {
        const accessCode = generateAccessCode();
        const codeData = activeAccessCodes.get(accessCode);

        if (!codeData) {
            throw new Error('Failed to generate access code');
        }

        const uploadPromises = Array.from(files).map(async file => {
            if (!file.type.startsWith('image/')) {
                throw new Error(`File "${file.name}" is not an image`);
            }

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                
                reader.onload = (e) => {
                    try {
                        const imageData = {
                            id: Date.now() + Math.random().toString(36).substring(7),
                            name: file.name,
                            data: e.target.result,
                            uploadDate: new Date(),
                            accessCode: accessCode
                        };

                        galleryContent.set(imageData.id, imageData);
                        codeData.content.push(imageData.id);

                        resolve(imageData);
                    } catch (error) {
                        reject(error);
                    }
                };

                reader.onerror = () => reject(new Error(`Failed to read file: ${file.name}`));
                reader.readAsDataURL(file);
            });
        });

        await Promise.all(uploadPromises);
        
        addActivity({
            type: 'upload',
            message: `Uploaded ${files.length} images with access code: ${accessCode}`,
            timestamp: new Date().toISOString()
        });
        
        saveDataToStorage();
        updateGalleryDisplay();
        updateDashboardStats();
        
        alert(`Files uploaded successfully! Access Code: ${accessCode}`);
        closeUploadModal();
    } catch (error) {
        console.error('Error uploading files:', error);
        alert('Error uploading files: ' + error.message);
    }
}

// Modal functions
function openUploadModal() {
    uploadModal.style.display = 'flex';
}

function closeUploadModal() {
    uploadModal.style.display = 'none';
    fileInput.value = '';
    uploadPreview.innerHTML = '';
}

// Analytics Features
const analyticsFeatures = {
    charts: {},
    
    initCharts() {
        // Clear existing charts if they exist
        if (Object.keys(this.charts).length > 0) {
            Object.values(this.charts).forEach(chart => {
                if (chart) {
                    chart.destroy();
                }
            });
            this.charts = {};
        }

        const ctx = {
            views: document.getElementById('viewsChart'),
            access: document.getElementById('accessChart'),
            content: document.getElementById('contentChart'),
            client: document.getElementById('clientChart')
        };

        // Check if we're in the analytics section and if canvases exist
        if (!document.getElementById('analytics-section').style.display === 'block' || 
            !ctx.views || !ctx.access || !ctx.content || !ctx.client) {
            return;
        }

        // Get real data
        const realData = this.getRealAnalyticsData();

        // Initialize charts with default configuration
        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        boxWidth: 12,
                        padding: 15
                    }
                }
            },
            layout: {
                padding: {
                    top: 10,
                    right: 10,
                    bottom: 10,
                    left: 10
                }
            }
        };

        try {
            // Views Over Time Chart
            this.charts.views = new Chart(ctx.views, {
                type: 'line',
                data: {
                    labels: realData.viewDates,
                    datasets: [{
                        label: 'Views',
                        data: realData.viewCounts,
                        borderColor: '#007bff',
                        tension: 0.1,
                        fill: false
                    }]
                },
                options: {
                    ...defaultOptions,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Access Code Usage Chart
            this.charts.access = new Chart(ctx.access, {
                type: 'bar',
                data: {
                    labels: ['Active', 'Expired', 'Total'],
                    datasets: [{
                        label: 'Access Codes',
                        data: [
                            realData.activeCodesCount,
                            realData.expiredCodesCount,
                            realData.totalCodesCount
                        ],
                        backgroundColor: ['#28a745', '#dc3545', '#007bff']
                    }]
                },
                options: defaultOptions
            });

            // Popular Content Chart
            this.charts.content = new Chart(ctx.content, {
                type: 'pie',
                data: {
                    labels: realData.popularContent.map(item => item.name),
                    datasets: [{
                        data: realData.popularContent.map(item => item.views),
                        backgroundColor: ['#007bff', '#28a745', '#dc3545', '#ffc107', '#17a2b8']
                    }]
                },
                options: defaultOptions
            });

            // Client Activity Chart
            this.charts.client = new Chart(ctx.client, {
                type: 'bar',
                data: {
                    labels: realData.clientDates,
                    datasets: [{
                        label: 'Active Clients',
                        data: realData.clientCounts,
                        backgroundColor: '#17a2b8'
                    }]
                },
                options: {
                    ...defaultOptions,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });

            // Update top performing content
            this.updateTopContent(realData.popularContent);
            
            console.log('Charts initialized successfully with real data');
        } catch (error) {
            console.error('Error initializing charts:', error);
        }
    },

    getRealAnalyticsData() {
        const last7Days = getLast7Days();
        
        // Get views data for last 7 days
        const viewsData = last7Days.reduce((acc, date) => {
            acc[date] = analytics.viewsByDate[date] || 0;
            return acc;
        }, {});
        
        // Get access code statistics
        const activeCodesCount = Array.from(activeAccessCodes.values()).filter(code => code.status === 'active').length;
        const expiredCodesCount = Array.from(activeAccessCodes.values()).filter(code => code.status === 'expired').length;
        
        // Get popular content
        const popularContent = Array.from(galleryContent.values())
            .map(item => ({
                name: item.name,
                views: analytics.contentViews[item.id] || 0,
                accessRate: Math.round((analytics.contentViews[item.id] || 0) / analytics.totalViews * 100) || 0
            }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 5);
        
        // Get client activity
        const clientActivity = last7Days.reduce((acc, date) => {
            const count = analytics.recentActivity
                .filter(activity => 
                    activity.type === 'client_access' && 
                    activity.timestamp.startsWith(date)
                ).length;
            acc[date] = count;
            return acc;
        }, {});

        return {
            viewDates: last7Days,
            viewCounts: Object.values(viewsData),
            activeCodesCount,
            expiredCodesCount,
            totalCodesCount: activeAccessCodes.size,
            popularContent,
            clientDates: last7Days,
            clientCounts: Object.values(clientActivity)
        };
    },

    updateTopContent(popularContent) {
        const tableBody = document.getElementById('topContentTable');
        if (!tableBody) return;

        tableBody.innerHTML = popularContent.map(item => `
            <tr>
                <td>${item.name}</td>
                <td>${item.views}</td>
                <td>${item.accessRate}%</td>
                <td>
                    <i class="fas fa-arrow-${item.views > (analytics.averageViews || 50) ? 'up' : 'down'}" 
                       style="color: ${item.views > (analytics.averageViews || 50) ? '#28a745' : '#dc3545'}"></i>
                </td>
            </tr>
        `).join('');
    }
};

// Track content view with date
function trackContentView(contentId) {
    const today = new Date().toISOString().split('T')[0];
    
    // Update total views
    analytics.totalViews++;
    
    // Update content specific views
    if (!analytics.contentViews[contentId]) {
        analytics.contentViews[contentId] = 0;
    }
    analytics.contentViews[contentId]++;
    
    // Update views by date
    if (!analytics.viewsByDate[today]) {
        analytics.viewsByDate[today] = 0;
    }
    analytics.viewsByDate[today]++;
    
    // Add to recent activity
    addActivity({
        type: 'view',
        contentId,
        message: `Content ${galleryContent.get(contentId)?.name || contentId} viewed`,
        timestamp: new Date().toISOString()
    });
    
    saveDataToStorage();
    updateDashboardStats();
    
    // If analytics charts are visible, update them
    if (document.getElementById('analytics-section').style.display === 'block') {
        analyticsFeatures.initCharts();
    }
}

// Track client access
function trackClientAccess(clientId) {
    addActivity({
        type: 'client_access',
        message: `Client ${clientId} accessed content`,
        timestamp: new Date().toISOString()
    });
    
    saveDataToStorage();
    updateDashboardStats();
}

// Client Management
const clientManagement = {
    clients: [],

    async addClient(clientData) {
        try {
            const newClient = {
                id: Date.now().toString(),
                ...clientData,
                status: 'active',
                createdAt: new Date().toISOString()
            };
            
            this.clients.push(newClient);
            await this.saveClients();
            this.renderClients();
            
            // Add activity
            addActivity(`New client added: ${clientData.name}`, 'fa-user-plus');
            
            showNotification('Client added successfully');
            return true;
        } catch (error) {
            console.error('Error adding client:', error);
            showNotification('Error adding client', 'error');
            return false;
        }
    },

    async loadClients() {
        try {
            const stored = localStorage.getItem('masterArtTZ_clients');
            this.clients = stored ? JSON.parse(stored) : [];
            this.renderClients();
        } catch (error) {
            console.error('Error loading clients:', error);
            showNotification('Error loading clients', 'error');
        }
    },

    async saveClients() {
        try {
            localStorage.setItem('masterArtTZ_clients', JSON.stringify(this.clients));
        } catch (error) {
            console.error('Error saving clients:', error);
            showNotification('Error saving clients', 'error');
        }
    },

    renderClients() {
        const container = document.querySelector('.clients-grid');
        if (!container) return;

        container.innerHTML = '';

        this.clients.forEach(client => {
            const card = document.createElement('div');
            card.className = 'client-card';
            card.innerHTML = `
                <h3>${client.name}</h3>
                <div class="client-info">
                    <p><strong>Email:</strong> ${client.email}</p>
                    <p><strong>Company:</strong> ${client.company || 'N/A'}</p>
                    <p><strong>Status:</strong> <span class="status-badge ${client.status}">${client.status}</span></p>
                    ${client.notes ? `<p><strong>Notes:</strong> ${client.notes}</p>` : ''}
                </div>
                <div class="client-actions">
                    <button onclick="clientManagement.toggleStatus('${client.id}')" class="secondary-button">
                        ${client.status === 'active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button onclick="clientManagement.deleteClient('${client.id}')" class="danger-button">
                        Delete
                    </button>
                </div>
            `;
            container.appendChild(card);
        });

        // Update analytics
        if (analytics) {
            analytics.activeUsers = this.clients.filter(c => c.status === 'active').length;
            document.querySelector('[data-stat="users"]').textContent = analytics.activeUsers;
        }
    },

    async toggleStatus(clientId) {
        const client = this.clients.find(c => c.id === clientId);
        if (client) {
            client.status = client.status === 'active' ? 'inactive' : 'active';
            await this.saveClients();
            this.renderClients();
            addActivity(`Client ${client.name} ${client.status === 'active' ? 'activated' : 'deactivated'}`, 'fa-user-check');
            showNotification(`Client ${client.status === 'active' ? 'activated' : 'deactivated'} successfully`);
        }
    },

    async deleteClient(clientId) {
        if (confirm('Are you sure you want to delete this client?')) {
            const client = this.clients.find(c => c.id === clientId);
            this.clients = this.clients.filter(c => c.id !== clientId);
            await this.saveClients();
            this.renderClients();
            addActivity(`Client deleted: ${client.name}`, 'fa-user-minus');
            showNotification('Client deleted successfully');
        }
    }
};

// Backup System
const backupSystem = {
    async createBackup() {
        try {
            const data = {
                clients: clientManagement.clients,
                analytics: {
                    views: analyticsFeatures.charts.views.data.datasets[0].data,
                    access: analyticsFeatures.charts.access.data.datasets[0].data,
                    content: analyticsFeatures.charts.content.data.datasets[0].data,
                    client: analyticsFeatures.charts.client.data.datasets[0].data
                },
                settings: await this.getSettings(),
                timestamp: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            showNotification('Backup created successfully');
        } catch (error) {
            console.error('Error creating backup:', error);
            showNotification('Error creating backup', 'error');
        }
    },

    async restoreFromBackup(file) {
        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    // Restore clients
                    clientManagement.clients = data.clients;
                    await clientManagement.saveClients();
                    clientManagement.renderClients();

                    // Restore analytics
                    analyticsFeatures.updateCharts(data.analytics);

                    // Restore settings
                    await this.restoreSettings(data.settings);

                    showNotification('Backup restored successfully');
                } catch (error) {
                    console.error('Error parsing backup:', error);
                    showNotification('Error parsing backup file', 'error');
                }
            };
            reader.readAsText(file);
        } catch (error) {
            console.error('Error restoring backup:', error);
            showNotification('Error restoring backup', 'error');
        }
    },

    async getSettings() {
        return {
            twoFactor: document.getElementById('twoFactorToggle').checked,
            watermark: {
                text: document.getElementById('watermarkText').value,
                opacity: document.getElementById('watermarkOpacity').value,
                position: document.getElementById('watermarkPosition').value
            },
            notifications: {
                email: document.getElementById('emailNotifyToggle').checked,
                desktop: document.getElementById('desktopNotifyToggle').checked
            }
        };
    },

    async restoreSettings(settings) {
        document.getElementById('twoFactorToggle').checked = settings.twoFactor;
        document.getElementById('watermarkText').value = settings.watermark.text;
        document.getElementById('watermarkOpacity').value = settings.watermark.opacity;
        document.getElementById('watermarkPosition').value = settings.watermark.position;
        document.getElementById('emailNotifyToggle').checked = settings.notifications.email;
        document.getElementById('desktopNotifyToggle').checked = settings.notifications.desktop;
    }
};

// Notification System
function showNotification(message, type = 'success') {
    const toast = document.getElementById('notificationToast');
    toast.textContent = message;
    toast.className = `notification-toast active ${type}`;
    
    setTimeout(() => {
        toast.className = 'notification-toast';
    }, 3000);
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Show dashboard section by default
        showSection('dashboard');
        const defaultLink = document.querySelector('.nav-links a[href="#dashboard"]');
        if (defaultLink) {
            updateActiveLink(defaultLink);
        }

        // Theme initialization
        const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-mode');
        }

        // Load stored data
        loadStoredData();

        // Set up drag and drop for upload
        uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadArea.classList.add('dragover');
        });

        uploadArea.addEventListener('dragleave', () => {
            uploadArea.classList.remove('dragover');
        });

        uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadArea.classList.remove('dragover');
            fileInput.files = e.dataTransfer.files;
            handleFileSelect();
        });

        fileInput.addEventListener('change', handleFileSelect);

        // Load clients
        clientManagement.loadClients();

        // Add client form submission
        document.getElementById('addClientForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = {
                name: document.getElementById('clientName').value,
                email: document.getElementById('clientEmail').value,
                company: document.getElementById('clientCompany').value,
                notes: document.getElementById('clientNotes').value
            };
            
            if (await clientManagement.addClient(formData)) {
                closeAddClientModal();
                e.target.reset();
            }
        });

        // Restore backup file input
        document.getElementById('restoreFile').addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                backupSystem.restoreFromBackup(e.target.files[0]);
            }
        });

        // Date range picker
        document.querySelectorAll('.date-range-picker .control-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.date-range-picker .control-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                // Implement date range filtering logic here
            });
        });

    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// Handle file selection
function handleFileSelect() {
    const files = fileInput.files;
    uploadPreview.innerHTML = '';

    Array.from(files).forEach(file => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.createElement('div');
            preview.className = 'preview-item';
            preview.innerHTML = `
                <img src="${e.target.result}" alt="${file.name}">
                <span>${file.name}</span>
            `;
            uploadPreview.appendChild(preview);
        };
        reader.readAsDataURL(file);
    });
}

// Modal Functions
function openAddClientModal() {
    document.getElementById('addClientModal').classList.add('active');
}

function closeAddClientModal() {
    document.getElementById('addClientModal').classList.remove('active');
}

// Export modules
window.openUploadModal = openUploadModal;
window.closeUploadModal = closeUploadModal;
window.uploadImages = uploadImages;
window.generateAccessCode = generateAccessCode;
window.copyCode = copyCode;
window.deactivateCode = deactivateCode;
window.deleteImage = deleteImage;
window.analyticsFeatures = analyticsFeatures;
window.clientManagement = clientManagement;
window.backupSystem = backupSystem;
window.openAddClientModal = openAddClientModal;
window.closeAddClientModal = closeAddClientModal;

// Initialize analytics data
function initializeAnalytics() {
    const storedAnalytics = localStorage.getItem(STORAGE_KEYS.ANALYTICS);
    if (storedAnalytics) {
        try {
            const parsedAnalytics = JSON.parse(storedAnalytics);
            analytics = {
                ...analytics,
                ...parsedAnalytics,
                viewsByDate: parsedAnalytics.viewsByDate || {},
                contentViews: parsedAnalytics.contentViews || {}
            };
        } catch (error) {
            console.error('Error parsing analytics:', error);
            resetAnalytics();
        }
    } else {
        resetAnalytics();
    }
    updateDashboardStats();
}

function resetAnalytics() {
    analytics = {
        totalViews: 0,
        activeCodes: 0,
        totalImages: 0,
        activeUsers: 0,
        contentViews: {},
        viewsByDate: {},
        recentActivity: []
    };
    saveDataToStorage();
}

function getLast7Days() {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
} 