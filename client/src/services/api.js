import axios from 'axios';

const API = axios.create({ 
    baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api' 
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('vstay_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth
export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Homes
export const getHomes = () => API.get('/homes');
export const getHome = (id) => API.get(`/homes/${id}`);
export const getMyHomes = () => API.get('/homes/host/mine');
export const createHome = (formData) => API.post('/homes', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const updateHome = (id, formData) => API.put(`/homes/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
});
export const deleteHome = (id) => API.delete(`/homes/${id}`);

// Favorites
export const getFavorites = () => API.get('/favorites');
export const getFavoriteIds = () => API.get('/favorites/ids');
export const addFavorite = (homeId) => API.post(`/favorites/${homeId}`);
export const removeFavorite = (homeId) => API.delete(`/favorites/${homeId}`);

// Bookings
export const getBookings = () => API.get('/bookings');
export const createBooking = (data) => API.post('/bookings', data);
export const cancelBooking = (id) => API.delete(`/bookings/${id}`);
