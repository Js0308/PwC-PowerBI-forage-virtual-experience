const express = require('express');
const PDFDocument = require('pdfkit');
const Invoice = require('../models/Invoice');
const Donor = require('../models/Donor');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Create new invoice
router.post('/', async (req, res) => {
  try {
    const { donorId, amount, description, dueDate, notes } = req.body;

    // Validate donor exists
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    const invoice = new Invoice({
      donor: donorId,
      amount,
      description,
      dueDate,
      notes
    });

    await invoice.save();
    await invoice.populate('donor');

    res.status(201).json({
      message: 'Invoice created successfully',
      invoice
    });
  } catch (error) {
    console.error('Error creating invoice:', error);
    res.status(500).json({ 
      message: 'Error creating invoice', 
      error: error.message 
    });
  }
});

// Get all invoices with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { status, donorId } = req.query;
    
    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (donorId) {
      query.donor = donorId;
    }

    const invoices = await Invoice.find(query)
      .populate('donor', 'firstName lastName mobileNumber area')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Invoice.countDocuments(query);

    res.json({
      invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching invoices:', error);
    res.status(500).json({ 
      message: 'Error fetching invoices', 
      error: error.message 
    });
  }
});

// Get invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('donor');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json(invoice);
  } catch (error) {
    console.error('Error fetching invoice:', error);
    res.status(500).json({ 
      message: 'Error fetching invoice', 
      error: error.message 
    });
  }
});

// Update invoice
router.put('/:id', async (req, res) => {
  try {
    const { amount, description, dueDate, status, notes, paymentMethod, paymentDate } = req.body;
    
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { amount, description, dueDate, status, notes, paymentMethod, paymentDate },
      { new: true, runValidators: true }
    ).populate('donor');

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({
      message: 'Invoice updated successfully',
      invoice
    });
  } catch (error) {
    console.error('Error updating invoice:', error);
    res.status(500).json({ 
      message: 'Error updating invoice', 
      error: error.message 
    });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndDelete(req.params.id);

    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    res.json({ message: 'Invoice deleted successfully' });
  } catch (error) {
    console.error('Error deleting invoice:', error);
    res.status(500).json({ 
      message: 'Error deleting invoice', 
      error: error.message 
    });
  }
});

// Generate PDF invoice
router.get('/:id/pdf', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id).populate('donor');
    
    if (!invoice) {
      return res.status(404).json({ message: 'Invoice not found' });
    }

    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="invoice-${invoice.invoiceNumber}.pdf"`);
    
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('JAMA MASJID PHUGEWADI', 50, 50);
    doc.fontSize(14).text('Invoice', 50, 80);
    
    // Invoice details
    doc.fontSize(12)
       .text(`Invoice Number: ${invoice.invoiceNumber}`, 50, 120)
       .text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, 50, 140)
       .text(`Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}`, 50, 160);
    
    // Donor details
    doc.text('Bill To:', 50, 200)
       .text(`${invoice.donor.firstName} ${invoice.donor.lastName}`, 50, 220)
       .text(`Mobile: ${invoice.donor.mobileNumber}`, 50, 240)
       .text(`Area: ${invoice.donor.area}`, 50, 260);
    
    // Invoice items
    doc.text('Description:', 50, 320)
       .text(invoice.description, 50, 340)
       .text(`Amount: ₹${invoice.amount}`, 50, 380)
       .text(`Status: ${invoice.status.toUpperCase()}`, 50, 400);
    
    if (invoice.notes) {
      doc.text(`Notes: ${invoice.notes}`, 50, 440);
    }
    
    // Footer
    doc.text('Thank you for your donation!', 50, 500);
    
    doc.end();
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ 
      message: 'Error generating PDF', 
      error: error.message 
    });
  }
});

module.exports = router;