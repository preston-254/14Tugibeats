// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize cart display
function initCart() {
    displayCartItems();
    updateCartSummary();
    updateCheckoutButton();
}

// Display cart items
function displayCartItems() {
    const cartItemsList = document.getElementById('cartItemsList');
    const emptyCartMessage = document.getElementById('emptyCartMessage');
    
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
        cartItemsList.innerHTML = '';
        cartItemsList.appendChild(emptyCartMessage);
        return;
    }
    
    emptyCartMessage.style.display = 'none';
    cartItemsList.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image || 'images/Tugi.jpg'}" alt="${item.title}" class="cart-item-image" onerror="this.src='images/Tugi.jpg';">
            <div class="cart-item-details">
                <div class="cart-item-artist">
                    <img src="images/Tugi.jpg" alt="14 Tugi" onerror="this.style.display='none';">
                    <span>14 Tugi</span>
                </div>
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-type">Track • MP3 Lease (MP3)</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                <a href="#" class="cart-item-license">Review License</a>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${index})">×</button>
        `;
        cartItemsList.appendChild(cartItem);
    });
    
    // Show discount banner if applicable
    const discountBanner = document.getElementById('discountBanner');
    if (cart.length >= 2) {
        discountBanner.style.display = 'block';
    } else {
        discountBanner.style.display = 'none';
    }
}

// Update cart summary
function updateCartSummary() {
    const itemsTotal = cart.reduce((sum, item) => sum + item.price, 0);
    const serviceFee = itemsTotal * 0.12; // 12% service fee
    const subtotal = itemsTotal + serviceFee;
    
    document.getElementById('itemsTotal').textContent = `$${itemsTotal.toFixed(2)}`;
    document.getElementById('serviceFee').textContent = `$${serviceFee.toFixed(2)}`;
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('itemCount').textContent = cart.length;
}

// Update checkout button
function updateCheckoutButton() {
    const checkoutBtn = document.getElementById('proceedToCheckout');
    if (cart.length > 0) {
        checkoutBtn.disabled = false;
        checkoutBtn.onclick = () => {
            window.location.href = 'checkout.html';
        };
    } else {
        checkoutBtn.disabled = true;
    }
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartSummary();
    updateCheckoutButton();
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCart);
} else {
    initCart();
}

