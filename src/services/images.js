import api from './api';

export const imagesService = {
    // Create a new image
    create: async (imageData) => {
        return api.post('/api/images', imageData);
    },

    // Get all public images
    getPublic: async (page = 1, limit = 10, sort = '-createdAt') => {
        return api.get('/api/images/public', { params: { page, limit, sort } });
    },

    // Get image by ID
    getById: async (id, accessCode) => {
        return api.get(`/api/images/${id}`, { params: { accessCode } });
    },

    // Update image
    update: async (id, updateData) => {
        return api.patch(`/api/images/${id}`, updateData);
    },

    // Delete image
    delete: async (id) => {
        return api.delete(`/api/images/${id}`);
    },

    // Search images
    search: async (query, page = 1, limit = 10) => {
        return api.get(`/api/images/search/${query}`, { params: { page, limit } });
    }
}; 
