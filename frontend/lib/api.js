import axios from 'axios';

// Base URL of our backend
const API = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
});


// Automatically attach the token to every request if user is logged in
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Auth ─────────────────────────────────────────────
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser    = (data) => API.post('/auth/login', data);

// ── Listings ─────────────────────────────────────────
export const getListings    = (search = '') => API.get(`/listings?search=${search}`);
export const getListing     = (id)          => API.get(`/listings/${id}`);
export const createListing  = (data)        => API.post('/listings', data);
export const updateListing  = (id, data)    => API.put(`/listings/${id}`, data);
export const deleteListing  = (id)          => API.delete(`/listings/${id}`);
export const likeListing    = (id)          => API.post(`/listings/${id}/like`);