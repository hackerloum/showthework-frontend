import api from './api';

export const accessCodesService = {
    // Create a new access code
    create: async (expiryDate) => {
        return api.post('/api/access-codes', { expiryDate });
    },

    // Validate an access code
    validate: async (code) => {
        return api.post('/api/access-codes/validate', { code });
    },

    // Get all access codes
    getAll: async () => {
        return api.get('/api/access-codes');
    },

    // Deactivate an access code
    deactivate: async (id) => {
        return api.patch(`/api/access-codes/${id}/deactivate`);
    },

    // Delete an access code
    delete: async (id) => {
        return api.delete(`/api/access-codes/${id}`);
    }
}; 
