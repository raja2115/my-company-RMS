// ================= DEFAULT SITE DATA (FALLBACKS) =================
const DEFAULT_SERVICES = [
    {
        title: "AI & Machine Learning Solutions",
        icon: "cpu",
        desc: "Deploy production-grade large language models, smart automation pipelines, and data-driven prediction algorithms tailored to your exact operations."
    },
    {
        title: "Full-Stack Enterprise Engineering",
        icon: "code",
        desc: "Build highly reliable web applications, distributed APIs, and performant backend systems using state-of-the-art frameworks and practices."
    },
    {
        title: "Cloud Infrastructure & DevOps",
        icon: "cloud",
        desc: "Accelerate your deployments with managed cloud setups (AWS/GCP), CI/CD pipelines, automated scaling, and enterprise security guardrails."
    }
];

const DEFAULT_PRODUCTS = [
    {
        title: "RMS Workflow Hub",
        tag: "SaaS",
        desc: "An intuitive collaborative platform designed to orchestrate complex services and product pipelines under a single unified dashboard.",
        link: "#"
    },
    {
        title: "RMS Sentinel Security",
        tag: "Compliance",
        desc: "Continuous security audit engine that scans enterprise codebases for compliance, secret leaks, and dependency vulnerabilities.",
        link: "#"
    },
    {
        title: "RMS Analytics Engine",
        tag: "Analytics",
        desc: "Real-time metrics tracking and resource performance monitoring dashboard for cloud nodes and API latency.",
        link: "#"
    }
];

const DEFAULT_CEO_INFO = {
    name: "Raja Meenakshi Sundaram G",
    quote: `"Innovation isn't just about build-quality; it's about solving the right problems with scalable, hybrid solutions. We bridge high-performance consultancy with cutting-edge software development to lead companies into the automation era."`,
    bio: "Raja Meenakshi Sundaram G is a visionary technology entrepreneur with deep experience in orchestrating modern, multi-task systems. By uniting both service-oriented technical workflows and modular products, he leads RMS MultiTech's mission to drive business transformation across global sectors.",
    phone: "9043389303",
    email: "rajalegand1114@gmail.com"
};

const DEFAULT_HERO_INFO = {
    title: "Empowering Businesses with Dual-Engine Innovation",
    subtitle: "We deliver customized high-performance engineering services and state-of-the-art SaaS products under one visionary leadership."
};

const DEFAULT_ABOUT_INFO = {
    title: "Who We Are",
    desc: "A multi-task organization structured to provide high-quality services alongside custom products."
};

const DEFAULT_SERVICES_HEADER = {
    title: "Our Core Services",
    desc: "Tailored technical solutions designed to scale your operations and drive digital growth."
};

const DEFAULT_PRODUCTS_HEADER = {
    title: "Featured Products",
    desc: "Innovative digital platforms engineered to streamline business administration and tasks."
};

const DEFAULT_CONTACT_HEADER = {
    title: "Let's Build Together",
    desc: "Whether you have a query about our development services, wish to license one of our enterprise products, or want to discuss direct integration with our founder, our team is ready to assist."
};

const DEFAULT_CORPORATE_INFO = {
    address: "5-24-57/12 Silon Colony North, Virudhunagar, Aruppukottai, Palayampattai",
    phone: "+91 9043389303",
    email: "rajalegand1114@gmail.com",
    hours: "Mon - Fri, 9:00 AM - 6:00 PM IST"
};

// ================= STATE MANAGEMENT =================
let state = {
    isAdmin: false,
    hero: {},
    about: {},
    servicesHeader: {},
    productsHeader: {},
    ceo: {},
    contactHeader: {},
    corporate: {},
    services: [],
    products: []
};

// Helper functions for nested object property access
function getValueByPath(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

function setValueByPath(obj, path, value) {
    const parts = path.split('.');
    const last = parts.pop();
    const target = parts.reduce((acc, part) => acc[part], obj);
    if (target) {
        target[last] = value;
    }
}

// Load state from backend API
async function initLocalState() {
    try {
        const response = await fetch('/api/state');
        const data = await response.json();
        state.hero = data.hero || { ...DEFAULT_HERO_INFO };
        state.about = data.about || { ...DEFAULT_ABOUT_INFO };
        state.servicesHeader = data.servicesHeader || { ...DEFAULT_SERVICES_HEADER };
        state.productsHeader = data.productsHeader || { ...DEFAULT_PRODUCTS_HEADER };
        state.ceo = data.ceo || { ...DEFAULT_CEO_INFO };
        state.contactHeader = data.contactHeader || { ...DEFAULT_CONTACT_HEADER };
        state.corporate = data.corporate || { ...DEFAULT_CORPORATE_INFO };
        state.services = data.services || [ ...DEFAULT_SERVICES ];
        state.products = data.products || [ ...DEFAULT_PRODUCTS ];
    } catch (e) {
        console.error("Failed to load state from server, falling back to local defaults:", e);
        state.hero = { ...DEFAULT_HERO_INFO };
        state.about = { ...DEFAULT_ABOUT_INFO };
        state.servicesHeader = { ...DEFAULT_SERVICES_HEADER };
        state.productsHeader = { ...DEFAULT_PRODUCTS_HEADER };
        state.ceo = { ...DEFAULT_CEO_INFO };
        state.contactHeader = { ...DEFAULT_CONTACT_HEADER };
        state.corporate = { ...DEFAULT_CORPORATE_INFO };
        state.services = [ ...DEFAULT_SERVICES ];
        state.products = [ ...DEFAULT_PRODUCTS ];
    }
}

// Save state to backend API
async function saveStateToBackend() {
    try {
        const response = await fetch('/api/state', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                hero: state.hero,
                about: state.about,
                servicesHeader: state.servicesHeader,
                productsHeader: state.productsHeader,
                ceo: state.ceo,
                contactHeader: state.contactHeader,
                corporate: state.corporate,
                services: state.services,
                products: state.products
            })
        });
        if (!response.ok) {
            console.error("Server returned error saving state:", response.statusText);
        }
    } catch (e) {
        console.error("Failed to save state to server:", e);
    }
}

// ================= DOM ELEMENT REFERENCES =================
const servicesContainer = document.getElementById('services-container');
const productsContainer = document.getElementById('products-container');

// Main editable static elements
const editableConfig = {
    'editable-hero-title': { label: 'Hero Title', path: 'hero.title' },
    'editable-hero-subtitle': { label: 'Hero Subtitle', path: 'hero.subtitle' },
    'editable-about-title': { label: 'About Section Title', path: 'about.title' },
    'editable-about-desc': { label: 'About Section Description', path: 'about.desc' },
    'services-section-title': { label: 'Services Section Title', path: 'servicesHeader.title' },
    'services-section-desc': { label: 'Services Section Description', path: 'servicesHeader.desc' },
    'products-section-title': { label: 'Products Section Title', path: 'productsHeader.title' },
    'products-section-desc': { label: 'Products Section Description', path: 'productsHeader.desc' },
    'editable-ceo-name': { label: 'CEO Name', path: 'ceo.name' },
    'editable-ceo-quote': { label: 'CEO Quote', path: 'ceo.quote' },
    'editable-ceo-bio': { label: 'CEO Biography', path: 'ceo.bio' },
    'editable-ceo-phone': { label: 'CEO Contact Phone', path: 'ceo.phone' },
    'editable-ceo-email': { label: 'CEO Contact Email', path: 'ceo.email' },
    'editable-contact-title': { label: 'Contact Section Title', path: 'contactHeader.title' },
    'editable-contact-desc': { label: 'Contact Section Description', path: 'contactHeader.desc' },
    'editable-corp-address': { label: 'Corporate Address', path: 'corporate.address' },
    'editable-corp-phone': { label: 'Corporate Directory Phone', path: 'corporate.phone' },
    'editable-corp-email': { label: 'Corporate Directory Email', path: 'corporate.email' },
    'editable-corp-hours': { label: 'Corporate Office Hours', path: 'corporate.hours' }
};

// Admin elements
const adminActionBtn = document.getElementById('admin-action-btn');
const adminBtnText = document.getElementById('admin-btn-text');
const adminStatusBanner = document.getElementById('admin-status-banner');
const exitAdminBannerBtn = document.getElementById('exit-admin-banner-btn');

// Modals
const loginModal = document.getElementById('login-modal');
const closeLoginBtn = document.getElementById('close-login-btn');
const cancelLoginBtn = document.getElementById('cancel-login-btn');
const loginForm = document.getElementById('login-form');
const loginErrorMsg = document.getElementById('login-error-msg');

const serviceModal = document.getElementById('service-modal');
const serviceForm = document.getElementById('service-form');
const deleteServiceBtn = document.getElementById('delete-service-btn');

const productModal = document.getElementById('product-modal');
const productForm = document.getElementById('product-form');
const deleteProductBtn = document.getElementById('delete-product-btn');

const ceoModal = document.getElementById('ceo-modal');
const ceoForm = document.getElementById('ceo-form');

const textEditModal = document.getElementById('text-edit-modal');
const textEditForm = document.getElementById('text-edit-form');

// Chatbot Elements
const chatbotTrigger = document.getElementById('chatbot-trigger');
const chatbotWindow = document.getElementById('chatbot-window');
const chatbotMessages = document.getElementById('chatbot-messages');
const chatbotInputForm = document.getElementById('chatbot-input-form');
const chatbotInput = document.getElementById('chatbot-input');
const chatQuickActions = document.getElementById('chat-quick-actions');
const closeChatbotBtn = document.getElementById('close-chatbot-btn');

// ================= RENDER INTERFACE =================
function renderUI() {
    // 1. Hydrate dynamic config elements
    Object.keys(editableConfig).forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        const config = editableConfig[id];
        const val = getValueByPath(state, config.path) || '';
        
        // If it's a telephone or email link, update both text and href attributes
        if (id === 'editable-ceo-phone') {
            el.textContent = val;
            el.href = `tel:${val}`;
        } else if (id === 'editable-ceo-email') {
            el.textContent = val;
            el.href = `mailto:${val}`;
        } else {
            el.textContent = val;
        }

        // Toggle admin highlighting classes
        if (state.isAdmin) {
            el.classList.add('admin-editable-active');
        } else {
            el.classList.remove('admin-editable-active');
        }
    });

    // 2. Render Services Grid
    servicesContainer.innerHTML = '';
    state.services.forEach((service, index) => {
        const card = document.createElement('div');
        card.className = 'item-card glass-panel hover-grow';
        
        card.innerHTML = `
            ${state.isAdmin ? `
                <div class="admin-card-overlay">
                    <button class="admin-badge-btn edit-service-btn" data-index="${index}" title="Edit Service">
                        <i data-lucide="edit-2"></i>
                    </button>
                </div>
            ` : ''}
            <div>
                <div class="item-card-header">
                    <div class="item-icon">
                        <i data-lucide="${service.icon}"></i>
                    </div>
                    <span class="item-badge">Service</span>
                </div>
                <h3 class="item-title">${escapeHTML(service.title)}</h3>
                <p class="item-desc">${escapeHTML(service.desc)}</p>
            </div>
            <div class="item-card-footer">
                <a href="#contact" class="item-link">Inquire Service <i data-lucide="arrow-right"></i></a>
            </div>
        `;
        servicesContainer.appendChild(card);
    });

    // 3. Render Products Grid
    productsContainer.innerHTML = '';
    state.products.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'item-card glass-panel hover-grow';
        
        card.innerHTML = `
            ${state.isAdmin ? `
                <div class="admin-card-overlay">
                    <button class="admin-badge-btn edit-product-btn" data-index="${index}" title="Edit Product">
                        <i data-lucide="edit-2"></i>
                    </button>
                </div>
            ` : ''}
            <div>
                <div class="item-card-header">
                    <div class="item-icon">
                        <i data-lucide="package"></i>
                    </div>
                    <span class="item-badge">${escapeHTML(product.tag)}</span>
                </div>
                <h3 class="item-title">${escapeHTML(product.title)}</h3>
                <p class="item-desc">${escapeHTML(product.desc)}</p>
            </div>
            <div class="item-card-footer">
                <a href="${product.link || '#'}" class="item-link" target="_blank">Access Portal <i data-lucide="arrow-right"></i></a>
            </div>
        `;
        productsContainer.appendChild(card);
    });

    // 4. Toggle Admin controls visibility
    if (state.isAdmin) {
        adminActionBtn.classList.remove('btn-secondary');
        adminActionBtn.classList.add('btn-primary');
        adminBtnText.textContent = "Logout";
        adminStatusBanner.classList.remove('hidden');
        document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
    } else {
        adminActionBtn.classList.add('btn-secondary');
        adminActionBtn.classList.remove('btn-primary');
        adminBtnText.textContent = "Admin Login";
        adminStatusBanner.classList.add('hidden');
        document.querySelectorAll('.admin-only').forEach(el => el.classList.add('hidden'));
    }

    // Refresh Lucide Icons for dynamic content
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // Update Chatbot styles
    updateChatbotForAdmin();
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// ================= ADMIN EDIT EVENTS =================
function setupAdminListeners() {
    // Dynamic text inline click edit wire-up
    Object.keys(editableConfig).forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('click', () => {
                if (!state.isAdmin) return;
                const config = editableConfig[id];
                const currentVal = getValueByPath(state, config.path) || '';
                openTextEditModal(id, config.label, currentVal);
            });
        }
    });

    // Services card actions
    servicesContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.edit-service-btn');
        if (!btn) return;
        const index = parseInt(btn.getAttribute('data-index'));
        openServiceModal(index);
    });

    document.getElementById('add-service-btn').addEventListener('click', () => {
        openServiceModal(-1);
    });

    // Products card actions
    productsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.edit-product-btn');
        if (!btn) return;
        const index = parseInt(btn.getAttribute('data-index'));
        openProductModal(index);
    });

    document.getElementById('add-product-btn').addEventListener('click', () => {
        openProductModal(-1);
    });

    // CEO modal button
    document.getElementById('edit-ceo-btn').addEventListener('click', () => {
        openCeoModal();
    });
}

// ================= ADMIN HEARTBEAT & AUTH STATE =================
let heartbeatInterval = null;

function startHeartbeat() {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    sendHeartbeat();
    heartbeatInterval = setInterval(sendHeartbeat, 10000); // Send heartbeat every 10 seconds
}

function stopHeartbeat() {
    if (heartbeatInterval) {
        clearInterval(heartbeatInterval);
        heartbeatInterval = null;
    }
}

async function sendHeartbeat() {
    try {
        const response = await fetch('/api/heartbeat', { method: 'POST' });
        if (response.status === 401) {
            state.isAdmin = false;
            stopHeartbeat();
            renderUI();
        }
    } catch (e) {
        console.error("Error sending heartbeat:", e);
    }
}

async function checkAuthStatus() {
    try {
        const response = await fetch('/api/status');
        const data = await response.json();
        state.isAdmin = data.is_admin;
        if (state.isAdmin) {
            startHeartbeat();
        } else {
            stopHeartbeat();
        }
    } catch (e) {
        console.error("Error checking auth status:", e);
        state.isAdmin = false;
    }
}

// ================= MODAL CONTROLLERS =================
function openTextEditModal(elementId, labelText, currentValue) {
    document.getElementById('text-element-id').value = elementId;
    document.getElementById('text-edit-modal').querySelector('label').textContent = labelText;
    document.getElementById('text-edit-input').value = currentValue;
    textEditModal.classList.add('active');
}

textEditForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('text-element-id').value;
    const val = document.getElementById('text-edit-input').value;
    
    const config = editableConfig[id];
    if (config) {
        setValueByPath(state, config.path, val);
        await saveStateToBackend();
        renderUI();
    }
    textEditModal.classList.remove('active');
});

// Services Modal Controller
function openServiceModal(index) {
    document.getElementById('service-index').value = index;
    if (index === -1) {
        document.getElementById('service-modal-title').textContent = "Add Service";
        document.getElementById('service-title-input').value = '';
        document.getElementById('service-icon-input').value = 'cpu';
        document.getElementById('service-desc-input').value = '';
        deleteServiceBtn.classList.add('hidden');
    } else {
        const service = state.services[index];
        document.getElementById('service-modal-title').textContent = "Edit Service";
        document.getElementById('service-title-input').value = service.title;
        document.getElementById('service-icon-input').value = service.icon;
        document.getElementById('service-desc-input').value = service.desc;
        deleteServiceBtn.classList.remove('hidden');
    }
    serviceModal.classList.add('active');
}

serviceForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const index = parseInt(document.getElementById('service-index').value);
    const newService = {
        title: document.getElementById('service-title-input').value,
        icon: document.getElementById('service-icon-input').value || 'cpu',
        desc: document.getElementById('service-desc-input').value
    };

    if (index === -1) {
        state.services.push(newService);
    } else {
        state.services[index] = newService;
    }

    await saveStateToBackend();
    serviceModal.classList.remove('active');
    renderUI();
});

deleteServiceBtn.addEventListener('click', async () => {
    const index = parseInt(document.getElementById('service-index').value);
    if (index > -1) {
        state.services.splice(index, 1);
        await saveStateToBackend();
    }
    serviceModal.classList.remove('active');
    renderUI();
});

// Products Modal Controller
function openProductModal(index) {
    document.getElementById('product-index').value = index;
    if (index === -1) {
        document.getElementById('product-modal-title').textContent = "Add Product";
        document.getElementById('product-title-input').value = '';
        document.getElementById('product-tag-input').value = 'SaaS';
        document.getElementById('product-desc-input').value = '';
        document.getElementById('product-link-input').value = '#';
        deleteProductBtn.classList.add('hidden');
    } else {
        const product = state.products[index];
        document.getElementById('product-modal-title').textContent = "Edit Product";
        document.getElementById('product-title-input').value = product.title;
        document.getElementById('product-tag-input').value = product.tag;
        document.getElementById('product-desc-input').value = product.desc;
        document.getElementById('product-link-input').value = product.link || '#';
        deleteProductBtn.classList.remove('hidden');
    }
    productModal.classList.add('active');
}

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const index = parseInt(document.getElementById('product-index').value);
    const newProduct = {
        title: document.getElementById('product-title-input').value,
        tag: document.getElementById('product-tag-input').value,
        desc: document.getElementById('product-desc-input').value,
        link: document.getElementById('product-link-input').value
    };

    if (index === -1) {
        state.products.push(newProduct);
    } else {
        state.products[index] = newProduct;
    }

    await saveStateToBackend();
    productModal.classList.remove('active');
    renderUI();
});

deleteProductBtn.addEventListener('click', async () => {
    const index = parseInt(document.getElementById('product-index').value);
    if (index > -1) {
        state.products.splice(index, 1);
        await saveStateToBackend();
    }
    productModal.classList.remove('active');
    renderUI();
});

// CEO Modal Controller
function openCeoModal() {
    document.getElementById('ceo-name-input').value = state.ceo.name;
    document.getElementById('ceo-quote-input').value = state.ceo.quote;
    document.getElementById('ceo-bio-input').value = state.ceo.bio;
    document.getElementById('ceo-phone-input').value = state.ceo.phone;
    document.getElementById('ceo-email-input').value = state.ceo.email;
    ceoModal.classList.add('active');
}

ceoForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    state.ceo.name = document.getElementById('ceo-name-input').value;
    state.ceo.quote = document.getElementById('ceo-quote-input').value;
    state.ceo.bio = document.getElementById('ceo-bio-input').value;
    state.ceo.phone = document.getElementById('ceo-phone-input').value;
    state.ceo.email = document.getElementById('ceo-email-input').value;

    await saveStateToBackend();
    ceoModal.classList.remove('active');
    renderUI();
});

// Modal close button event listeners
document.querySelectorAll('.modal-close, .modal-actions .btn-outline').forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal) modal.classList.remove('active');
    });
});

// ================= LOGIN CONTROLLER =================
adminActionBtn.addEventListener('click', async () => {
    if (state.isAdmin) {
        // Logout
        try {
            await fetch('/api/logout', { method: 'POST' });
            state.isAdmin = false;
            stopHeartbeat();
            renderUI();
        } catch (e) {
            console.error("Logout failed:", e);
        }
    } else {
        // Open Login Modal
        loginErrorMsg.classList.add('hidden');
        loginModal.classList.add('active');
        document.getElementById('admin-username').value = '';
        document.getElementById('admin-password').value = '';
    }
});

// Open login modal from footer link
document.getElementById('footer-admin-login').addEventListener('click', (e) => {
    e.preventDefault();
    if (!state.isAdmin) {
        loginErrorMsg.classList.add('hidden');
        loginModal.classList.add('active');
    }
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('admin-username').value;
    const password = document.getElementById('admin-password').value;

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        if (response.ok) {
            state.isAdmin = true;
            loginModal.classList.remove('active');
            startHeartbeat();
            renderUI();
        } else {
            loginErrorMsg.classList.remove('hidden');
        }
    } catch (e) {
        console.error("Login request failed:", e);
        loginErrorMsg.classList.remove('hidden');
    }
});

exitAdminBannerBtn.addEventListener('click', async () => {
    try {
        await fetch('/api/logout', { method: 'POST' });
        state.isAdmin = false;
        stopHeartbeat();
        renderUI();
    } catch (e) {
        console.error("Logout request failed:", e);
    }
});

// ================= FLOATING CHATBOT CONTROLLER =================
let chatHistory = [];
const botGreeting = `Hello! I am your RMS virtual assistant. How can I help you today?
Here are some topics you can ask me about:
- **CEO/Founder**: Details about our founder.
- **Services**: What custom software solutions we build.
- **Products**: What SaaS frameworks we provide.
- **Contact**: How to reach Raja Meenakshi Sundaram G.`;

let currentChatModeIsAdmin = null;

// Chatbot command editing dictionaries
const chatbotFieldMapping = {
    'hero title': { label: 'Hero Title', path: 'hero.title' },
    'hero subtitle': { label: 'Hero Subtitle', path: 'hero.subtitle' },
    'about title': { label: 'About Title', path: 'about.title' },
    'about description': { label: 'About Description', path: 'about.desc' },
    'about desc': { label: 'About Description', path: 'about.desc' },
    'services title': { label: 'Services Title', path: 'servicesHeader.title' },
    'services description': { label: 'Services Description', path: 'servicesHeader.desc' },
    'services desc': { label: 'Services Description', path: 'servicesHeader.desc' },
    'products title': { label: 'Products Title', path: 'productsHeader.title' },
    'products description': { label: 'Products Description', path: 'productsHeader.desc' },
    'products desc': { label: 'Products Description', path: 'productsHeader.desc' },
    'ceo name': { label: 'CEO Name', path: 'ceo.name' },
    'ceo quote': { label: 'CEO Quote', path: 'ceo.quote' },
    'ceo bio': { label: 'CEO Biography', path: 'ceo.bio' },
    'ceo phone': { label: 'CEO Phone', path: 'ceo.phone' },
    'ceo email': { label: 'CEO Email', path: 'ceo.email' },
    'contact title': { label: 'Contact Title', path: 'contactHeader.title' },
    'contact description': { label: 'Contact Description', path: 'contactHeader.desc' },
    'contact desc': { label: 'Contact Description', path: 'contactHeader.desc' },
    'corporate address': { label: 'Corporate Address', path: 'corporate.address' },
    'address': { label: 'Corporate Address', path: 'corporate.address' },
    'corporate phone': { label: 'Corporate Phone', path: 'corporate.phone' },
    'phone': { label: 'Corporate Phone', path: 'corporate.phone' },
    'corporate email': { label: 'Corporate Email', path: 'corporate.email' },
    'email': { label: 'Corporate Email', path: 'corporate.email' },
    'corporate hours': { label: 'Corporate Hours', path: 'corporate.hours' },
    'hours': { label: 'Corporate Hours', path: 'corporate.hours' }
};

function updateChatbotForAdmin() {
    const chatTitle = chatbotWindow.querySelector('h4');
    const chatStatus = chatbotWindow.querySelector('.chat-status');
    const quickActionsContainer = document.getElementById('chat-quick-actions');
    
    if (state.isAdmin) {
        if (currentChatModeIsAdmin !== true) {
            currentChatModeIsAdmin = true;
            chatbotMessages.innerHTML = ''; // Clear chat history for clean admin state
            const adminWelcome = `🛠️ **RMS Admin Assistant Active**\nWelcome, Raja Meenakshi Sundaram G. You are authenticated as Administrator.\n\nYou can add services/products and update site content directly by talking to me.\n\nTry the quick action buttons below or type **help**!`;
            appendChatMessage('bot', adminWelcome, true);
        }
        
        chatTitle.innerHTML = `<span class="logo-accent">RMS</span> Admin Assistant`;
        chatStatus.innerHTML = `<span class="status-dot" style="background: #d946ef; box-shadow: 0 0 8px #d946ef;"></span> Admin Connected`;
        chatbotWindow.classList.add('admin-chat-theme');
        chatbotTrigger.classList.add('admin-chat-theme');
        
        quickActionsContainer.innerHTML = `
            <button class="quick-action-btn admin-btn" data-query="Add Service Help">Add Service (Chat)</button>
            <button class="quick-action-btn admin-btn" data-query="Add Product Help">Add Product (Chat)</button>
            <button class="quick-action-btn admin-btn" data-query="Change Content Help">Edit Content (Chat)</button>
            <button class="quick-action-btn admin-btn" data-query="Reset Defaults">Reset Database</button>
        `;
    } else {
        if (currentChatModeIsAdmin !== false && currentChatModeIsAdmin !== null) {
            currentChatModeIsAdmin = false;
            chatbotMessages.innerHTML = '';
            appendChatMessage('bot', botGreeting, true);
        } else if (currentChatModeIsAdmin === null) {
            currentChatModeIsAdmin = false;
        }
        
        chatTitle.textContent = "RMS Chatbot";
        chatStatus.innerHTML = `<span class="status-dot"></span> Online Assistant`;
        chatbotWindow.classList.remove('admin-chat-theme');
        chatbotTrigger.classList.remove('admin-chat-theme');
        
        quickActionsContainer.innerHTML = `
            <button class="quick-action-btn" data-query="Who is the CEO?">CEO Info</button>
            <button class="quick-action-btn" data-query="What are your services?">Services</button>
            <button class="quick-action-btn" data-query="What are your products?">Products</button>
            <button class="quick-action-btn" data-query="How to contact?">Contact Details</button>
        `;
    }
}

function appendChatMessage(sender, text, isMarkdown = false) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;
    
    if (isMarkdown) {
        let processedText = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\`([\s\S]*?)\`/g, '<code>$1</code>')
            .replace(/\n/g, '<br>');
        msgDiv.innerHTML = processedText;
    } else {
        msgDiv.textContent = text;
    }
    
    chatbotMessages.appendChild(msgDiv);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

function showTypingIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'message bot typing-indicator-bubble';
    indicator.innerHTML = `
        <div class="typing-dots">
            <span></span>
            <span></span>
            <span></span>
        </div>
    `;
    chatbotMessages.appendChild(indicator);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    return indicator;
}

chatbotTrigger.addEventListener('click', () => {
    const isHidden = chatbotWindow.classList.toggle('hidden');
    document.querySelector('.chat-icon-open').classList.toggle('hidden', !isHidden);
    document.querySelector('.chat-icon-close').classList.toggle('hidden', isHidden);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
});

closeChatbotBtn.addEventListener('click', () => {
    chatbotWindow.classList.add('hidden');
    document.querySelector('.chat-icon-open').classList.remove('hidden');
    document.querySelector('.chat-icon-close').classList.add('hidden');
});

// Chatbot NLP Logic
function handleBotResponse(userMsg) {
    const query = userMsg.toLowerCase().trim();
    const typingIndicator = showTypingIndicator();
    
    setTimeout(async () => {
        typingIndicator.remove();
        
        let response = "";
        
        // If Admin is logged in, check for Admin commands first
        if (state.isAdmin) {
            if (query === 'add service help' || query === 'help') {
                response = `🛠| **Admin Service Assistant**:\nTo add a service, please type:\n\`add service [Title] | [Icon] | [Description]\`\n\n*Example*:\n\`add service Cloud Hosting | cloud | Premium server maintenance.\`\n\n*(Icons: cpu, code, cloud, shield, layers, database, glob, lock, user)*`;
                appendChatMessage('bot', response, true);
                return;
            }
            else if (query === 'add product help') {
                response = `🛠| **Admin Product Assistant**:\nTo add a product, please type:\n\`add product [Name] | [Tag] | [Description] | [Link URL]\`\n\n*Example*:\n\`add product RMS Analyzer | Analytics | Performance metrics dashboard. | #\``;
                appendChatMessage('bot', response, true);
                return;
            }
            else if (query === 'change content help' || query === 'change hero help') {
                response = `🛠| **Admin Content Editor**:\nTo edit headings or details from chat, type:\n\`change [field] [value]\` or \`change [field] to [value]\`\n\n*Fields you can change*:\n- \`hero title\`, \`hero subtitle\`\n- \`about title\`, \`about description\`\n- \`services title\`, \`services description\`\n- \`products title\`, \`products description\`\n- \`ceo name\`, \`ceo quote\`, \`ceo bio\`, \`ceo phone\`, \`ceo email\`\n- \`contact title\`, \`contact description\`\n- \`address\`, \`phone\`, \`email\`, \`hours\``;
                appendChatMessage('bot', response, true);
                return;
            }
            else if (query.startsWith('add service ')) {
                const params = userMsg.slice(12).trim();
                const parts = params.split('|').map(p => p.trim());
                if (parts.length < 3) {
                    response = `❌ **Invalid Format**.\nUse: \`add service [Title] | [Icon] | [Description]\``;
                } else {
                    const [title, icon, desc] = parts;
                    state.services.push({ title, icon: icon.toLowerCase(), desc });
                    await saveStateToBackend();
                    renderUI();
                    response = `✅ **Service Added Live!**\n- **Title**: ${title}\n- **Icon**: ${icon}\n- **Description**: ${desc}`;
                }
                appendChatMessage('bot', response, true);
                return;
            }
            else if (query.startsWith('add product ')) {
                const params = userMsg.slice(12).trim();
                const parts = params.split('|').map(p => p.trim());
                if (parts.length < 3) {
                    response = `❌ **Invalid Format**.\nUse: \`add product [Name] | [Tag] | [Description] | [Link]\``;
                } else {
                    const [title, tag, desc, link] = parts;
                    state.products.push({ title, tag, desc, link: link || '#' });
                    await saveStateToBackend();
                    renderUI();
                    response = `✅ **Product Added Live!**\n- **Name**: ${title}\n- **Tag**: ${tag}\n- **Description**: ${desc}`;
                }
                appendChatMessage('bot', response, true);
                return;
            }
            // General conversational changer
            else if (query.startsWith('change ')) {
                const cmdBody = userMsg.slice(7).trim(); // Keep original casing for user values
                let matched = false;
                
                // Sort command keys by length descending to match longest phrase (e.g. 'hero title' before 'hero')
                const commandKeys = Object.keys(chatbotFieldMapping).sort((a,b) => b.length - a.length);
                
                for (const key of commandKeys) {
                    if (cmdBody.toLowerCase().startsWith(key)) {
                        let val = cmdBody.slice(key.length).trim();
                        // Strip leading "to " if present
                        if (val.toLowerCase().startsWith('to ')) {
                            val = val.slice(3).trim();
                        }
                        
                        const config = chatbotFieldMapping[key];
                        setValueByPath(state, config.path, val);
                        await saveStateToBackend();
                        renderUI();
                        
                        response = `✅ **${config.label} Updated Live!**\nNew value: *"${val}"*`;
                        matched = true;
                        break;
                    }
                }
                
                if (matched) {
                    appendChatMessage('bot', response, true);
                    return;
                }
            }
            else if (query === 'reset database' || query === 'reset defaults') {
                const defaultStateData = {
                    hero: DEFAULT_HERO_INFO,
                    about: DEFAULT_ABOUT_INFO,
                    servicesHeader: DEFAULT_SERVICES_HEADER,
                    productsHeader: DEFAULT_PRODUCTS_HEADER,
                    ceo: DEFAULT_CEO_INFO,
                    contactHeader: DEFAULT_CONTACT_HEADER,
                    corporate: DEFAULT_CORPORATE_INFO,
                    services: DEFAULT_SERVICES,
                    products: DEFAULT_PRODUCTS
                };
                state = { ...state, ...defaultStateData };
                await saveStateToBackend();
                renderUI();
                response = `🔄 **Database Reset to Defaults!**\nOriginal company values restored.`;
                appendChatMessage('bot', response, true);
                return;
            }
        }
        
        // Standard User / Non-Admin Fallback Matches
        if (query.includes('ceo') || query.includes('founder') || query.includes('raja') || query.includes('owner') || query.includes('meenakshi')) {
            response = `Our founder and CEO is **${state.ceo.name}**.\n\nQuote from the CEO:\n"${state.ceo.quote}"\n\nBio:\n${state.ceo.bio}`;
        } 
        else if (query.includes('contact') || query.includes('phone') || query.includes('number') || query.includes('email') || query.includes('mail') || query.includes('call') || query.includes('location') || query.includes('address') || query.includes('where')) {
            response = `You can directly reach our Founder & CEO, ${state.ceo.name}, using the details below:\n\n- **Corporate Address**: ${state.corporate.address}\n- **Corporate Phone**: ${state.corporate.phone}\n- **Corporate Email**: ${state.corporate.email}\n- **Office Hours**: ${state.corporate.hours}`;
        } 
        else if (query.includes('service')) {
            let servicesList = state.services.map((s, idx) => `${idx + 1}. **${s.title}**: ${s.desc}`).join('\n\n');
            response = `We offer premium service engineering:\n\n${servicesList}\n\nFeel free to write to us in the contact section if you want a custom consultation!`;
        } 
        else if (query.includes('product') || query.includes('saas') || query.includes('software')) {
            let productsList = state.products.map((p, idx) => `- **${p.title}** (${p.tag}): ${p.desc}`).join('\n');
            response = `Here are our enterprise-ready software products:\n\n${productsList}\n\nOur products focus on operational scaling and compliance auditing.`;
        } 
        else if (query.includes('admin') || query.includes('login') || query.includes('edit')) {
            response = `To enter Admin Mode:\n1. Click **Admin Login** in the header or **Admin Console** in the footer.\n2. Use credentials:\n   - **Username**: \`admin\`\n   - **Password**: \`admin123\`\n3. Once logged in, you can click on text blocks or talk to the chatbot to make live updates instantly!`;
        } 
        else if (query.includes('how many') || query.includes('count') || query.includes('how much') || query.includes('active project') || query.includes('number of') || query.includes('how many project')) {
            response = `We are currently managing **${state.services.length} active services** and **${state.products.length} active products**, representing a total of **${state.services.length + state.products.length} active projects** under the leadership of CEO Raja Meenakshi Sundaram G.`;
        }
        else if (query.includes('hello') || query.includes('hi') || query.includes('hey')) {
            response = `Hello there! I'm here to answer questions about RMS MultiTech's services, products, contact details, or CEO Raja Meenakshi Sundaram G. What would you like to know?`;
        } 
        else {
            response = `I'm sorry, I didn't quite catch that. You can ask me about:\n- Services (our development solutions)\n- Products (our software systems)\n- CEO (Raja Meenakshi Sundaram G)\n- Contact (how to get in touch)`;
        }
        
        appendChatMessage('bot', response, true);
    }, 600);
}

chatbotInputForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatbotInput.value.trim();
    if (!text) return;
    
    appendChatMessage('user', text, false);
    chatbotInput.value = '';
    
    handleBotResponse(text);
});

chatQuickActions.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-action-btn');
    if (!btn) return;
    const query = btn.getAttribute('data-query');
    
    appendChatMessage('user', query, false);
    handleBotResponse(query);
});

// ================= NAVIGATION EFFECTS =================
const menuToggle = document.getElementById('menu-toggle');
const mobileNav = document.getElementById('mobile-nav');

menuToggle.addEventListener('click', () => {
    mobileNav.classList.toggle('active');
});

document.querySelectorAll('.mobile-nav-item').forEach(item => {
    item.addEventListener('click', () => {
        mobileNav.classList.remove('active');
    });
});

// ================= CONTACT FORM REDIRECTS =================
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    const submitWhatsappBtn = document.getElementById('submit-whatsapp-btn');
    const submitEmailBtn = document.getElementById('submit-email-btn');

    if (submitWhatsappBtn) {
        submitWhatsappBtn.addEventListener('click', () => {
            if (contactForm.reportValidity()) {
                const name = document.getElementById('form-name').value;
                const email = document.getElementById('form-email').value;
                const subject = document.getElementById('form-subject').value;
                const message = document.getElementById('form-message').value;

                const text = `Hello ${state.ceo.name},\n\nI have submitted a contact query through RMS MultiTech:\n\n*Name*: ${name}\n*Email*: ${email}\n*Subject*: ${subject}\n*Message*:\n${message}`;
                
                // Format phone number 9043389303 to international format 919043389303
                let targetPhone = state.ceo.phone;
                if (targetPhone.length === 10 && /^\d+$/.test(targetPhone)) {
                    targetPhone = "91" + targetPhone;
                }
                const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(text)}`;
                
                window.open(whatsappUrl, '_blank');
                contactForm.reset();
            }
        });
    }

    if (submitEmailBtn) {
        submitEmailBtn.addEventListener('click', () => {
            if (contactForm.reportValidity()) {
                const name = document.getElementById('form-name').value;
                const email = document.getElementById('form-email').value;
                const subject = document.getElementById('form-subject').value;
                const message = document.getElementById('form-message').value;

                const body = `Hello ${state.ceo.name},\n\nHere are the query details submitted:\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`;
                
                const emailUrl = `mailto:${state.ceo.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
                
                window.open(emailUrl, '_blank');
                contactForm.reset();
            }
        });
    }
}

// ================= INITIALIZATION =================
window.addEventListener('DOMContentLoaded', async () => {
    // 1. Initial State Load
    await initLocalState();
    
    // 2. Check Auth Status from Session
    await checkAuthStatus();
    
    // 3. Hydrate UI
    renderUI();
    
    // 4. Bind events
    setupAdminListeners();
    setupContactForm();
    
    // 5. Initial Greeting
    appendChatMessage('bot', botGreeting, true);
});
