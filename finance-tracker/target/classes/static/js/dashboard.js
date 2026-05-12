/**
 * dashboard.js — Main dashboard logic.
 * Handles transactions, charts, currency conversion, and navigation.
 */

// ---- Global State ----
const userId = sessionStorage.getItem('userId');
const username = sessionStorage.getItem('username');
let displayCurrency = 'USD';
let categoryChartInstance = null;
let incomeExpenseChartInstance = null;

// Category icons mapping
const catIcons = {
    Food: '🍔', Transport: '🚗', Shopping: '🛍️', Bills: '📄',
    Entertainment: '🎬', Health: '🏥', Salary: '💼', Freelance: '💻',
    Investment: '📈', Other: '📌'
};

// ---- Init ----
window.addEventListener('DOMContentLoaded', () => {
    if (!userId) { window.location.href = 'index.html'; return; }

    document.getElementById('sidebarUser').textContent = username || 'User';
    document.getElementById('userBadge').textContent = (username || 'U')[0].toUpperCase();
    document.getElementById('txnDate').valueAsDate = new Date();

    loadDashboard();
    loadRates();
});

// ---- Navigation ----
function showSection(section) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const titles = { overview: 'Overview', transactions: 'Transactions', converter: 'Currency Converter', predictions: 'AI Predictions' };
    document.getElementById(section + 'Section').classList.add('active');
    document.getElementById('sectionTitle').textContent = titles[section] || 'Dashboard';

    // Mark active nav
    const navItems = document.querySelectorAll('.nav-item');
    const navMap = ['overview', 'transactions', 'converter', 'predictions'];
    navMap.forEach((s, i) => { if (s === section) navItems[i].classList.add('active'); });
}

function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

function changeDisplayCurrency() {
    displayCurrency = document.getElementById('displayCurrency').value;
    loadDashboard();
}

// ---- Load Dashboard Data ----
async function loadDashboard() {
    try {
        const [txnRes, summaryRes] = await Promise.all([
            fetch(`/api/transactions/${userId}?convertTo=${displayCurrency}`),
            fetch(`/api/transactions/${userId}/summary`)
        ]);
        const txnData = await txnRes.json();
        const summaryData = await summaryRes.json();

        if (txnData.success) {
            renderRecentTransactions(txnData.transactions);
            renderAllTransactions(txnData.transactions);
        }
        if (summaryData.success) {
            updateStats(summaryData.totals);
            renderCategoryChart(summaryData.categories);
            renderIncomeExpenseChart(summaryData.totals);
        }
    } catch (err) {
        console.error('Failed to load dashboard:', err);
    }
}

// ---- Stats ----
function updateStats(totals) {
    const sym = getCurrencySymbol(displayCurrency);
    document.getElementById('totalIncome').textContent = sym + formatNum(totals.income || 0);
    document.getElementById('totalExpense').textContent = sym + formatNum(totals.expense || 0);
    document.getElementById('totalBalance').textContent = sym + formatNum(totals.balance || 0);
}

function getCurrencySymbol(code) {
    const symbols = { USD:'$', EUR:'€', GBP:'£', INR:'₹', JPY:'¥', CAD:'C$', AUD:'A$', CNY:'¥', BRL:'R$', KRW:'₩', SGD:'S$' };
    return symbols[code] || code + ' ';
}

function formatNum(n) {
    return Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// ---- Render Transactions ----
function renderRecentTransactions(transactions) {
    const list = document.getElementById('recentList');
    const recent = transactions.slice(-5).reverse();
    if (recent.length === 0) { list.innerHTML = '<p class="empty-msg">No transactions yet</p>'; return; }
    list.innerHTML = recent.map(t => createTxnHTML(t)).join('');
}

function renderAllTransactions(transactions) {
    const list = document.getElementById('allTransactionsList');
    const noMsg = document.getElementById('noTransactions');
    if (transactions.length === 0) { list.innerHTML = ''; noMsg.style.display = 'block'; return; }
    noMsg.style.display = 'none';
    list.innerHTML = [...transactions].reverse().map(t => createTxnHTML(t, true)).join('');
}

function createTxnHTML(t, showDelete = false) {
    const type = t.type || 'expense';
    const cat = t.category || 'Other';
    const icon = catIcons[cat] || '📌';
    const amount = t.convertedAmount !== undefined ? t.convertedAmount : t.amount;
    const sym = getCurrencySymbol(displayCurrency);
    const sign = type === 'income' ? '+' : '-';
    const deleteBtn = showDelete ? `<button class="txn-delete" onclick="deleteTxn('${t.id}')">✕</button>` : '';

    return `<div class="txn-item">
        <div class="txn-left">
            <span class="txn-cat-icon">${icon}</span>
            <div class="txn-info">
                <span class="txn-desc">${t.description || cat}</span>
                <span class="txn-meta">${cat} • ${t.date || ''} • ${t.originalCurrency || t.currency || ''}</span>
            </div>
        </div>
        <div style="display:flex;align-items:center;">
            <span class="txn-amount ${type}">${sign}${sym}${formatNum(amount)}</span>
            ${deleteBtn}
        </div>
    </div>`;
}

// ---- Add Transaction ----
async function addTransaction(event) {
    event.preventDefault();
    const transaction = {
        userId: userId,
        type: document.getElementById('txnType').value,
        amount: parseFloat(document.getElementById('txnAmount').value),
        currency: document.getElementById('txnCurrency').value,
        category: document.getElementById('txnCategory').value,
        description: document.getElementById('txnDescription').value,
        date: document.getElementById('txnDate').value
    };

    try {
        const res = await fetch('/api/transactions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction)
        });
        const data = await res.json();
        if (data.success) {
            document.getElementById('addTransactionForm').reset();
            document.getElementById('txnDate').valueAsDate = new Date();
            loadDashboard();
        }
    } catch (err) {
        console.error('Failed to add transaction:', err);
    }
}

// ---- Delete Transaction ----
async function deleteTxn(txnId) {
    try {
        await fetch(`/api/transactions/${userId}/${txnId}`, { method: 'DELETE' });
        loadDashboard();
    } catch (err) {
        console.error('Failed to delete:', err);
    }
}

// ---- Charts ----
function renderCategoryChart(categories) {
    const canvas = document.getElementById('categoryChart');
    if (categoryChartInstance) categoryChartInstance.destroy();

    const labels = Object.keys(categories);
    const values = Object.values(categories);
    const colors = ['#6366f1','#a855f7','#ec4899','#f43f5e','#f97316','#eab308','#22c55e','#14b8a6','#06b6d4','#3b82f6'];

    if (labels.length === 0) {
        categoryChartInstance = new Chart(canvas, {
            type: 'doughnut',
            data: { labels: ['No Data'], datasets: [{ data: [1], backgroundColor: ['#333355'] }] },
            options: { plugins: { legend: { labels: { color: '#8888aa' } } } }
        });
        return;
    }

    categoryChartInstance = new Chart(canvas, {
        type: 'doughnut',
        data: { labels, datasets: [{ data: values, backgroundColor: colors.slice(0, labels.length), borderWidth: 0 }] },
        options: {
            responsive: true,
            plugins: { legend: { position: 'bottom', labels: { color: '#ccc', padding: 12, font: { size: 11 } } } },
            cutout: '65%'
        }
    });
}

function renderIncomeExpenseChart(totals) {
    const canvas = document.getElementById('incomeExpenseChart');
    if (incomeExpenseChartInstance) incomeExpenseChartInstance.destroy();

    incomeExpenseChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses', 'Balance'],
            datasets: [{
                data: [totals.income || 0, totals.expense || 0, totals.balance || 0],
                backgroundColor: ['rgba(34,197,94,0.7)', 'rgba(239,68,68,0.7)', 'rgba(99,102,241,0.7)'],
                borderRadius: 8, borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: {
                y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#888' } },
                x: { grid: { display: false }, ticks: { color: '#888' } }
            }
        }
    });
}

// ---- Currency Converter ----
async function convertCurrency() {
    const amount = document.getElementById('convertAmount').value;
    const from = document.getElementById('convertFrom').value;
    const to = document.getElementById('convertTo').value;

    try {
        const res = await fetch(`/api/currency/convert?amount=${amount}&from=${from}&to=${to}`);
        const data = await res.json();
        if (data.success) {
            const result = document.getElementById('convertResult');
            result.style.display = 'block';
            result.innerHTML = `${getCurrencySymbol(from)}${formatNum(data.originalAmount)} = <span style="color:#a855f7">${getCurrencySymbol(to)}${formatNum(data.convertedAmount)}</span>`;
        }
    } catch (err) {
        console.error('Conversion error:', err);
    }
}

function swapCurrencies() {
    const from = document.getElementById('convertFrom');
    const to = document.getElementById('convertTo');
    const temp = from.value;
    from.value = to.value;
    to.value = temp;
}

async function loadRates() {
    try {
        const res = await fetch('/api/currency/list');
        const data = await res.json();
        if (data.success) {
            const grid = document.getElementById('ratesGrid');
            grid.innerHTML = Object.entries(data.currencies)
                .sort((a, b) => a[0].localeCompare(b[0]))
                .map(([code, info]) => `<div class="rate-item"><div class="rate-code">${code}</div><div class="rate-value">${info.rate}</div></div>`)
                .join('');
        }
    } catch (err) {
        console.error('Failed to load rates:', err);
    }
}
