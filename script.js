// Cart data structure
let cart = [];

// Add item to cart
function addToCart(itemName, itemPrice) {
    const item = cart.find(i => i.name === itemName);
    if (item) {
        item.quantity++;
    } else {
        cart.push({ name: itemName, price: itemPrice, quantity: 1 });
    }
    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    const cartItems = document.getElementById('cart-items');
    const totalPrice = document.getElementById('total-price');
    cartItems.innerHTML = '';

    let total = 0;
    cart.forEach(item => {
        const li = document.createElement('li');
        li.textContent = `${item.name} x${item.quantity} - $${item.price * item.quantity}`;
        cartItems.appendChild(li);
        total += item.price * item.quantity;
    });

    totalPrice.textContent = `Total: $${total}`;
}

function filterMenu(category) {
    const items = document.querySelectorAll('.menu-item');
    items.forEach(item => {
        if (category === 'all') {
            item.style.display = 'block';
        } else if (item.classList.contains(category)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}


// Checkout functionality
function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    let receipt = 'Your Order:\n';
    cart.forEach(item => {
        receipt += `${item.name} x${item.quantity} - $${item.price * item.quantity}\n`;
    });
    receipt += `\nTotal: $${cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}`;

    alert(receipt);

    // Clear the cart
    cart = [];
    updateCartDisplay();
}

// Reservation form handling
const reservationForm = document.getElementById('reservation-form');
reservationForm.addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const table = document.getElementById('table').value;

    alert(`Reservation Confirmed:\nName: ${name}\nContact: ${contact}\nDate: ${date}\nTime: ${time}\nTable: ${table}`);

    reservationForm.reset();
});
