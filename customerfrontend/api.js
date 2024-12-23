// services/adminServices.js
const API_URL = 'http://localhost:5000/api';

export const adminService = {
    // Menu Management
    getMenuItems: async (token) => {
        const response = await fetch(`${API_URL}/menu`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    addMenuItem: async (token, itemData) => {
        const response = await fetch(`${API_URL}/menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(itemData)
        });
        return response.json();
    },

    deleteMenuItem: async (token, id) => {
        const response = await fetch(`${API_URL}/menu/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    // Reservation Management
    getReservations: async (token) => {
        const response = await fetch(`${API_URL}/reservations`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        return response.json();
    },

    updateReservation: async (token, id, status) => {
        const response = await fetch(`${API_URL}/reservations/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        return response.json();
    }
};