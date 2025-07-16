const express = require('express');
const Donor = require('../models/Donor');
const Receipt = require('../models/Receipt');
const Invoice = require('../models/Invoice');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Get dashboard analytics
router.get('/analytics', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Set default date range to current month if not provided
    const start = startDate ? new Date(startDate) : new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const end = endDate ? new Date(endDate) : new Date();
    
    const dateFilter = {
      createdAt: {
        $gte: start,
        $lte: end
      }
    };

    // Donor count
    const totalDonors = await Donor.countDocuments({ isActive: true });
    const newDonorsThisMonth = await Donor.countDocuments({
      isActive: true,
      ...dateFilter
    });

    // Total donation collection
    const totalDonationCollection = await Receipt.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    const donationCollectionThisMonth = await Receipt.aggregate([
      { $match: { isActive: true, paymentDate: { $gte: start, $lte: end } } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Invoice statistics
    const totalInvoices = await Invoice.countDocuments();
    const pendingInvoices = await Invoice.countDocuments({ status: 'pending' });
    const paidInvoices = await Invoice.countDocuments({ status: 'paid' });
    const overdueInvoices = await Invoice.countDocuments({ 
      status: 'pending',
      dueDate: { $lt: new Date() }
    });

    // Recent donations (last 10)
    const recentDonations = await Receipt.find({ isActive: true })
      .populate('donor', 'firstName lastName mobileNumber')
      .sort({ paymentDate: -1 })
      .limit(10);

    // Top donors (by total donations)
    const topDonors = await Donor.find({ isActive: true })
      .sort({ totalDonations: -1 })
      .limit(5);

    // Donations by area
    const donationsByArea = await Receipt.aggregate([
      { $match: { isActive: true } },
      { $lookup: { from: 'donors', localField: 'donor', foreignField: '_id', as: 'donorInfo' } },
      { $unwind: '$donorInfo' },
      { 
        $group: { 
          _id: '$donorInfo.area', 
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Monthly donation trends (last 12 months)
    const monthlyDonations = await Receipt.aggregate([
      { 
        $match: { 
          isActive: true,
          paymentDate: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$paymentDate' },
            month: { $month: '$paymentDate' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Payment method statistics
    const paymentMethodStats = await Receipt.aggregate([
      { $match: { isActive: true } },
      { 
        $group: { 
          _id: '$paymentMethod', 
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Monthly expenses (for comparison)
    const monthlyExpenses = await Expense.aggregate([
      { 
        $match: { 
          isActive: true,
          expenseDate: {
            $gte: new Date(new Date().setMonth(new Date().getMonth() - 12))
          }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$expenseDate' },
            month: { $month: '$expenseDate' }
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      donors: {
        total: totalDonors,
        newThisMonth: newDonorsThisMonth
      },
      donations: {
        total: totalDonationCollection[0]?.total || 0,
        thisMonth: donationCollectionThisMonth[0]?.total || 0
      },
      invoices: {
        total: totalInvoices,
        pending: pendingInvoices,
        paid: paidInvoices,
        overdue: overdueInvoices
      },
      recentDonations,
      topDonors,
      donationsByArea,
      monthlyDonations,
      paymentMethodStats,
      monthlyExpenses
    });
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    res.status(500).json({ 
      message: 'Error fetching dashboard analytics', 
      error: error.message 
    });
  }
});

// Get quick stats for cards
router.get('/quick-stats', async (req, res) => {
  try {
    // Total donors
    const totalDonors = await Donor.countDocuments({ isActive: true });
    
    // Total donation collection
    const totalDonationCollection = await Receipt.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Total expenses
    const totalExpenses = await Expense.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Pending invoices
    const pendingInvoices = await Invoice.countDocuments({ status: 'pending' });

    // This month's donations
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0);
    
    const thisMonthDonations = await Receipt.aggregate([
      { 
        $match: { 
          isActive: true,
          paymentDate: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // This month's expenses
    const thisMonthExpenses = await Expense.aggregate([
      { 
        $match: { 
          isActive: true,
          expenseDate: { $gte: startOfMonth, $lte: endOfMonth }
        }
      },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    res.json({
      totalDonors,
      totalDonationCollection: totalDonationCollection[0]?.total || 0,
      totalExpenses: totalExpenses[0]?.total || 0,
      pendingInvoices,
      thisMonthDonations: thisMonthDonations[0]?.total || 0,
      thisMonthExpenses: thisMonthExpenses[0]?.total || 0,
      netBalance: (totalDonationCollection[0]?.total || 0) - (totalExpenses[0]?.total || 0)
    });
  } catch (error) {
    console.error('Error fetching quick stats:', error);
    res.status(500).json({ 
      message: 'Error fetching quick stats', 
      error: error.message 
    });
  }
});

module.exports = router;