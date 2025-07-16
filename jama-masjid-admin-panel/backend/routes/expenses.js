const express = require('express');
const Expense = require('../models/Expense');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Create new expense
router.post('/', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      amount, 
      category, 
      expenseDate,
      paymentMethod,
      vendor,
      billNumber,
      notes 
    } = req.body;

    const expense = new Expense({
      title,
      description,
      amount,
      category,
      expenseDate,
      paymentMethod,
      vendor,
      billNumber,
      notes
    });

    await expense.save();

    res.status(201).json({
      message: 'Expense created successfully',
      expense
    });
  } catch (error) {
    console.error('Error creating expense:', error);
    res.status(500).json({ 
      message: 'Error creating expense', 
      error: error.message 
    });
  }
});

// Get all expenses with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { category, status, startDate, endDate, paymentMethod } = req.query;
    
    let query = { isActive: true };
    
    if (category) {
      query.category = category;
    }
    
    if (status) {
      query.status = status;
    }
    
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }
    
    if (startDate && endDate) {
      query.expenseDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const expenses = await Expense.find(query)
      .sort({ expenseDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Expense.countDocuments(query);

    res.json({
      expenses,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    res.status(500).json({ 
      message: 'Error fetching expenses', 
      error: error.message 
    });
  }
});

// Get expense by ID
router.get('/:id', async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id);
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json(expense);
  } catch (error) {
    console.error('Error fetching expense:', error);
    res.status(500).json({ 
      message: 'Error fetching expense', 
      error: error.message 
    });
  }
});

// Update expense
router.put('/:id', async (req, res) => {
  try {
    const { 
      title, 
      description, 
      amount, 
      category, 
      expenseDate,
      paymentMethod,
      vendor,
      billNumber,
      notes,
      status 
    } = req.body;
    
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        description, 
        amount, 
        category, 
        expenseDate,
        paymentMethod,
        vendor,
        billNumber,
        notes,
        status
      },
      { new: true, runValidators: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({
      message: 'Expense updated successfully',
      expense
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    res.status(500).json({ 
      message: 'Error updating expense', 
      error: error.message 
    });
  }
});

// Delete expense (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    console.error('Error deleting expense:', error);
    res.status(500).json({ 
      message: 'Error deleting expense', 
      error: error.message 
    });
  }
});

// Get expense statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = {};
    if (startDate && endDate) {
      dateFilter = {
        expenseDate: {
          $gte: new Date(startDate),
          $lte: new Date(endDate)
        }
      };
    }

    // Total expenses
    const totalExpenses = await Expense.aggregate([
      { $match: { isActive: true, ...dateFilter } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);

    // Expenses by category
    const expensesByCategory = await Expense.aggregate([
      { $match: { isActive: true, ...dateFilter } },
      { 
        $group: { 
          _id: '$category', 
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Expenses by payment method
    const expensesByPaymentMethod = await Expense.aggregate([
      { $match: { isActive: true, ...dateFilter } },
      { 
        $group: { 
          _id: '$paymentMethod', 
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    // Monthly expenses (last 12 months)
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
      totalExpenses: totalExpenses[0]?.total || 0,
      expensesByCategory,
      expensesByPaymentMethod,
      monthlyExpenses
    });
  } catch (error) {
    console.error('Error fetching expense statistics:', error);
    res.status(500).json({ 
      message: 'Error fetching expense statistics', 
      error: error.message 
    });
  }
});

module.exports = router;