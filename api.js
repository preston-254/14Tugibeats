// API Configuration - Will be set by api-config.js
const API_BASE_URL = (typeof window !== 'undefined' && window.API_BASE_URL) || 'http://localhost:5000/api';

// Get auth token from sessionStorage
function getAuthToken() {
    return sessionStorage.getItem('authToken');
}

// Set auth token
function setAuthToken(token) {
    sessionStorage.setItem('authToken', token);
}

// Remove auth token
function removeAuthToken() {
    sessionStorage.removeItem('authToken');
}

// Make API request
async function apiRequest(endpoint, options = {}) {
    // Get current API base URL (may be updated by api-config.js)
    const baseUrl = (typeof window !== 'undefined' && window.API_BASE_URL) || API_BASE_URL;
    const url = `${baseUrl}${endpoint}`;
    const token = getAuthToken();
    
    const config = {
        ...options,
        headers: {
            ...options.headers,
        }
    };

    // Add auth token if available
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    // Don't set Content-Type for FormData
    if (!(options.body instanceof FormData)) {
        config.headers['Content-Type'] = 'application/json';
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Request failed');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Authentication API
const authAPI = {
    async login(username, password) {
        const data = await apiRequest('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password })
        });
        if (data.token) {
            setAuthToken(data.token);
        }
        return data;
    },

    async verify() {
        try {
            return await apiRequest('/auth/verify');
        } catch (error) {
            removeAuthToken();
            return null;
        }
    },

    logout() {
        removeAuthToken();
    }
};

// Beats API
const beatsAPI = {
    async getAll() {
        return await apiRequest('/beats');
    },

    async getById(id) {
        return await apiRequest(`/beats/${id}`);
    },

    async create(formData) {
        return await apiRequest('/beats', {
            method: 'POST',
            body: formData
        });
    },

    async update(id, data) {
        return await apiRequest(`/beats/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    async delete(id) {
        return await apiRequest(`/beats/${id}`, {
            method: 'DELETE'
        });
    }
};

// Posters API
const postersAPI = {
    async getAll() {
        return await apiRequest('/posters');
    },

    async getById(id) {
        return await apiRequest(`/posters/${id}`);
    },

    async create(formData) {
        return await apiRequest('/posters', {
            method: 'POST',
            body: formData
        });
    },

    async update(id, formData) {
        return await apiRequest(`/posters/${id}`, {
            method: 'PUT',
            body: formData
        });
    },

    async delete(id) {
        return await apiRequest(`/posters/${id}`, {
            method: 'DELETE'
        });
    }
};

// Export for use in other files
if (typeof window !== 'undefined') {
    window.api = {
        auth: authAPI,
        beats: beatsAPI,
        posters: postersAPI,
        getAuthToken,
        setAuthToken,
        removeAuthToken
    };
}

