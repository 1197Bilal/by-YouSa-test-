console.log("by YouSa | Premium Modest Fashion loaded");

// Product Data (Simulated Database)
const products = [
    {
        id: 'silk-hijab',
        title: 'Champagne Silk Hijab',
        price: 29.95,
        img: 'assets/prod_silk_hijab.png',
        options: { sizes: ['One Size'], lengths: ['Standard', 'Maxi'] }
    },
    {
        id: 'linen-abaya',
        title: 'Linen Kimono Abaya',
        price: 89.95,
        img: 'assets/prod_kimono_abaya.png',
        options: { sizes: ['S', 'M', 'L', 'XL'], lengths: ['Regular', 'Tall (+5cm)'] }
    },
    {
        id: 'tunic-set',
        title: 'Terracotta Tunic Set',
        price: 65.00,
        img: 'assets/cat_sets.png',
        options: { sizes: ['S', 'M', 'L'], lengths: ['Regular'] }
    },
    {
        id: 'pleated-dress',
        title: 'Olive Pleated Dress',
        price: 110.00,
        img: 'assets/cat_abaya.png',
        options: { sizes: ['XS', 'S', 'M', 'L', 'XL'], lengths: ['Regular', 'Tall'] }
    },
    {
        id: 'jersey-hijab',
        title: 'Premium Jersey Hijab',
        price: 19.95,
        img: 'assets/cat_hijab.png',
        options: { sizes: ['One Size'], lengths: ['Standard'] }
    }
];

// Cart State
let cart = [];
let currentProduct = null;
let currentOptions = { size: '', length: '' };

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('by YouSa Store Ready');
    updateCartIcon();

    // Attach click events to "Add to Cart" buttons on cards to open Modal instead
    const cardButtons = document.querySelectorAll('.product-card .add-to-cart-btn');
    const cardImages = document.querySelectorAll('.product-card .product-img-wrapper'); // Make image clickable too

    const handleClick = (e) => {
        // Simple logic: find matching product by title for now, or index
        // In a real app, we'd put data-id on the card.
        // Let's assume order matches array order for simplicity of this demo since we didn't add data-ids yet.
        // Actually, let's look at the parent title to be safe.
        const card = e.target.closest('.product-card');
        const title = card.querySelector('.product-title').innerText;
        const product = products.find(p => p.title === title);

        if (product) {
            openProductModal(product);
        }
    };

    cardButtons.forEach(btn => btn.addEventListener('click', handleClick));
    cardImages.forEach(img => img.addEventListener('click', handleClick));
});

/* --- MODAL LOGIC --- */
function openProductModal(product) {
    currentProduct = product;
    // Reset Options
    currentOptions = { size: '', length: '' };

    // Fill Data
    document.getElementById('modal-img').src = product.img;
    document.getElementById('modal-title').innerText = product.title;
    document.getElementById('modal-price').innerText = product.price.toFixed(2) + '€';

    // Render Options dynamically
    renderOptions('size-options', product.options.sizes, 'size');
    renderOptions('length-options', product.options.lengths, 'length');

    // Show Modal
    document.getElementById('product-modal').style.display = 'flex';
}

function renderOptions(containerId, values, type) {
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    if (!values || values.length === 0) {
        container.parentNode.style.display = 'none';
        currentOptions[type] = 'Standard';
        return;
    }
    container.parentNode.style.display = 'block';

    values.forEach((val, index) => {
        const btn = document.createElement('button');
        btn.className = `opt-btn ${index === 0 ? 'selected' : ''}`;
        btn.innerText = val;
        btn.onclick = () => {
            // Remove selected class from siblings
            Array.from(container.children).forEach(c => c.classList.remove('selected'));
            btn.classList.add('selected');
            currentOptions[type] = val;
        };
        container.appendChild(btn);

        // Auto-select first
        if (index === 0) currentOptions[type] = val;
    });
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

function selectOption(btn, type) {
    // This is handled inside renderOptions now to keep closure clean
    // But if we kept static HTML, we'd use this.
}

/* --- CART LOGIC --- */
function addToCartCurrent() {
    if (!currentProduct) return;

    const item = {
        ...currentProduct,
        selectedSize: currentOptions.size,
        selectedLength: currentOptions.length,
        cartId: Date.now() // Unique ID for cart item
    };

    cart.push(item);
    updateCartIcon();
    closeModal('product-modal');

    // Show Feedback?
    const btn = document.getElementById('cart-float-btn');
    btn.style.transform = 'scale(1.2)';
    setTimeout(() => btn.style.transform = 'scale(1)', 200);
}

function updateCartIcon() {
    document.getElementById('cart-count').innerText = cart.length;
}

function openCart() {
    const container = document.getElementById('cart-items-container');
    const totalDisplay = document.getElementById('cart-total-display');
    container.innerHTML = '';

    let total = 0;

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
    } else {
        cart.forEach((item, index) => {
            total += item.price;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <div class="cart-item-info">
                    <strong>${item.title}</strong>
                    <span class="cart-item-sub">${item.selectedSize} • ${item.selectedLength}</span>
                </div>
                <div>
                    <span>${item.price.toFixed(2)}€</span>
                    <button class="cart-rem-btn" onclick="removeFromCart(${index})">Eliminar</button>
                </div>
            `;
            container.appendChild(div);
        });
    }

    document.getElementById('cart-total-display').innerText = total.toFixed(2) + '€';
    document.getElementById('checkout-modal').style.display = 'flex';
}

function removeFromCart(index) {
    cart.splice(index, 1);
    openCart(); // Re-render
    updateCartIcon();
}

/* --- WHATSAPP GENERATOR --- */
function sendWhatsAppOrder() {
    if (cart.length === 0) {
        alert('Añade productos primero.');
        return;
    }

    const name = document.getElementById('cust-name').value;
    const address = document.getElementById('cust-address').value;
    const payment = document.getElementById('cust-payment').value;

    if (!name || !address) {
        alert('Por favor rellena tus datos.');
        return;
    }

    // Calculate Total
    const total = cart.reduce((acc, item) => acc + item.price, 0).toFixed(2);

    // Build Order List String
    let orderList = '';
    cart.forEach(item => {
        orderList += `▪️ ${item.title} (${item.price.toFixed(2)}€)\n   └ ${item.selectedSize} • ${item.selectedLength}\n`;
    });

    // Format Message
    const message = `🔥 NUEVO PEDIDO APP\n` +
        `👤 ${name}\n` +
        `📍 ${address}\n` +
        `💳 Pago: ${payment}\n\n` +
        `🛒 PEDIDO:\n` +
        `${orderList}\n` +
        `💰 TOTAL: ${total}€`;

    // WhatsApp URL (Replace PHONE with your actual number in production)
    // Using a placeholder number or letting user know
    const phoneNumber = '34636745584'; // Example Spain

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    window.open(url, '_blank');
}

// Navigation Toggle
document.querySelector('.nav-toggle')?.addEventListener('click', () => {
    alert('Menu clicked (Demo)');
});
