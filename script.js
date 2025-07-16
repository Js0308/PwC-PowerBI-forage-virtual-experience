// Data Management
class DonationManager {
    constructor() {
        this.donors = JSON.parse(localStorage.getItem('donors')) || [];
        this.donations = JSON.parse(localStorage.getItem('donations')) || [];
        this.receipts = JSON.parse(localStorage.getItem('receipts')) || [];
        this.init();
    }

    init() {
        this.loadDonors();
        this.loadDonations();
        this.loadDonorCards();
        this.updateDonorCount();
        this.setupEventListeners();
        this.refreshDashboard();
        this.setCurrentDate();
    }

    setCurrentDate() {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('donationDate').value = today;
    }

    setupEventListeners() {
        // Form submissions
        document.getElementById('masterDataForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveMasterData();
        });

        document.getElementById('donorForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDonor();
        });

        document.getElementById('donationForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDonation();
        });

        // Modal close on background click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    // Master Data Management
    saveMasterData() {
        const photoFile = document.getElementById('donorPhoto').files[0];
        let photoData = null;

        if (photoFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoData = e.target.result;
                this.createDonorFromMasterData(photoData);
            };
            reader.readAsDataURL(photoFile);
        } else {
            this.createDonorFromMasterData(photoData);
        }
    }

    createDonorFromMasterData(photoData) {
        const donor = {
            id: Date.now(),
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            name: document.getElementById('firstName').value + ' ' + document.getElementById('lastName').value,
            email: document.getElementById('masterEmail').value,
            phone: document.getElementById('masterPhone').value || '',
            mobile: document.getElementById('mobileNo').value || '',
            address: document.getElementById('masterAddress').value || '',
            taxId: document.getElementById('masterTaxId').value || '',
            photo: photoData,
            totalDonations: 0,
            createdAt: new Date().toISOString()
        };

        this.donors.push(donor);
        this.saveToStorage();
        this.loadDonors();
        this.loadDonorCards();
        this.populateDonorDropdowns();
        this.updateDonorCount();
        this.clearForm('masterDataForm');
        this.clearPhotoPreview();
        this.showNotification('Donor added successfully!', 'success');
    }

    // Donor Management
    saveDonor() {
        const photoFile = document.getElementById('donorPhotoModal').files[0];
        let photoData = null;

        if (photoFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                photoData = e.target.result;
                this.createDonorFromModal(photoData);
            };
            reader.readAsDataURL(photoFile);
        } else {
            this.createDonorFromModal(photoData);
        }
    }

    createDonorFromModal(photoData) {
        const donor = {
            id: Date.now(),
            firstName: document.getElementById('donorFirstName').value,
            lastName: document.getElementById('donorLastName').value,
            name: document.getElementById('donorFirstName').value + ' ' + document.getElementById('donorLastName').value,
            email: document.getElementById('donorEmail').value,
            phone: document.getElementById('donorPhone').value || '',
            mobile: document.getElementById('donorMobile').value || '',
            address: document.getElementById('donorAddress').value || '',
            taxId: document.getElementById('donorTaxId').value || '',
            photo: photoData,
            totalDonations: 0,
            createdAt: new Date().toISOString()
        };

        this.donors.push(donor);
        this.saveToStorage();
        this.loadDonors();
        this.loadDonorCards();
        this.populateDonorDropdowns();
        this.updateDonorCount();
        this.closeModal('donorModal');
        this.clearForm('donorForm');
        this.showNotification('Donor added successfully!', 'success');
    }

    loadDonors() {
        const tbody = document.getElementById('donorsTableBody');
        tbody.innerHTML = '';

        this.donors.forEach(donor => {
            const row = document.createElement('tr');
            const photoCell = donor.photo ? 
                `<img src="${donor.photo}" alt="${donor.name}" class="table-photo">` : 
                `<div class="table-photo-placeholder"><i class="fas fa-user"></i></div>`;
            
            row.innerHTML = `
                <td>${donor.id}</td>
                <td>${photoCell}</td>
                <td>${donor.firstName || ''}</td>
                <td>${donor.lastName || ''}</td>
                <td>${donor.email}</td>
                <td>${donor.phone}</td>
                <td>${donor.mobile || ''}</td>
                <td>${donor.address}</td>
                <td>$${donor.totalDonations.toFixed(2)}</td>
                <td>
                    <button class="btn btn-secondary" onclick="donationManager.editDonor(${donor.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="donationManager.deleteDonor(${donor.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });

        this.populateDonorDropdowns();
    }

    loadDonorCards() {
        const container = document.getElementById('donorCards');
        container.innerHTML = '';

        // Show only the 6 most recent donors
        const recentDonors = this.donors.slice(-6).reverse();

        recentDonors.forEach(donor => {
            const card = document.createElement('div');
            card.className = 'donor-card';
            
            const photoElement = donor.photo ? 
                `<img src="${donor.photo}" alt="${donor.name}" class="donor-card-photo">` : 
                `<div class="donor-card-photo-placeholder"><i class="fas fa-user"></i></div>`;
            
            card.innerHTML = `
                <div class="donor-card-header">
                    ${photoElement}
                    <div class="donor-card-info">
                        <h4>${donor.firstName || ''} ${donor.lastName || ''}</h4>
                        <p><i class="fas fa-envelope"></i> ${donor.email}</p>
                        <p><i class="fas fa-phone"></i> ${donor.phone}</p>
                    </div>
                </div>
                <div class="donor-card-details">
                    ${donor.mobile ? `<p><i class="fas fa-mobile-alt"></i> ${donor.mobile}</p>` : ''}
                    ${donor.address ? `<p><i class="fas fa-map-marker-alt"></i> ${donor.address}</p>` : ''}
                    <p><i class="fas fa-donate"></i> Total Donations: $${donor.totalDonations.toFixed(2)}</p>
                </div>
                <div class="donor-card-actions">
                    <button class="btn btn-secondary" onclick="donationManager.editDonor(${donor.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="donationManager.deleteDonor(${donor.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            `;
            
            container.appendChild(card);
        });
    }

    updateDonorCount() {
        document.getElementById('donorCount').textContent = this.donors.length;
    }

    populateDonorDropdowns() {
        const selects = ['donationDonor', 'donorFilter', 'receiptDonor'];
        selects.forEach(selectId => {
            const select = document.getElementById(selectId);
            const currentValue = select.value;
            select.innerHTML = '<option value="">Select Donor</option>';
            
            this.donors.forEach(donor => {
                const option = document.createElement('option');
                option.value = donor.id;
                option.textContent = donor.name;
                select.appendChild(option);
            });

            if (currentValue) {
                select.value = currentValue;
            }
        });
    }

    editDonor(id) {
        const donor = this.donors.find(d => d.id === id);
        if (donor) {
            document.getElementById('donorFirstName').value = donor.firstName || '';
            document.getElementById('donorLastName').value = donor.lastName || '';
            document.getElementById('donorEmail').value = donor.email;
            document.getElementById('donorPhone').value = donor.phone;
            document.getElementById('donorMobile').value = donor.mobile || '';
            document.getElementById('donorAddress').value = donor.address;
            document.getElementById('donorTaxId').value = donor.taxId;
            
            // Handle photo preview
            const photoPreview = document.getElementById('photoPreviewModal');
            if (donor.photo) {
                photoPreview.innerHTML = `<img src="${donor.photo}" alt="Preview">`;
            } else {
                photoPreview.innerHTML = `
                    <div class="photo-placeholder">
                        <i class="fas fa-camera"></i>
                        <p>Click to upload photo</p>
                    </div>
                `;
            }
            
            this.showModal('donorModal');
        }
    }

    deleteDonor(id) {
        if (confirm('Are you sure you want to delete this donor?')) {
            this.donors = this.donors.filter(d => d.id !== id);
            this.saveToStorage();
            this.loadDonors();
            this.loadDonorCards();
            this.updateDonorCount();
            this.showNotification('Donor deleted successfully!', 'success');
        }
    }

    // Donation Management
    saveDonation() {
        const donation = {
            id: Date.now(),
            receiptNo: 'RCP-' + Date.now(),
            donorId: parseInt(document.getElementById('donationDonor').value),
            amount: parseFloat(document.getElementById('donationAmount').value),
            date: document.getElementById('donationDate').value,
            purpose: document.getElementById('donationPurpose').value,
            notes: document.getElementById('donationNotes').value || '',
            createdAt: new Date().toISOString()
        };

        this.donations.push(donation);
        this.updateDonorTotal(donation.donorId, donation.amount);
        this.saveToStorage();
        this.loadDonations();
        this.closeModal('donationModal');
        this.clearForm('donationForm');
        this.refreshDashboard();
        this.showNotification('Donation added successfully!', 'success');
    }

    updateDonorTotal(donorId, amount) {
        const donor = this.donors.find(d => d.id === donorId);
        if (donor) {
            donor.totalDonations += amount;
        }
    }

    loadDonations() {
        const tbody = document.getElementById('donationsTableBody');
        tbody.innerHTML = '';

        this.donations.forEach(donation => {
            const donor = this.donors.find(d => d.id === donation.donorId);
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${donation.receiptNo}</td>
                <td>${new Date(donation.date).toLocaleDateString()}</td>
                <td>${donor ? donor.name : 'Unknown'}</td>
                <td>$${donation.amount.toFixed(2)}</td>
                <td>${donation.purpose}</td>
                <td>
                    <button class="btn btn-secondary" onclick="donationManager.viewDonation(${donation.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-danger" onclick="donationManager.deleteDonation(${donation.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    viewDonation(id) {
        const donation = this.donations.find(d => d.id === id);
        if (donation) {
            const donor = this.donors.find(d => d.id === donation.donorId);
            alert(`Receipt: ${donation.receiptNo}\nDonor: ${donor.name}\nAmount: $${donation.amount}\nDate: ${donation.date}\nPurpose: ${donation.purpose}\nNotes: ${donation.notes}`);
        }
    }

    deleteDonation(id) {
        if (confirm('Are you sure you want to delete this donation?')) {
            const donation = this.donations.find(d => d.id === id);
            if (donation) {
                this.updateDonorTotal(donation.donorId, -donation.amount);
                this.donations = this.donations.filter(d => d.id !== id);
                this.saveToStorage();
                this.loadDonations();
                this.loadDonors();
                this.refreshDashboard();
                this.showNotification('Donation deleted successfully!', 'success');
            }
        }
    }

    // Receipt Generation
    updateReceiptData() {
        const donorId = parseInt(document.getElementById('receiptDonor').value);
        const month = document.getElementById('receiptMonth').value;

        if (!donorId || !month) {
            document.getElementById('receiptDetails').innerHTML = '<p>Please select a donor and month.</p>';
            return;
        }

        const donor = this.donors.find(d => d.id === donorId);
        const monthDonations = this.donations.filter(d => {
            const donationMonth = d.date.substring(0, 7);
            return d.donorId === donorId && donationMonth === month;
        });

        if (monthDonations.length === 0) {
            document.getElementById('receiptDetails').innerHTML = '<p>No donations found for the selected month.</p>';
            return;
        }

        const total = monthDonations.reduce((sum, d) => sum + d.amount, 0);
        const receiptHtml = this.generateReceiptHtml(donor, monthDonations, month, total);
        document.getElementById('receiptDetails').innerHTML = receiptHtml;
    }

    generateReceiptHtml(donor, donations, month, total) {
        const monthName = new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        return `
            <div class="receipt-header">
                <div>
                    <h4>Charitable Organization</h4>
                    <p>123 Main Street<br>City, State 12345<br>Phone: (555) 123-4567</p>
                </div>
                <div>
                    <h4>Receipt #: ${Date.now()}</h4>
                    <p>Date: ${new Date().toLocaleDateString()}</p>
                </div>
            </div>
            
            <div class="receipt-details">
                <h4>Donor Information</h4>
                <p><strong>Name:</strong> ${donor.name}</p>
                <p><strong>Email:</strong> ${donor.email}</p>
                <p><strong>Phone:</strong> ${donor.phone}</p>
                <p><strong>Address:</strong> ${donor.address}</p>
                ${donor.taxId ? `<p><strong>Tax ID:</strong> ${donor.taxId}</p>` : ''}
            </div>
            
            <div class="receipt-details">
                <h4>Donation Summary for ${monthName}</h4>
                <table class="receipt-table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Purpose</th>
                            <th>Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${donations.map(d => `
                            <tr>
                                <td>${new Date(d.date).toLocaleDateString()}</td>
                                <td>${d.purpose}</td>
                                <td>$${d.amount.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div class="receipt-total">
                    Total Donations: $${total.toFixed(2)}
                </div>
            </div>
            
            <div class="receipt-details">
                <p><strong>Tax Information:</strong> This receipt serves as your official record for tax purposes. Our organization is a registered 501(c)(3) non-profit. Tax ID: 12-3456789</p>
                <p><strong>Thank you for your generous support!</strong></p>
            </div>
        `;
    }

    generateReceipt() {
        const content = document.getElementById('receiptDetails').innerHTML;
        if (!content || content.includes('Please select') || content.includes('No donations found')) {
            alert('Please select a donor and month with donations first.');
            return;
        }

        // Print the receipt
        window.print();
    }

    // Dashboard Analytics
    refreshDashboard() {
        this.updateDashboardStats();
        this.createMonthlyChart();
        this.createTopDonorsChart();
    }

    updateDashboardStats() {
        const totalDonations = this.donations.reduce((sum, d) => sum + d.amount, 0);
        const totalDonors = this.donors.length;
        const thisMonth = this.getThisMonthDonations();
        const avgDonation = this.donations.length > 0 ? totalDonations / this.donations.length : 0;

        document.getElementById('totalDonations').textContent = `$${totalDonations.toFixed(2)}`;
        document.getElementById('totalDonors').textContent = totalDonors;
        document.getElementById('thisMonth').textContent = `$${thisMonth.toFixed(2)}`;
        document.getElementById('avgDonation').textContent = `$${avgDonation.toFixed(2)}`;
    }

    getThisMonthDonations() {
        const currentMonth = new Date().toISOString().substring(0, 7);
        return this.donations
            .filter(d => d.date.substring(0, 7) === currentMonth)
            .reduce((sum, d) => sum + d.amount, 0);
    }

    createMonthlyChart() {
        const ctx = document.getElementById('monthlyChart').getContext('2d');
        
        // Get last 6 months data
        const monthlyData = this.getMonthlyData();
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthlyData.labels,
                datasets: [{
                    label: 'Monthly Donations',
                    data: monthlyData.data,
                    borderColor: '#667eea',
                    backgroundColor: 'rgba(102, 126, 234, 0.1)',
                    borderWidth: 2,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Monthly Donations Trend'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toFixed(0);
                            }
                        }
                    }
                }
            }
        });
    }

    getMonthlyData() {
        const months = [];
        const data = [];
        
        // Get last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthKey = date.toISOString().substring(0, 7);
            const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            months.push(monthName);
            
            const monthTotal = this.donations
                .filter(d => d.date.substring(0, 7) === monthKey)
                .reduce((sum, d) => sum + d.amount, 0);
            
            data.push(monthTotal);
        }
        
        return { labels: months, data: data };
    }

    createTopDonorsChart() {
        const ctx = document.getElementById('topDonorsChart').getContext('2d');
        
        const topDonors = this.donors
            .sort((a, b) => b.totalDonations - a.totalDonations)
            .slice(0, 5);
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: topDonors.map(d => d.name),
                datasets: [{
                    data: topDonors.map(d => d.totalDonations),
                    backgroundColor: [
                        '#667eea',
                        '#764ba2',
                        '#f093fb',
                        '#f5576c',
                        '#4facfe'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Top 5 Donors'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Search and Filter Functions
    searchDonors() {
        const searchTerm = document.getElementById('donorSearch').value.toLowerCase();
        const rows = document.querySelectorAll('#donorsTableBody tr');
        
        rows.forEach(row => {
            const text = row.textContent.toLowerCase();
            row.style.display = text.includes(searchTerm) ? '' : 'none';
        });
    }

    filterDonations() {
        const donorFilter = document.getElementById('donorFilter').value;
        const monthFilter = document.getElementById('monthFilter').value;
        const rows = document.querySelectorAll('#donationsTableBody tr');
        
        rows.forEach(row => {
            let show = true;
            
            if (donorFilter) {
                const donor = this.donors.find(d => d.id == donorFilter);
                if (donor && !row.textContent.includes(donor.name)) {
                    show = false;
                }
            }
            
            if (monthFilter && show) {
                const dateCell = row.cells[1].textContent;
                const rowDate = new Date(dateCell);
                const rowMonth = rowDate.toISOString().substring(0, 7);
                if (rowMonth !== monthFilter) {
                    show = false;
                }
            }
            
            row.style.display = show ? '' : 'none';
        });
    }

    // Utility Functions
    saveToStorage() {
        localStorage.setItem('donors', JSON.stringify(this.donors));
        localStorage.setItem('donations', JSON.stringify(this.donations));
        localStorage.setItem('receipts', JSON.stringify(this.receipts));
    }

    showModal(modalId) {
        document.getElementById(modalId).style.display = 'block';
    }

    closeModal(modalId) {
        document.getElementById(modalId).style.display = 'none';
    }

    clearForm(formId) {
        document.getElementById(formId).reset();
    }

    showNotification(message, type) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 2rem;
            background: ${type === 'success' ? '#48bb78' : '#f56565'};
            color: white;
            border-radius: 5px;
            z-index: 10000;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    clearPhotoPreview() {
        document.getElementById('photoPreview').innerHTML = `
            <div class="photo-placeholder">
                <i class="fas fa-camera"></i>
                <p>Click to upload photo</p>
            </div>
        `;
    }

    clearPhotoPreviewModal() {
        document.getElementById('photoPreviewModal').innerHTML = `
            <div class="photo-placeholder">
                <i class="fas fa-camera"></i>
                <p>Click to upload photo</p>
            </div>
        `;
    }
}

// Global Functions
function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionId).classList.add('active');
    
    // Update navigation buttons
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    event.target.classList.add('active');
}

function showModal(modalId) {
    donationManager.showModal(modalId);
}

function closeModal(modalId) {
    donationManager.closeModal(modalId);
}

function searchDonors() {
    donationManager.searchDonors();
}

function filterDonations() {
    donationManager.filterDonations();
}

function updateReceiptData() {
    donationManager.updateReceiptData();
}

function generateReceipt() {
    donationManager.generateReceipt();
}

function refreshDashboard() {
    donationManager.refreshDashboard();
}

function previewPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('photoPreview').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

function previewPhotoModal(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('photoPreviewModal').innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
}

function clearMasterDataForm() {
    document.getElementById('masterDataForm').reset();
    donationManager.clearPhotoPreview();
}

// Initialize the application
let donationManager;
document.addEventListener('DOMContentLoaded', function() {
    donationManager = new DonationManager();
    
    // Add sample data if none exists
    if (donationManager.donors.length === 0) {
        addSampleData();
    }
});

function addSampleData() {
    // Sample donors
    const sampleDonors = [
        {
            id: 1,
            firstName: 'John',
            lastName: 'Smith',
            name: 'John Smith',
            email: 'john@example.com',
            phone: '(555) 123-4567',
            mobile: '(555) 123-4568',
            address: '123 Main St, City, State 12345',
            taxId: '123-45-6789',
            photo: null,
            totalDonations: 1500,
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            firstName: 'Jane',
            lastName: 'Doe',
            name: 'Jane Doe',
            email: 'jane@example.com',
            phone: '(555) 987-6543',
            mobile: '(555) 987-6544',
            address: '456 Oak Ave, City, State 12345',
            taxId: '987-65-4321',
            photo: null,
            totalDonations: 2000,
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            firstName: 'Bob',
            lastName: 'Johnson',
            name: 'Bob Johnson',
            email: 'bob@example.com',
            phone: '(555) 456-7890',
            mobile: '(555) 456-7891',
            address: '789 Pine Rd, City, State 12345',
            taxId: '456-78-9012',
            photo: null,
            totalDonations: 750,
            createdAt: new Date().toISOString()
        }
    ];

    // Sample donations
    const sampleDonations = [
        {
            id: 1,
            receiptNo: 'RCP-001',
            donorId: 1,
            amount: 500,
            date: '2024-01-15',
            purpose: 'General',
            notes: 'Monthly donation',
            createdAt: new Date().toISOString()
        },
        {
            id: 2,
            receiptNo: 'RCP-002',
            donorId: 2,
            amount: 1000,
            date: '2024-01-20',
            purpose: 'Education',
            notes: 'For scholarship fund',
            createdAt: new Date().toISOString()
        },
        {
            id: 3,
            receiptNo: 'RCP-003',
            donorId: 1,
            amount: 250,
            date: '2024-02-15',
            purpose: 'Healthcare',
            notes: 'Medical supplies',
            createdAt: new Date().toISOString()
        },
        {
            id: 4,
            receiptNo: 'RCP-004',
            donorId: 3,
            amount: 750,
            date: '2024-02-10',
            purpose: 'Emergency',
            notes: 'Disaster relief',
            createdAt: new Date().toISOString()
        },
        {
            id: 5,
            receiptNo: 'RCP-005',
            donorId: 2,
            amount: 1000,
            date: '2024-02-28',
            purpose: 'General',
            notes: 'Annual contribution',
            createdAt: new Date().toISOString()
        }
    ];

    donationManager.donors = sampleDonors;
    donationManager.donations = sampleDonations;
    donationManager.saveToStorage();
    donationManager.loadDonors();
    donationManager.loadDonations();
    donationManager.loadDonorCards();
    donationManager.updateDonorCount();
    donationManager.refreshDashboard();
}