// --- DATA STATE MANAGEMENT ---
const INITIAL_STATE = {
    user: null,
    customers: [
        { id: 'CUST-001', name: 'Doji Retailers', email: 'dorji@retail.bt', phone: '+975 17112233', balance: 1250 },
        { id: 'CUST-002', name: 'Karma Traders', email: 'karma@traders.bt', phone: '+975 17556677', balance: 0 }
    ],
    suppliers: [
        { id: 'SUP-001', name: 'Himalayan Wholesalers', email: 'info@himalaya.bt', balance: 3400 }
    ],
    products: [
        { id: 'PROD-001', name: 'Red Rice (25kg)', unit: 'Bag', cost: 1200, price: 1500, stock: 45 },
        { id: 'PROD-002', name: 'Organic Butter (500g)', unit: 'Pkt', cost: 250, price: 320, stock: 120 }
    ],
    transactions: [
        { id: 'INV-1001', date: '2026-09-20', type: 'Sales Invoice', party: 'Doji Retailers', amount: 1500, status: 'Paid' },
        { id: 'PUR-2001', date: '2026-09-22', type: 'Purchase Invoice', party: 'Himalayan Wholesalers', amount: 3400, status: 'Unpaid' }
    ]
};

// Application State
let appState = { ...INITIAL_STATE };

// --- DOM ELEMENTS ---
const loginView = document.getElementById('loginView');
const appView = document.getElementById('appView');
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');

const pageTitle = document.getElementById('pageTitle');
const pageSubtitle = document.getElementById('pageSubtitle');
const contentArea = document.getElementById('content');
const navButtons = document.querySelectorAll('.nav-item');

const headerLogoutBtn = document.getElementById('headerLogoutBtn');
const sidebarLogoutBtn = document.getElementById('sidebarLogoutBtn');

// --- AUTHENTICATION ENGINE ---

function initAuth() {
    const storedSession = localStorage.getItem('phuntshok_session');
    if (storedSession) {
        appState.user = JSON.parse(storedSession);
        renderAppUI();
    } else {
        renderLoginUI();
    }
}

function handleLogin(e) {
    e.preventDefault();
    const email = loginEmail.value.trim();
    const password = loginPassword.value.trim();

    if (email === 'admin@phuntshok.com' && password === 'admin123') {
        const user = { name: 'Admin User', email: email, role: 'Administrator' };
        localStorage.setItem('phuntshok_session', JSON.stringify(user));
        appState.user = user;
        loginError.classList.add('hidden');
        renderAppUI();
    } else {
        loginError.classList.remove('hidden');
    }
}

function handleLogout() {
    localStorage.removeItem('phuntshok_session');
    appState.user = null;
    renderLoginUI();
}

function renderLoginUI() {
    appView.classList.add('hidden');
    loginView.classList.remove('hidden');
}

function renderAppUI() {
    loginView.classList.add('hidden');
    appView.classList.remove('hidden');
    loadPage('dashboard');
}

// --- ROUTING & PAGES ---

function loadPage(pageKey) {
    // Update navigation active states
    navButtons.forEach(btn => {
        if (btn.getAttribute('data-page') === pageKey) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Render corresponding view
    switch (pageKey) {
        case 'dashboard':
            pageTitle.textContent = 'Dashboard';
            pageSubtitle.textContent = 'Overview of your accounting system';
            renderDashboard();
            break;
        case 'customers':
            pageTitle.textContent = 'Customers';
            pageSubtitle.textContent = 'Manage client accounts and balances';
            renderCustomers();
            break;
        case 'products':
            pageTitle.textContent = 'Products & Inventory';
            pageSubtitle.textContent = 'Track item stock levels and prices';
            renderProducts();
            break;
        case 'sales':
            pageTitle.textContent = 'Sales Invoices';
            pageSubtitle.textContent = 'View and issue customer invoices';
            renderTransactions('Sales Invoice');
            break;
        case 'profit-loss':
            pageTitle.textContent = 'Profit & Loss Statement';
            pageSubtitle.textContent = 'Financial performance summary';
            renderProfitLoss();
            break;
        default:
            pageTitle.textContent = pageKey.toUpperCase();
            pageSubtitle.textContent = 'System Module';
            contentArea.innerHTML = `
                <div class="bg-white p-6 rounded-xl border border-slate-200">
                    <p class="text-slate-500">Module <strong>${pageKey}</strong> loaded successfully.</p>
                </div>
            `;
    }
}

// --- VIEW RENDERERS ---

function renderDashboard() {
    contentArea.innerHTML = `
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div class="text-xs font-semibold text-slate-500 uppercase">Total Sales</div>
                <div class="text-2xl font-bold text-slate-900 mt-1">$12,500.00</div>
            </div>
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div class="text-xs font-semibold text-slate-500 uppercase">Total Purchases</div>
                <div class="text-2xl font-bold text-slate-900 mt-1">$4,200.00</div>
            </div>
            <div class="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
                <div class="text-xs font-semibold text-slate-500 uppercase">Net Profit</div>
                <div class="text-2xl font-bold text-emerald-600 mt-1">$8,300.00</div>
            </div>
        </div>

        <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 class="text-base font-bold text-slate-800 mb-4">Recent Transactions</h3>
            <table class="w-full text-left text-sm">
                <thead>
                    <tr class="border-b text-xs text-slate-500 uppercase bg-slate-50">
                        <th class="p-3">Invoice #</th>
                        <th class="p-3">Date</th>
                        <th class="p-3">Type</th>
                        <th class="p-3">Party</th>
                        <th class="p-3">Amount</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${appState.transactions.map(t => `
                        <tr>
                            <td class="p-3 font-medium text-slate-900">${t.id}</td>
                            <td class="p-3 text-slate-500">${t.date}</td>
                            <td class="p-3 text-slate-700">${t.type}</td>
                            <td class="p-3 text-slate-700">${t.party}</td>                             <td class="p-3 font-semibold text-slate-900">$${t.amount.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderCustomers() {
    contentArea.innerHTML = `
        <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div class="flex justify-between items-center mb-4">
                <h3 class="font-bold text-slate-800">Customer Directory</h3>
                <button class="bg-indigo-600 text-white text-xs px-3 py-2 rounded-lg font-medium">+ Add Customer</button>
            </div>
            <table class="w-full text-left text-sm">
                <thead>
                    <tr class="border-b text-xs text-slate-500 uppercase bg-slate-50">
                        <th class="p-3">ID</th>
                        <th class="p-3">Name</th>
                        <th class="p-3">Email</th>
                        <th class="p-3">Phone</th>
                        <th class="p-3">Balance</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${appState.customers.map(c => `
                        <tr>
                            <td class="p-3 font-mono text-xs text-slate-500">${c.id}</td>
                            <td class="p-3 font-semibold text-slate-800">${c.name}</td>
                            <td class="p-3 text-slate-600">${c.email}</td>
                            <td class="p-3 text-slate-600">${c.phone}</td>                             <td class="p-3 font-bold text-slate-900">$${c.balance.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderProducts() {
    contentArea.innerHTML = `
        <div class="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <h3 class="font-bold text-slate-800 mb-4">Inventory Items</h3>
            <table class="w-full text-left text-sm">
                <thead>
                    <tr class="border-b text-xs text-slate-500 uppercase bg-slate-50">
                        <th class="p-3">ID</th>
                        <th class="p-3">Product Name</th>
                        <th class="p-3">Unit</th>
                        <th class="p-3">Cost</th>
                        <th class="p-3">Price</th>
                        <th class="p-3">Stock</th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    ${appState.products.map(p => `
                        <tr>
                            <td class="p-3 font-mono text-xs text-slate-500">${p.id}</td>
                            <td class="p-3 font-semibold text-slate-800">${p.name}</td>
                            <td class="p-3 text-slate-600">${p.unit}</td>
                            <td class="p-3 text-slate-600">$${p.cost.toFixed(2)}</td>                             <td class="p-3 font-semibold text-slate-900">$${p.price.toFixed(2)}</td>
                            <td class="p-3 font-bold text-indigo-600">${p.stock}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function renderProfitLoss() {
    contentArea.innerHTML = `
        <div class="bg-white max-w-2xl mx-auto rounded-xl border border-slate-200 p-8 shadow-sm">
            <h2 class="text-xl font-bold text-slate-900 border-b pb-3 mb-6">Profit & Loss Statement</h2>
            <div class="space-y-4 text-sm">
                <div class="flex justify-between py-2 border-b">
                    <span class="font-semibold text-slate-700">Operating Revenue (Sales)</span>
                    <span class="font-mono text-slate-900">$12,500.00</span>
                </div>
                <div class="flex justify-between py-2 border-b text-red-600">
                    <span>Cost of Goods Sold (Purchases)</span>
                    <span class="font-mono">-$4,200.00</span>
                </div>
                <div class="flex justify-between py-3 border-b-2 border-slate-900 font-bold text-base text-slate-900">
                    <span>Gross Profit</span>
                    <span>$8,300.00</span>
                </div>
            </div>
        </div>
    `;
}

// --- EVENT LISTENERS ---
document.addEventListener('DOMContentLoaded', () => {
    initAuth();

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (headerLogoutBtn) headerLogoutBtn.addEventListener('click', handleLogout);
    if (sidebarLogoutBtn) sidebarLogoutBtn.addEventListener('click', handleLogout);

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const pageKey = btn.getAttribute('data-page');
            loadPage(pageKey);
        });
    });
});