// Sample product data
const products = [
    {
        id: 1,
        name: "Classic White Tee",
        description: "Premium quality cotton t-shirt for everyday wear",
        price: 29.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 2,
        name: "Slim Fit Jeans",
        description: "Comfortable and stylish slim fit jeans",
        price: 59.99,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 3,
        name: "Casual Blazer",
        description: "Perfect for both office and casual outings",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 4,
        name: "Running Shoes",
        description: "Lightweight and comfortable running shoes",
        price: 79.99,
        image: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        name: "Leather Wallet",
        description: "Genuine leather wallet with multiple compartments",
        price: 39.99,
        image: "https://images.unsplash.com/photo-1504279577054-acfeccf8fc52?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 6,
        name: "Smart Watch",
        description: "Track your fitness and stay connected",
        price: 199.99,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
];

// Shopping cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    // Load products on home page
    if (document.querySelector('.product-grid')) {
        displayProducts();
    }
    
    // Load cart items on cart page
    if (document.querySelector('.cart-items')) {
        displayCartItems();
    }
    
    // Update cart count
    updateCartCount();
    
    // Setup mobile menu
    setupMobileMenu();
    
    // Add event listener for search bar if it exists
    const searchBar = document.querySelector('.search-bar input');
    if (searchBar) {
        searchBar.addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                searchProducts(e.target.value);
            }
        });
        
        document.querySelector('.search-bar button').addEventListener('click', () => {
            searchProducts(searchBar.value);
        });
    }
});

// Display products in the product grid
function displayProducts() {
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Search products function
function searchProducts(query) {
    if (!query.trim()) {
        displayProducts();
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) || 
        product.description.toLowerCase().includes(query.toLowerCase())
    );
    
    const productGrid = document.querySelector('.product-grid');
    productGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No products found for "${query}"</p>
            </div>
        `;
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">
                    <span class="price">$${product.price.toFixed(2)}</span>
                    <button class="add-to-cart" data-id="${product.id}">Add to Cart</button>
                </div>
            </div>
        `;
        
        productGrid.appendChild(productCard);
    });
    
    // Add event listeners to all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Add product to cart
function addToCart(e) {
    const productId = parseInt(e.target.getAttribute('data-id'));
    const product = products.find(p => p.id === productId);
    
    // Check if product is already in cart
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToLocalStorage();
    updateCartCount();
    showAddedToCartMessage(product.name);
}

// Display cart items on cart page
function displayCartItems() {
    const cartItemsContainer = document.querySelector('.cart-items');
    const emptyCart = document.querySelector('.empty-cart');
    const subtotalElement = document.querySelector('.subtotal');
    const totalElement = document.querySelector('.total-price');
    
    if (cart.length === 0) {
        emptyCart.style.display = 'block';
        cartItemsContainer.innerHTML = '';
        cartItemsContainer.appendChild(emptyCart);
        subtotalElement.textContent = '$0.00';
        totalElement.textContent = '$5.99';
        return;
    }
    
    emptyCart.style.display = 'none';
    cartItemsContainer.innerHTML = '';
    
    let subtotal = 0;
    
    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-desc">${item.description}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)}</div>
            </div>
            <div class="cart-item-actions">
                <div class="quantity-selector">
                    <button class="quantity-decrease" data-id="${item.id}">-</button>
                    <input type="text" value="${item.quantity}" disabled>
                    <button class="quantity-increase" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
        
        // Add event listeners for quantity increase, decrease, and remove buttons
        cartItem.querySelector('.quantity-decrease').addEventListener('click', () => changeItemQuantity(item.id, -1));
        cartItem.querySelector('.quantity-increase').addEventListener('click', () => changeItemQuantity(item.id, 1));
        cartItem.querySelector('.remove-item').addEventListener('click', () => removeItemFromCart(item.id));
    });
    
    // Calculate and display the subtotal
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    totalElement.textContent = `$${(subtotal + 5.99).toFixed(2)}`; // Including shipping
}

// Change item quantity in the cart
function changeItemQuantity(itemId, change) {
    const item = cart.find(item => item.id === itemId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            removeItemFromCart(itemId);
        } else {
            saveCartToLocalStorage();
            displayCartItems();
        }
    }
}

// Remove item from cart
function removeItemFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    
    saveCartToLocalStorage();
    updateCartCount();
    displayCartItems();
}

// Save cart to local storage
function saveCartToLocalStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Update the cart count (icon or header)
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    cartCount.textContent = cart.length;
}

// Show added to cart message (for feedback)
function showAddedToCartMessage(productName) {
    const message = document.createElement('div');
    message.className = 'added-to-cart-message';
    message.textContent = `${productName} added to cart`;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

// Setup mobile menu (if applicable)
function setupMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('open');
        });
    }
}
