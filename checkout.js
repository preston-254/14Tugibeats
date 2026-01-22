// Checkout functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let selectedPaymentMethod = 'card';

// Fallback notification function (if script.js is not loaded)
function showNotification(message, type = 'success') {
    if (typeof window.showNotification === 'function') {
        window.showNotification(message, type);
    } else {
        alert(message);
    }
}

// Initialize checkout
function initCheckout() {
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    displayOrderItems();
    updateCheckoutSummary();
    setupPaymentMethods();
    setupPaymentForms();
}

// Display order items
function displayOrderItems() {
    const orderItems = document.getElementById('checkoutOrderItems');
    orderItems.innerHTML = '';
    
    cart.forEach(item => {
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <img src="${item.image || 'images/Tugi.jpg'}" alt="${item.title}" class="order-item-image" onerror="this.src='images/Tugi.jpg';">
            <div class="order-item-info">
                <div class="order-item-title">${item.title}</div>
                <div class="order-item-price">$${item.price.toFixed(2)}</div>
            </div>
        `;
        orderItems.appendChild(orderItem);
    });
}

// Update checkout summary
function updateCheckoutSummary() {
    const itemsTotal = cart.reduce((sum, item) => sum + item.price, 0);
    const serviceFee = itemsTotal * 0.12; // 12% service fee
    const total = itemsTotal + serviceFee;
    
    document.getElementById('checkoutItemsTotal').textContent = `$${itemsTotal.toFixed(2)}`;
    document.getElementById('checkoutServiceFee').textContent = `$${serviceFee.toFixed(2)}`;
    document.getElementById('checkoutTotal').textContent = `$${total.toFixed(2)}`;
    
    // Update payment amount fields
    const totalAmount = total.toFixed(2);
    document.getElementById('binanceAmount').value = `${totalAmount} USDT`;
    document.getElementById('mpesaAmount').value = `${(total * 150).toFixed(2)} KES`; // Approximate conversion
}

// Setup payment method selection
function setupPaymentMethods() {
    const paymentOptions = document.querySelectorAll('.payment-method-option input[type="radio"]');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', (e) => {
            selectedPaymentMethod = e.target.value;
            showPaymentForm(selectedPaymentMethod);
        });
    });
}

// Show appropriate payment form
function showPaymentForm(method) {
    // Hide all forms
    document.getElementById('cardPaymentForm').style.display = 'none';
    document.getElementById('paypalPaymentForm').style.display = 'none';
    document.getElementById('binancePaymentForm').style.display = 'none';
    document.getElementById('mpesaPaymentForm').style.display = 'none';
    
    // Show selected form
    switch(method) {
        case 'card':
            document.getElementById('cardPaymentForm').style.display = 'block';
            document.getElementById('completePaymentBtn').disabled = false;
            break;
        case 'paypal':
            document.getElementById('paypalPaymentForm').style.display = 'block';
            // Initialize PayPal buttons when form is shown
            setTimeout(() => {
                initializePayPalButtons();
            }, 100);
            // Hide complete payment button for PayPal (PayPal handles its own button)
            document.getElementById('completePaymentBtn').style.display = 'none';
            break;
        case 'binance':
            document.getElementById('binancePaymentForm').style.display = 'block';
            document.getElementById('completePaymentBtn').disabled = false;
            document.getElementById('completePaymentBtn').style.display = 'block';
            break;
        case 'mpesa':
            document.getElementById('mpesaPaymentForm').style.display = 'block';
            document.getElementById('completePaymentBtn').disabled = false;
            document.getElementById('completePaymentBtn').style.display = 'block';
            break;
    }
}

// Setup payment forms
function setupPaymentForms() {
    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // Card expiry formatting
    const cardExpiry = document.getElementById('cardExpiry');
    if (cardExpiry) {
        cardExpiry.addEventListener('input', (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // PayPal buttons are initialized when the form is shown
    
    // M-Pesa button
    const mpesaButton = document.getElementById('mpesaButton');
    if (mpesaButton) {
        mpesaButton.addEventListener('click', () => {
            processMpesaPayment();
        });
    }
    
    // Complete payment button
    const completePaymentBtn = document.getElementById('completePaymentBtn');
    if (completePaymentBtn) {
        completePaymentBtn.addEventListener('click', () => {
            processPayment();
        });
    }
}

// Process payment based on selected method
function processPayment() {
    switch(selectedPaymentMethod) {
        case 'card':
            processCardPayment();
            break;
        case 'paypal':
            processPayPalPayment();
            break;
        case 'binance':
            processBinancePayment();
            break;
        case 'mpesa':
            processMpesaPayment();
            break;
    }
}

// Process card payment
function processCardPayment() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const cardExpiry = document.getElementById('cardExpiry').value;
    const cardCVV = document.getElementById('cardCVV').value;
    const cardName = document.getElementById('cardName').value;
    
    if (!cardNumber || !cardExpiry || !cardCVV || !cardName) {
        alert('Please fill in all card details');
        return;
    }
    
    // Simulate payment processing
    const btn = document.getElementById('completePaymentBtn');
    btn.disabled = true;
    btn.textContent = 'Processing...';
    
    setTimeout(() => {
        alert('Payment successful! Your beats will be available for download shortly.');
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        window.location.href = 'index.html';
    }, 2000);
}

// Initialize PayPal buttons
let paypalButtonsInitialized = false;

function initializePayPalButtons() {
    // Check if PayPal SDK is loaded
    if (typeof paypal === 'undefined') {
        console.warn('PayPal SDK not loaded. Please configure your PayPal Client ID in checkout.html');
        const container = document.getElementById('paypal-button-container');
        if (container) {
            container.innerHTML = `
                <div style="padding: 2rem; text-align: center; background: #f0f0f0; border-radius: 8px; color: #666;">
                    <p style="margin-bottom: 1rem;">PayPal integration requires a Client ID.</p>
                    <p style="font-size: 0.9rem;">Please configure your PayPal Client ID in checkout.html</p>
                    <p style="font-size: 0.8rem; margin-top: 0.5rem; color: #999;">
                        Get your Client ID at: <a href="https://developer.paypal.com" target="_blank" style="color: #0070ba;">developer.paypal.com</a>
                    </p>
                </div>
            `;
        }
        return;
    }
    
    if (paypalButtonsInitialized) {
        return;
    }
    
    const itemsTotal = cart.reduce((sum, item) => sum + item.price, 0);
    const serviceFee = itemsTotal * 0.12;
    const total = itemsTotal + serviceFee;
    
    // Clear previous buttons
    const container = document.getElementById('paypal-button-container');
    if (!container) return;
    
    container.innerHTML = '';
    
    // Create PayPal order items
    const orderItems = cart.map(item => ({
        name: item.title,
        quantity: '1',
        unit_amount: {
            currency_code: 'USD',
            value: item.price.toFixed(2)
        }
    }));
    
    // Add service fee as an item
    if (serviceFee > 0) {
        orderItems.push({
            name: 'Service Fee',
            quantity: '1',
            unit_amount: {
                currency_code: 'USD',
                value: serviceFee.toFixed(2)
            }
        });
    }
    
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal'
        },
        createOrder: function(data, actions) {
            return actions.order.create({
                purchase_units: [{
                    amount: {
                        currency_code: 'USD',
                        value: total.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: total.toFixed(2)
                            }
                        }
                    },
                    items: orderItems
                }]
            });
        },
        onApprove: function(data, actions) {
            return actions.order.capture().then(function(details) {
                // Payment successful
                showNotification('PayPal payment successful! Your beats will be available for download shortly.', 'success');
                
                // Clear cart
                cart = [];
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Redirect after a short delay
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);
            });
        },
        onError: function(err) {
            showNotification('PayPal payment failed. Please try again.', 'error');
            console.error('PayPal Error:', err);
        },
        onCancel: function(data) {
            showNotification('PayPal payment was cancelled.', 'info');
        }
    }).render('#paypal-button-container');
    
    paypalButtonsInitialized = true;
}

// Process PayPal payment (fallback for manual trigger)
function processPayPalPayment() {
    // PayPal buttons handle their own flow, but we can trigger initialization
    if (selectedPaymentMethod === 'paypal') {
        initializePayPalButtons();
    }
}

// Process Binance payment
function processBinancePayment() {
    const binanceAddress = document.getElementById('binanceAddress').value;
    
    if (!binanceAddress) {
        alert('Please enter your Binance wallet address');
        return;
    }
    
    const itemsTotal = cart.reduce((sum, item) => sum + item.price, 0);
    const serviceFee = itemsTotal * 0.12;
    const total = itemsTotal + serviceFee;
    
    alert(`Binance Payment Instructions:\n\nSend ${total.toFixed(2)} USDT to:\n${binanceAddress}\n\nAfter confirmation, your beats will be available for download.`);
    
    // In production, you would generate a QR code and wait for blockchain confirmation
}

// Process M-Pesa payment
function processMpesaPayment() {
    const phoneNumber = document.getElementById('mpesaPhone').value;
    
    if (!phoneNumber) {
        alert('Please enter your M-Pesa phone number');
        return;
    }
    
    // Format phone number (remove + if present, ensure it starts with 254)
    let formattedPhone = phoneNumber.replace(/\+/g, '').replace(/\s/g, '');
    if (formattedPhone.startsWith('0')) {
        formattedPhone = '254' + formattedPhone.substring(1);
    }
    if (!formattedPhone.startsWith('254')) {
        formattedPhone = '254' + formattedPhone;
    }
    
    const itemsTotal = cart.reduce((sum, item) => sum + item.price, 0);
    const serviceFee = itemsTotal * 0.12;
    const total = itemsTotal + serviceFee;
    const kesAmount = (total * 150).toFixed(2); // Approximate conversion
    
    const btn = document.getElementById('mpesaButton');
    btn.disabled = true;
    btn.textContent = 'Sending STK Push...';
    
    // Simulate M-Pesa STK Push
    setTimeout(() => {
        alert(`M-Pesa STK Push sent to ${formattedPhone}\n\nAmount: KES ${kesAmount}\n\nPlease check your phone and enter your M-Pesa PIN to complete the payment.`);
        
        // Simulate payment confirmation
        setTimeout(() => {
            alert('M-Pesa payment successful! Your beats will be available for download shortly.');
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            window.location.href = 'index.html';
        }, 3000);
        
        btn.disabled = false;
        btn.textContent = 'Initiate STK Push';
    }, 1500);
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCheckout);
} else {
    initCheckout();
}

