// Check authentication
const API_URL = 'http://localhost:5000/api';

function checkAuth() {
    const token = localStorage.getItem('adminToken');
    if (!token) {
        window.location.href = 'adminlogin.html';
    }
    return token;
}

// Logout function
function logout() {
    localStorage.removeItem('adminToken');
    window.location.href = 'adminlogin.html';
}

// Toggle loading spinner
function toggleLoading(show) {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
}

// Load menu items
async function loadMenuItems() {
    try {
        toggleLoading(true);
        const response = await fetch(`${API_URL}/menu`, {
            headers: {
                'Authorization': `Bearer ${checkAuth()}`
            }
        });
        const menuItems = await response.json();
        
        const menuList = document.getElementById('menu-list');
        menuList.innerHTML = '';
        
        menuItems.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${item.name} - $${item.price} (${item.category})
                <button class="btn-delete" onclick="deleteMenuItem('${item._id}')">Delete</button>
            `;
            menuList.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading menu items:', error);
        alert('Failed to load menu items');
    } finally {
        toggleLoading(false);
    }
}

// Add menu item
document.getElementById('add-item-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('item-name').value,
        price: parseFloat(document.getElementById('item-price').value),
        category: document.getElementById('item-category').value,
        imageUrl: document.getElementById('item-image').value
    };

    try {
        toggleLoading(true);
        const response = await fetch(`${API_URL}/menu`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${checkAuth()}`
            },
            body: JSON.stringify(formData)
        });

        if (!response.ok) throw new Error('Failed to add item');

        alert('Item added successfully');
        e.target.reset();
        loadMenuItems();
    } catch (error) {
        console.error('Error adding item:', error);
        alert('Failed to add item');
    } finally {
        toggleLoading(false);
    }
});

// Delete menu item
async function deleteMenuItem(id) {
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
        toggleLoading(true);
        const response = await fetch(`${API_URL}/menu/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${checkAuth()}`
            }
        });

        if (!response.ok) throw new Error('Failed to delete item');

        alert('Item deleted successfully');
        loadMenuItems();
    } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete item');
    } finally {
        toggleLoading(false);
    }
}

// Load reservations
async function loadReservations() {
    try {
        toggleLoading(true);
        const response = await fetch(`${API_URL}/reservations`, {
            headers: {
                'Authorization': `Bearer ${checkAuth()}`
            }
        });
        const reservations = await response.json();
        
        const reservationList = document.getElementById('reservation-list');
        reservationList.innerHTML = '';
        
        reservations.forEach(reservation => {
            const li = document.createElement('li');
            li.className = reservation.status;
            li.innerHTML = `
                <span>${reservation.name} - Table ${reservation.table}, ${new Date(reservation.date).toLocaleDateString()} ${reservation.time}</span>
                ${reservation.status === 'pending' ? `
                    <button class="btn-approve" onclick="updateReservation('${reservation._id}', 'approved')">Approve</button>
                    <button class="btn-decline" onclick="updateReservation('${reservation._id}', 'declined')">Decline</button>
                ` : `
                    <span class="status-badge">${reservation.status}</span>
                `}
            `;
            reservationList.appendChild(li);
        });
    } catch (error) {
        console.error('Error loading reservations:', error);
        alert('Failed to load reservations');
    } finally {
        toggleLoading(false);
    }
}

// Update reservation status
async function updateReservation(id, status) {
    try {
        toggleLoading(true);
        const response = await fetch(`${API_URL}/reservations/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${checkAuth()}`
            },
            body: JSON.stringify({ status })
        });

        if (!response.ok) throw new Error('Failed to update reservation');

        alert(`Reservation ${status}`);
        loadReservations();
    } catch (error) {
        console.error('Error updating reservation:', error);
        alert('Failed to update reservation');
    } finally {
        toggleLoading(false);
    }
}

// Initialize dashboard
checkAuth();
loadMenuItems();
loadReservations();

// Refresh data periodically
setInterval(() => {
    loadReservations();
}, 30000); // Refresh every 30 seconds