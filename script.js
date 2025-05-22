function showSidebar() {
    const sidebar = document.querySelector('.side-bar');
    sidebar.style.display = 'flex';
}
function hideSidebar() {
    const sidebar = document.querySelector('.side-bar');
    sidebar.style.display = 'none';
}
function showCart() {
    const cartSection = document.getElementById('cart-section');
    cartSection.style.display = 'flex';
}
function hideCart() {
    const cartSection = document.getElementById('cart-section');
    cartSection.style.display = 'none';
}

let cart = [];
let cartTotal = 0;

function addToCart(productName, price) {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('Please login to add items to cart');
        window.location.href = 'login.html';
        return;
    }

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const existingItem = cart.find(item => item.name === productName);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: productName, price: price, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
    showCart();
}

function removeFromCart(productName) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCart();
}

function updateCart() {
    const cartItems = document.getElementById('cart-items');
    const cartCount = document.querySelector('#shopping-cart span');
    const cartSubtotal = document.getElementById('cart-subtotal');
    const cartShipping = document.getElementById('cart-shipping');
    const cartTotal = document.getElementById('cart-total');
    
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    if (cartItems) {
        cartItems.innerHTML = '';
        let subtotal = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            
            const li = document.createElement('li');
            li.innerHTML = `
                <div class="cart-item">
                    <span>${item.name}</span>
                    <span>₱${item.price.toLocaleString()}</span>
                    <span>Qty: ${item.quantity}</span>
                    <button onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
            `;
            cartItems.appendChild(li);
        });
        
        const shipping = subtotal > 0 ? 100 : 0;
        const total = subtotal + shipping;
        
        if (cartSubtotal) cartSubtotal.textContent = `₱${subtotal.toLocaleString()}`;
        if (cartShipping) cartShipping.textContent = `₱${shipping.toLocaleString()}`;
        if (cartTotal) cartTotal.textContent = `₱${total.toLocaleString()}`;
    }
}

function checkout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    window.location.href = 'checkout.html';
}

function searchProducts() {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('h3').textContent.toLowerCase();
        const shouldShow = productName.includes(searchTerm);
        card.style.display = shouldShow ? 'block' : 'none';
    });
}

function filterProducts() {
    const categoryFilter = document.getElementById('category-filter').value;
    const priceFilter = document.getElementById('price-filter').value;
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const category = card.dataset.category;
        const price = parseFloat(card.dataset.price);
        let showByCategory = true;
        let showByPrice = true;
        
        if (categoryFilter && category !== categoryFilter) {
            showByCategory = false;
        }
        
        if (priceFilter) {
            if (priceFilter === '5000+') {
                showByPrice = price >= 5000;
            } else {
                const [min, max] = priceFilter.split('-').map(Number);
                showByPrice = price >= min && price <= max;
            }
        }
        
        card.style.display = (showByCategory && showByPrice) ? 'block' : 'none';
    });
}

function sortProducts() {
    const sortBy = document.getElementById('sort-by').value;
    const productContainer = document.querySelector('.product-container');
    const productCards = Array.from(document.querySelectorAll('.product-card'));
    
    productCards.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        const nameA = a.querySelector('h3').textContent;
        const nameB = b.querySelector('h3').textContent;
        
        switch(sortBy) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            case 'name':
                return nameA.localeCompare(nameB);
            default:
                return 0;
        }
    });
    
    productCards.forEach(card => productContainer.appendChild(card));
}

function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('remember').checked;

    if (!username || !password) {
        alert('Please enter both username and password.');
        return;
    }

    if (username === 'macale' && password === 'macale013' || username === 'ichi' && password === 'ichi123') {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        if (rememberMe) {
            localStorage.setItem('rememberMe', 'true');
        }

        window.location.href = 'index.html';
    } else {
        alert('Invalid username or password. Try macale/macale013');
    }
}

function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const username = localStorage.getItem('username');
    const currentPage = window.location.pathname.split('/').pop();
    
    const loginLinks = document.querySelectorAll('.login-link');
    const profileLinks = document.querySelectorAll('.profile-link');
    const logoutButtons = document.querySelectorAll('.logout-btn');

    if (isLoggedIn) {
        loginLinks.forEach(link => link.style.display = 'none');
        profileLinks.forEach(link => {
            link.style.display = 'block';
            link.textContent = username || 'Profile';
        });
        logoutButtons.forEach(btn => btn.style.display = 'block');

        if (currentPage === 'login.html') {
            window.location.href = 'index.html';
        }
    } else {
        loginLinks.forEach(link => link.style.display = 'block');
        profileLinks.forEach(link => link.style.display = 'none');
        logoutButtons.forEach(btn => btn.style.display = 'none');

        const protectedPages = ['profile.html', 'product.html'];
        if (protectedPages.includes(currentPage)) {
            window.location.href = 'login.html';
        }
    }
}

function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    localStorage.removeItem('rememberMe');
    window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
    
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortBy = document.getElementById('sort-by');
    
    if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
    if (priceFilter) priceFilter.addEventListener('change', filterProducts);
    if (sortBy) sortBy.addEventListener('change', sortProducts);
    
    updateCart();
    updateCartCount();

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const logoutButtons = document.querySelectorAll('.logout-btn');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', handleLogout);
    });

    checkLoginStatus();

    if (window.location.pathname.includes('checkout.html')) {
        const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
        const creditCardDetails = document.getElementById('creditCardDetails');
        const gcashDetails = document.getElementById('gcashDetails');

        if (paymentMethods.length > 0) {
            paymentMethods.forEach(method => {
                method.addEventListener('change', function() {
                    creditCardDetails.style.display = 'none';
                    gcashDetails.style.display = 'none';

                    if (this.value === 'creditCard') {
                        creditCardDetails.style.display = 'block';
                    } else if (this.value === 'gcash') {
                        gcashDetails.style.display = 'block';
                    }
                });
            });
        }

        loadOrderSummary();

        const checkoutForm = document.getElementById('checkout-form');
        if (checkoutForm) {
            checkoutForm.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const formData = new FormData(this);
                const orderData = {
                    shipping: {
                        fullName: formData.get('fullName'),
                        email: formData.get('email'),
                        phone: formData.get('phone'),
                        address: formData.get('address'),
                        city: formData.get('city'),
                        postalCode: formData.get('postalCode'),
                        country: formData.get('country')
                    },
                    payment: {
                        method: formData.get('paymentMethod'),
                        cardNumber: formData.get('cardNumber'),
                        expiryDate: formData.get('expiryDate'),
                        cvv: formData.get('cvv'),
                        cardName: formData.get('cardName'),
                        gcashNumber: formData.get('gcashNumber')
                    }
                };

                if (!validateCheckoutForm(orderData)) {
                    return;
                }

                processOrder(orderData);
            });
        }
    }
});

(function(){
    const profilePicInput = document.getElementById('profilePicInput');
    const profilePicPreview = document.getElementById('profilePicPreview');
    const logoutBtn = document.getElementById('logoutBtn');
    const profilePicWrapper = document.querySelector('.profile-pic-wrapper');
    const profileForm = document.getElementById('profileForm');

    if (profilePicInput && profilePicPreview && logoutBtn && profilePicWrapper && profileForm) {
        profilePicInput.addEventListener('change', function(event){
            const file = event.target.files[0];
            if (file && file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    profilePicPreview.src = e.target.result;
                    localStorage.setItem('profilePicture', e.target.result);
                    showAlert('Profile picture updated successfully!', 'success');
                };
                reader.readAsDataURL(file);
            } else {
                showAlert('Please select a valid image file.', 'error');
                profilePicPreview.src = 'https://cdn-icons-png.flaticon.com/512/194/194938.png';
            }
        });

        profilePicWrapper.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                profilePicInput.click();
            }
        });

        logoutBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to logout?')) {
                handleLogout();
            }
        });

        profileForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const name = document.getElementById('nameInput').value.trim();
            const contact = document.getElementById('contactInput').value.trim();
            const email = document.getElementById('emailInput').value.trim();

            if (!name) {
                showAlert('Please enter your name.', 'error');
                return;
            }

            if (!email) {
                showAlert('Please enter your email.', 'error');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Please enter a valid email address.', 'error');
                return;
            }

            if (contact) {
                const phoneRegex = /^09\d{9}$/;
                if (!phoneRegex.test(contact)) {
                    showAlert('Please enter a valid Philippine phone number (09XXXXXXXXX).', 'error');
                    return;
                }
            }

            const profileData = {
                name: name,
                contact: contact,
                email: email,
                lastUpdated: new Date().toISOString()
            };
            localStorage.setItem('profileData', JSON.stringify(profileData));

            const username = localStorage.getItem('username');
            if (username) {
                localStorage.setItem('username', name);
                const profileLinks = document.querySelectorAll('.profile-link');
                profileLinks.forEach(link => {
                    link.textContent = name;
                });
            }

            showAlert('Profile saved successfully!', 'success');
        });

        function showAlert(message, type = 'info') {
            const existingAlert = document.querySelector('.alert');
            if (existingAlert) {
                existingAlert.remove();
            }

            const alert = document.createElement('div');
            alert.className = `alert ${type}`;
            alert.innerHTML = `
                <i class="fa ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <span>${message}</span>
            `;

            document.body.appendChild(alert);

            setTimeout(() => {
                alert.remove();
            }, 3000);
        }

        function loadProfileData() {
            const savedData = localStorage.getItem('profileData');
            if (savedData) {
                const profileData = JSON.parse(savedData);
                document.getElementById('nameInput').value = profileData.name || '';
                document.getElementById('contactInput').value = profileData.contact || '';
                document.getElementById('emailInput').value = profileData.email || '';
            }

            const savedPicture = localStorage.getItem('profilePicture');
            if (savedPicture) {
                profilePicPreview.src = savedPicture;
            }
        }

        loadProfileData();
    }
})();

document.addEventListener('DOMContentLoaded', function() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const creditCardDetails = document.getElementById('creditCardDetails');
    const gcashDetails = document.getElementById('gcashDetails');

    if (paymentMethods.length > 0) {
        paymentMethods.forEach(method => {
            method.addEventListener('change', function() {
                creditCardDetails.style.display = 'none';
                gcashDetails.style.display = 'none';

                if (this.value === 'creditCard') {
                    creditCardDetails.style.display = 'block';
                } else if (this.value === 'gcash') {
                    gcashDetails.style.display = 'block';
                }
            });
        });
    }

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const orderData = {
                shipping: {
                    fullName: formData.get('fullName'),
                    email: formData.get('email'),
                    phone: formData.get('phone'),
                    address: formData.get('address'),
                    city: formData.get('city'),
                    postalCode: formData.get('postalCode'),
                    country: formData.get('country')
                },
                payment: {
                    method: formData.get('paymentMethod'),
                    cardNumber: formData.get('cardNumber'),
                    expiryDate: formData.get('expiryDate'),
                    cvv: formData.get('cvv'),
                    cardName: formData.get('cardName'),
                    gcashNumber: formData.get('gcashNumber')
                }
            };

            if (!validateCheckoutForm(orderData)) {
                return;
            }

            processOrder(orderData);
        });
    }

    loadOrderSummary();
});

function validateCheckoutForm(orderData) {
    const { shipping, payment } = orderData;

    if (!shipping.fullName || !shipping.email || !shipping.phone || !shipping.address || 
        !shipping.city || !shipping.postalCode || !shipping.country) {
        alert('Please fill in all shipping information');
        return false;
    }

    if (payment.method === 'creditCard') {
        if (!payment.cardNumber || !payment.expiryDate || !payment.cvv || !payment.cardName) {
            alert('Please fill in all credit card details');
            return false;
        }
    } else if (payment.method === 'gcash') {
        if (!payment.gcashNumber) {
            alert('Please enter your GCash number');
            return false;
        }
    }

    return true;
}

function processOrder(orderData) {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cartItems.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    const order = {
        items: cartItems,
        shipping: orderData.shipping,
        payment: orderData.payment,
        orderDate: new Date().toISOString(),
        orderNumber: 'ORD-' + Math.random().toString(36).substr(2, 9).toUpperCase()
    };

    const orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    alert(`Order placed successfully!\nOrder Number: ${order.orderNumber}\nThank you for your purchase!`);
    
    localStorage.removeItem('cart');
    updateCart();
    
    window.location.href = 'index.html';
}

function loadOrderSummary() {
    const orderItems = document.getElementById('order-items');
    const subtotalElement = document.getElementById('subtotal');
    const shippingElement = document.getElementById('shipping');
    const totalElement = document.getElementById('total');

    if (!orderItems) return;

    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cartItems.length === 0) {
        window.location.href = 'product.html';
        return;
    }
    
    let subtotal = 0;
    orderItems.innerHTML = '';
    
    cartItems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const orderItem = document.createElement('div');
        orderItem.className = 'order-item';
        orderItem.innerHTML = `
            <span>${item.name} x ${item.quantity}</span>
            <span>₱${itemTotal.toFixed(2)}</span>
        `;
        orderItems.appendChild(orderItem);
    });
    
    const shipping = 100;
    const total = subtotal + shipping;

    if (subtotalElement) subtotalElement.textContent = `₱${subtotal.toFixed(2)}`;
    if (shippingElement) shippingElement.textContent = `₱${shipping.toFixed(2)}`;
    if (totalElement) totalElement.textContent = `₱${total.toFixed(2)}`;
}

function updateCartCount() {
    const cartCount = document.querySelector('#shopping-cart span');
    if (cartCount) {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}