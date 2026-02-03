// ============================================
// STREETHYPE - Main JavaScript
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initHeroSlider();
    initMobileNav();
    initCart();
    initPopup();
    initNewsletter();
    initSmoothScroll();
    initFaqAccordion();
    initAddToCartButtons();
});

// ============================================
// HERO SLIDER
// ============================================
function initHeroSlider() {
    const slides = document.querySelectorAll('.hero__slide');
    const dots = document.querySelectorAll('.hero__dot');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');

    if (!slides.length) return;

    let currentSlide = 0;
    let autoSlideInterval;

    function showSlide(index) {
        // Normalize index
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;

        // Update slides
        slides.forEach((slide, i) => {
            slide.classList.toggle('active', i === index);
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });

        currentSlide = index;
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        autoSlideInterval = setInterval(nextSlide, 5000);
    }

    function stopAutoSlide() {
        clearInterval(autoSlideInterval);
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            stopAutoSlide();
            startAutoSlide();
        });
    }

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoSlide();
            startAutoSlide();
        });
    });

    // Start auto slide
    startAutoSlide();

    // Pause on hover
    const heroSection = document.querySelector('.hero');
    if (heroSection) {
        heroSection.addEventListener('mouseenter', stopAutoSlide);
        heroSection.addEventListener('mouseleave', startAutoSlide);
    }
}

// ============================================
// MOBILE NAVIGATION
// ============================================
function initMobileNav() {
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const mobileNavClose = document.getElementById('mobileNavClose');
    const mobileOverlay = document.getElementById('mobileOverlay');

    if (!menuToggle || !mobileNav) return;

    function openNav() {
        mobileNav.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeNav() {
        mobileNav.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    menuToggle.addEventListener('click', openNav);
    mobileNavClose.addEventListener('click', closeNav);
    mobileOverlay.addEventListener('click', closeNav);

    // Close on nav link click
    const navLinks = mobileNav.querySelectorAll('.mobile-nav__link');
    navLinks.forEach(link => {
        link.addEventListener('click', closeNav);
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeNav();
        }
    });
}

// ============================================
// CART FUNCTIONALITY (CYBERPUNK SIDEBAR)
// ============================================
let cart = [];

function initCart() {
    // 1. Inject Cart Sidebar HTML if not exists
    if (!document.getElementById('cartSidebar')) {
        const cartHTML = `
            <div class="cart-sidebar" id="cartSidebar">
                <div class="cart-sidebar__header">
                    <h2 class="cart-sidebar__title">DATA_CACHE // CART</h2>
                    <button class="cart-sidebar__close" id="cartClose">✕</button>
                </div>
                <div class="cart-sidebar__content" id="cartItems">
                    <!-- Items will be injected here -->
                    <div class="cart-empty">SYSTEM_EMPTY // NO_DATA</div>
                </div>
                <div class="cart-sidebar__footer">
                    <div class="cart-total">
                        <span>TOTAL_sum:</span>
                        <span id="cartTotalSum">0 RUB</span>
                    </div>
                    <button class="cart-checkout-btn" onclick="alert('SYSTEM_ERROR: PAYMENT_GATEWAY_OFFLINE')">INITIATE_TRANSFER</button>
                </div>
            </div>
            <div class="cart-overlay" id="cartOverlay"></div>
        `;
        document.body.insertAdjacentHTML('beforeend', cartHTML);
    }

    // 2. Load cart from localStorage
    const savedCart = localStorage.getItem('streethype_cart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
        } catch (e) {
            cart = [];
        }
    }

    updateCartCount();
    renderCartItems();

    // 3. Event Listeners
    const cartBtns = document.querySelectorAll('.header__cart, #cartBtn'); // Catch all cart buttons
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    const closeBtn = document.getElementById('cartClose');

    function openCart(e) {
        if (e) e.preventDefault();
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeCart() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    cartBtns.forEach(btn => btn.addEventListener('click', openCart));
    closeBtn.addEventListener('click', closeCart);
    overlay.addEventListener('click', closeCart);
}

function addToCart(productId) {
    // Product data (SYSTEM MOCKUP)
    const products = {
        1: { id: 1, name: 'T-Shirt "Abstract"', price: 3200, img: 'images/product_tshirt_1_1769257974154.png' },
        2: { id: 2, name: 'T-Shirt "Typography"', price: 3200, img: 'images/product_tshirt_2_1769257991862.png' },
        3: { id: 3, name: 'Longsleeve "Minimal"', price: 4000, img: 'images/product_longsleeve_1_1769258004454.png' },
        4: { id: 4, name: 'Longsleeve "Vintage"', price: 4000, img: 'images/product_longsleeve_2_1769258018680.png' },
        5: { id: 5, name: 'Zip Hoodie "Street"', price: 7500, img: 'images/product_hoodie_1_1769258041855.png' },
        6: { id: 6, name: 'Hoodie "Vortex"', price: 6800, img: 'images/product_hoodie_2_1769258054565.png' },
        7: { id: 7, name: 'Hoodie "Olive"', price: 6500, img: 'images/product_hoodie_3_1769258068202.png' },
        8: { id: 8, name: 'Hoodie "Botanical"', price: 6800, img: 'images/product_hoodie_4_1769258081317.png' },
        9: { id: 9, name: 'Candle "Noir"', price: 1800, img: 'images/product_candle_1_1769258104156.png' },
        10: { id: 10, name: 'Candle "Blanc"', price: 1800, img: 'images/product_candle_2_1769258121598.png' },
        11: { id: 11, name: 'Pillow "Faces"', price: 2200, img: 'images/product_pillow_1_1769258135478.png' },
        12: { id: 12, name: 'Pillow "Linen"', price: 2000, img: 'images/product_pillow_2_1769258148459.png' }
    };

    const product = products[productId];
    if (!product) return;

    // Check if exists
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    renderCartItems();

    // Open cart to show result
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    sidebar.classList.add('active');
    overlay.classList.add('active');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartItems();
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartCount();
            renderCartItems();
        }
    }
}

function saveCart() {
    localStorage.setItem('streethype_cart', JSON.stringify(cart));
}

function updateCartCount() {
    const countElement = document.getElementById('cartCount');
    if (countElement) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        countElement.textContent = totalItems;
        countElement.classList.toggle('visible', totalItems > 0);
    }
}

function renderCartItems() {
    const container = document.getElementById('cartItems');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<div class="cart-empty">SYSTEM_EMPTY // NO_DATA_FOUND</div>';
        document.getElementById('cartTotalSum').textContent = '0 RUB';
        return;
    }

    let total = 0;
    container.innerHTML = cart.map(item => {
        total += item.price * item.quantity;
        return `
            <div class="cart-item">
                <div class="cart-item__img">
                    <img src="${item.img}" alt="${item.name}">
                </div>
                <div class="cart-item__info">
                    <div class="cart-item__name">${item.name}</div>
                    <div class="cart-item__price">${item.price} RUB</div>
                    <div class="cart-item__controls">
                        <button onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <button class="cart-item__remove" onclick="removeFromCart(${item.id})">×</button>
            </div>
        `;
    }).join('');

    document.getElementById('cartTotalSum').textContent = total.toLocaleString() + ' RUB';
}

// ============================================
// POPUP
// ============================================
function initPopup() {
    const popup = document.getElementById('welcomePopup');
    const popupClose = document.getElementById('popupClose');
    const popupForm = document.getElementById('popupForm');

    if (!popup) return;

    // Check if popup was already shown
    const popupShown = sessionStorage.getItem('popup_shown');

    if (!popupShown) {
        // Show popup after 5 seconds
        setTimeout(() => {
            popup.classList.add('active');
        }, 5000);
    }

    function closePopup() {
        popup.classList.remove('active');
        sessionStorage.setItem('popup_shown', 'true');
    }

    if (popupClose) {
        popupClose.addEventListener('click', closePopup);
    }

    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            closePopup();
        }
    });

    if (popupForm) {
        popupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = popupForm.querySelector('input[type="email"]').value;
            console.log('Popup subscription:', email);
            alert('Спасибо за подписку! Ваш промокод: WELCOME10');
            closePopup();
        });
    }

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup.classList.contains('active')) {
            closePopup();
        }
    });
}

// ============================================
// NEWSLETTER
// ============================================
function initNewsletter() {
    const form = document.getElementById('newsletterForm');

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = form.querySelector('input[type="email"]').value;
            console.log('Newsletter subscription:', email);
            alert('Спасибо за подписку! Мы будем держать вас в курсе новинок.');
            form.reset();
        });
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#cart') return;

            e.preventDefault();

            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// SCROLL ANIMATIONS
// ============================================
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe product cards
    document.querySelectorAll('.product-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
}

// Add animation styles
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(animationStyles);

// Initialize scroll animations after page load
window.addEventListener('load', initScrollAnimations);

// ============================================
// FAQ ACCORDION
// ============================================
function initFaqAccordion() {
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = faqItem.querySelector('.faq-answer');
            const isActive = faqItem.classList.contains('active');

            // Close all other items
            document.querySelectorAll('.faq-item.active').forEach(item => {
                item.classList.remove('active');
                item.querySelector('.faq-answer').style.maxHeight = '0';
            });

            // Toggle current item
            if (!isActive) {
                faqItem.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            }
        });
    });
}

// ============================================
// GENERIC ADD TO CART BUTTONS
// ============================================
function initAddToCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart-btn');

    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const name = btn.dataset.name;
            const price = parseInt(btn.dataset.price);

            if (name && price) {
                // Generate unique ID from name
                const id = name.toLowerCase().replace(/\s+/g, '_');

                // Check if already in cart
                const existingItem = cart.find(item => item.id === id);
                if (existingItem) {
                    existingItem.quantity++;
                } else {
                    cart.push({ id, name, price, quantity: 1 });
                }

                localStorage.setItem('streethype_cart', JSON.stringify(cart));
                updateCartCount();
                showAddedToCartNotification(name);
            }
        });
    });
}
