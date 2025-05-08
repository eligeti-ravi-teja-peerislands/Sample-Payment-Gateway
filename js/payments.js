// Mock data for transactions
let transactions = [
    {
        id: 1,
        date: '2024-03-20',
        type: 'credit',
        amount: 100.00,
        status: 'completed'
    },
    {
        id: 2,
        date: '2024-03-19',
        type: 'debit',
        amount: 50.00,
        status: 'completed'
    }
];

// Payment configuration
const paymentConfig = {
    minAmount: 1,
    maxAmount: 10000,
    allowedTypes: ['credit', 'debit', 'bank']
};

// Initialize balance
let balance = 1000.00;

// Update balance display
const updateBalance = () => {
    const balanceElement = document.getElementById('balance');
    if (balanceElement) {
        balanceElement.textContent = `$${balance.toFixed(2)}`;
    }
};

// Format date
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

// Render transactions
const renderTransactions = (filteredTransactions = transactions) => {
    const transactionTable = document.getElementById('transactionTable');
    if (!transactionTable) return;

    transactionTable.innerHTML = filteredTransactions
        .map(transaction => `
            <tr>
                <td>${formatDate(transaction.date)}</td>
                <td>${transaction.type}</td>
                <td>$${transaction.amount.toFixed(2)}</td>
                <td>
                    <span class="status-${transaction.status.toLowerCase()}">
                        ${transaction.status}
                    </span>
                </td>
            </tr>
        `)
        .join('');
};

// Handle payment form submission
const paymentForm = document.getElementById('paymentForm');
if (paymentForm) {
    paymentForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const amount = parseFloat(document.getElementById('amount').value);
        const type = document.getElementById('paymentType').value;

        // Validate amount
        if (amount < paymentConfig.minAmount || amount > paymentConfig.maxAmount) {
            showAlert(`Amount must be between $${paymentConfig.minAmount} and $${paymentConfig.maxAmount}`);
            return;
        }

        // Validate payment type
        if (!paymentConfig.allowedTypes.includes(type)) {
            showAlert('Invalid payment type');
            return;
        }

        // Process payment
        const newTransaction = {
            id: transactions.length + 1,
            date: new Date().toISOString().split('T')[0],
            type: type,
            amount: amount,
            status: 'completed'
        };

        // Update balance
        balance -= amount;
        
        // Add to transactions
        transactions.unshift(newTransaction);

        // Update UI
        updateBalance();
        renderTransactions();
        
        // Reset form
        paymentForm.reset();
        
        showAlert('Payment processed successfully', 'success');
    });
}

// Handle transaction search
const searchTransaction = document.getElementById('searchTransaction');
if (searchTransaction) {
    searchTransaction.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredTransactions = transactions.filter(transaction => 
            transaction.type.toLowerCase().includes(searchTerm) ||
            transaction.amount.toString().includes(searchTerm) ||
            transaction.status.toLowerCase().includes(searchTerm) ||
            formatDate(transaction.date).toLowerCase().includes(searchTerm)
        );
        renderTransactions(filteredTransactions);
    });
}

// Initialize page
document.addEventListener('DOMContentLoaded', () => {
    updateBalance();
    renderTransactions();
}); 