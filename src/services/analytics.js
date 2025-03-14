import api from './api';

export const analyticsService = {
    // Get analytics summary
    getSummary: async (startDate, endDate) => {
        return api.get('/api/analytics/summary', { params: { startDate, endDate } });
    },

    // Get events by type
    getEventsByType: async (type, page = 1, limit = 10, startDate, endDate) => {
        return api.get(`/api/analytics/events/${type}`, {
            params: { page, limit, startDate, endDate }
        });
    },

    // Get image analytics
    getImageAnalytics: async (imageId, startDate, endDate) => {
        return api.get(`/api/analytics/image/${imageId}`, {
            params: { startDate, endDate }
        });
    },

    // Log custom event
    logEvent: async (eventData) => {
        return api.post('/api/analytics/log', eventData);
    }
}; 
