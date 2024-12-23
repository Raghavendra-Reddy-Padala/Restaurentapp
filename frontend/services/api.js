const API_URL = 'http://localhost:5000/api';

export const apiService = {
    async get(url) {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}${url}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error fetching data');
        return response.json();
    },
    async post(url, data) {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${API_URL}${url}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Error posting data');
        return response.json();
    }
};

// Menu Services
export const menuService = {
    async getAllItems() {
        const response = await fetch(`${API_URL}/menu`);
        return response.json();
    },
};

export const cartService = {
    async getCart() {
        const response = await fetch(`${API_URL}/cart`);
        return response.json();
    },
    async addToCart(item) {
        const response = await fetch(`${API_URL}/cart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(item),
        });
        return response.json();
    },
    async checkout() {
        const response = await fetch(`${API_URL}/cart/checkout`, { method: 'POST' });
        return response.json();
    },
};

export const reservationService = {
    async createReservation(reservationData) {
        const response = await fetch(`${API_URL}/reservations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(reservationData),
        });
        return response.json();
    },
};
