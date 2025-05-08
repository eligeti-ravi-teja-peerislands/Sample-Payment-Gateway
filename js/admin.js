// Mock data for admin dashboard
let adminTransactions = [
    {
        id: 1,
        date: '2024-03-20',
        user: 'user@paygate.com',
        type: 'credit',
        amount: 100.00,
        status: 'completed'
    },
    {
        id: 2,
        date: '2024-03-19',
        user: 'user@paygate.com',
        type: 'debit',
        amount: 50.00,
        status: 'completed'
    }
];

// System statistics
const systemStats = {
    totalTransactions: 2,
    totalVolume: 150.00,
    activeUsers: 1
};

// Payment configuration
let paymentConfig = {
    minAmount: 1,
    maxAmount: 10000,
    allowedTypes: ['credit', 'debit', 'bank']
};

// Format date
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Update system statistics
const updateSystemStats = () => {
    document.getElementById('totalTransactions').textContent = systemStats.totalTransactions;
    document.getElementById('totalVolume').textContent = `$${systemStats.totalVolume.toFixed(2)}`;
    document.getElementById('activeUsers').textContent = systemStats.activeUsers;
};

// Render transactions
const renderTransactions = (filteredTransactions = adminTransactions) => {
    const transactionTable = document.getElementById('transactionTable');
    if (!transactionTable) return;

    transactionTable.innerHTML = filteredTransactions
        .map(transaction => `
            <tr>
                <td>${formatDate(transaction.date)}</td>
                <td>${transaction.user}</td>
                <td>${transaction.type}</td>
                <td>$${transaction.amount.toFixed(2)}</td>
                <td>
                    <span class="status-${transaction.status.toLowerCase()}">
                        ${transaction.status}
                    </span>
                </td>
                <td>
                    <button class="btn btn-secondary" onclick="viewTransaction(${transaction.id})">
                        View
                    </button>
                </td>
            </tr>
        `)
        .join('');
};

// Load payment configuration
const loadPaymentConfig = () => {
    document.getElementById('minAmount').value = paymentConfig.minAmount;
    document.getElementById('maxAmount').value = paymentConfig.maxAmount;
    
    // Set checkboxes
    document.getElementById('creditCard').checked = paymentConfig.allowedTypes.includes('credit');
    document.getElementById('debitCard').checked = paymentConfig.allowedTypes.includes('debit');
    document.getElementById('bankTransfer').checked = paymentConfig.allowedTypes.includes('bank');
};

// Handle payment configuration form submission
const paymentConfigForm = document.getElementById('paymentConfigForm');
if (paymentConfigForm) {
    paymentConfigForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const minAmount = parseFloat(document.getElementById('minAmount').value);
        const maxAmount = parseFloat(document.getElementById('maxAmount').value);
        
        // Validate amounts
        if (minAmount >= maxAmount) {
            showAlert('Minimum amount must be less than maximum amount');
            return;
        }

        // Get selected payment types
        const allowedTypes = Array.from(document.querySelectorAll('input[name="paymentTypes"]:checked'))
            .map(checkbox => checkbox.value);

        if (allowedTypes.length === 0) {
            showAlert('At least one payment type must be selected');
            return;
        }

        // Update configuration
        paymentConfig = {
            minAmount,
            maxAmount,
            allowedTypes
        };

        showAlert('Payment configuration updated successfully', 'success');
    });
}

// Handle transaction search
const searchTransaction = document.getElementById('searchTransaction');
if (searchTransaction) {
    searchTransaction.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTransactions = adminTransactions.filter(transaction => 
            transaction.user.toLowerCase().includes(searchTerm) ||
            transaction.type.toLowerCase().includes(searchTerm) ||
            transaction.amount.toString().includes(searchTerm) ||
            transaction.status.toLowerCase().includes(searchTerm) ||
            formatDate(transaction.date).toLowerCase().includes(searchTerm)
        );
        renderTransactions(filteredTransactions);
    });
}

// View transaction details
const viewTransaction = (transactionId) => {
    const transaction = adminTransactions.find(t => t.id === transactionId);
    if (transaction) {
        alert(`
            Transaction Details:
            ID: ${transaction.id}
            Date: ${formatDate(transaction.date)}
            User: ${transaction.user}
            Type: ${transaction.type}
            Amount: $${transaction.amount.toFixed(2)}
            Status: ${transaction.status}
        `);
    }
};

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.role !== 'admin') {
        window.location.href = 'login.html';
        return;
    }

    loadPaymentConfig();
    updateSystemStats();
    renderTransactions();
}); 