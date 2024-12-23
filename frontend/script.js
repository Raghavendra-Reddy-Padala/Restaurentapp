import { menuService, cartService, reservationService } from './services/api.js';

let currentCategory = 'all';
let menuItems = [];

// Toggle loading spinner
const toggleLoading = (show) => {
    document.getElementById('loading').style.display = show ? 'block' : 'none';
};

// Fetch and display menu items
async function loadMenuItems() {
    try {
        toggleLoading(true);
        menuItems = await menuService.getAllItems(); // Fetch menu items using the service
        renderMenu(menuItems); // Render the full menu
        filterMenu(currentCategory); // Filter based on current category
    } catch (error) {
        console.error('Error loading menu:', error);
        alert('Failed to load menu items. Please try again.');
    } finally {
        toggleLoading(false);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    // Add event listeners for category buttons
    document.querySelectorAll('.categories button').forEach(button => {
        button.addEventListener('click', () => {
            filterMenu(button.textContent.toLowerCase());
        });
    });

    // Add event listener for checkout button
    document.querySelector('#cart button').addEventListener('click', checkout);

    // Initialize the app
    loadMenuItems();
    updateCart();
});

// Render the menu items dynamically
function renderMenu(items) {
    const container = document.getElementById('menu-container');
    container.innerHTML = '';

    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = `menu-item ${item.category}`;
        menuItem.innerHTML = `
            <img src="${item.imageUrl}" alt="${item.name}" class="menu-img">
            <h3>${item.name}</h3>
            <p>Price: $${item.price.toFixed(2)}</p>
            <button>Add to Cart</button>
        `;
        
        // Add event listener to the Add to Cart button
        const addButton = menuItem.querySelector('button');
        addButton.addEventListener('click', () => addToCart(item.name, item.price));
        
        container.appendChild(menuItem);
    });
}
// Filter menu items by category
function filterMenu(category) {
    currentCategory = category;

    const filteredItems = category === 'all' 
        ? menuItems 
        : menuItems.filter(item => item.category.toLowerCase() === category.toLowerCase());

    renderMenu(filteredItems); // Render only the filtered items

    // Update active category button
    document.querySelectorAll('.categories button').forEach(btn => {
        btn.classList.toggle('active', btn.innerText.toLowerCase() === category);
    });
}

// Add item to cart
async function addToCart(name, price) {
    try {
        toggleLoading(true);
        await cartService.addToCart({ name, price }); // Add item to the cart
        updateCart(); // Refresh the cart UI
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('Failed to add item to cart. Please try again.');
    } finally {
        toggleLoading(false);
    }
}

// Update cart display
async function updateCart() {
    try {
        const cart = await cartService.getCart(); // Fetch cart items
        const cartItems = document.getElementById('cart-items');
        const totalPrice = document.getElementById('total-price');
        
        cartItems.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            const li = document.createElement('li');
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            li.innerHTML = `
                ${item.name} x${item.quantity} - $${itemTotal.toFixed(2)}
                <button onclick="removeFromCart('${item.name}')" class="remove-btn">Remove</button>
            `;
            cartItems.appendChild(li);
        });

        totalPrice.textContent = `Total: $${total.toFixed(2)}`;
    } catch (error) {
        console.error('Error updating cart:', error);
    }
}

// Checkout
async function checkout() {
    try {
        toggleLoading(true);
        const receipt = await cartService.checkout();
        alert('Order placed successfully!\n\n' + receipt);
        updateCart(); // Refresh the cart after checkout
    } catch (error) {
        console.error('Error during checkout:', error);
        alert('Checkout failed. Please try again.');
    } finally {
        toggleLoading(false);
    }
}

// Handle reservation form submission
document.getElementById('reservation-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        contact: document.getElementById('contact').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        table: document.getElementById('table').value
    };

    try {
        toggleLoading(true);
        const response = await reservationService.createReservation(formData);
        alert('Reservation submitted successfully! We will confirm shortly.');
        event.target.reset();
    } catch (error) {
        console.error('Error making reservation:', error);
        alert('Failed to submit reservation. Please try again.');
    } finally {
        toggleLoading(false);
    }
});


window.addToCart = addToCart;
window.checkout = checkout;
window.filterMenu = filterMenu;


// Initialize the app
loadMenuItems();
updateCart(); 
