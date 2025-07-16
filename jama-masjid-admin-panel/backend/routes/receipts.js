const express = require('express');
const PDFDocument = require('pdfkit');
const Receipt = require('../models/Receipt');
const Donor = require('../models/Donor');
const Invoice = require('../models/Invoice');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Create new receipt
router.post('/', async (req, res) => {
  try {
    const { 
      donorId, 
      invoiceId,
      amount, 
      description, 
      paymentMethod, 
      paymentDate,
      chequeNumber,
      bankName,
      transactionId,
      notes 
    } = req.body;

    // Validate donor exists
    const donor = await Donor.findById(donorId);
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    // Validate invoice if provided
    if (invoiceId) {
      const invoice = await Invoice.findById(invoiceId);
      if (!invoice) {
        return res.status(404).json({ message: 'Invoice not found' });
      }
    }

    const receipt = new Receipt({
      donor: donorId,
      invoice: invoiceId,
      amount,
      description,
      paymentMethod,
      paymentDate,
      chequeNumber,
      bankName,
      transactionId,
      notes
    });

    await receipt.save();
    await receipt.populate('donor');
    
    // Update donor's total donations
    await Donor.findByIdAndUpdate(donorId, {
      $inc: { totalDonations: amount },
      lastDonationDate: paymentDate || new Date()
    });

    // Update invoice status if linked
    if (invoiceId) {
      await Invoice.findByIdAndUpdate(invoiceId, {
        status: 'paid',
        paymentMethod,
        paymentDate: paymentDate || new Date()
      });
    }

    res.status(201).json({
      message: 'Receipt created successfully',
      receipt
    });
  } catch (error) {
    console.error('Error creating receipt:', error);
    res.status(500).json({ 
      message: 'Error creating receipt', 
      error: error.message 
    });
  }
});

// Get all receipts with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { donorId, paymentMethod, startDate, endDate } = req.query;
    
    let query = { isActive: true };
    
    if (donorId) {
      query.donor = donorId;
    }
    
    if (paymentMethod) {
      query.paymentMethod = paymentMethod;
    }
    
    if (startDate && endDate) {
      query.paymentDate = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const receipts = await Receipt.find(query)
      .populate('donor', 'firstName lastName mobileNumber area')
      .populate('invoice', 'invoiceNumber amount')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Receipt.countDocuments(query);

    res.json({
      receipts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching receipts:', error);
    res.status(500).json({ 
      message: 'Error fetching receipts', 
      error: error.message 
    });
  }
});

// Get receipt by ID
router.get('/:id', async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('donor')
      .populate('invoice');
    
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    res.json(receipt);
  } catch (error) {
    console.error('Error fetching receipt:', error);
    res.status(500).json({ 
      message: 'Error fetching receipt', 
      error: error.message 
    });
  }
});

// Update receipt
router.put('/:id', async (req, res) => {
  try {
    const { 
      amount, 
      description, 
      paymentMethod, 
      paymentDate,
      chequeNumber,
      bankName,
      transactionId,
      notes 
    } = req.body;
    
    const receipt = await Receipt.findByIdAndUpdate(
      req.params.id,
      { 
        amount, 
        description, 
        paymentMethod, 
        paymentDate,
        chequeNumber,
        bankName,
        transactionId,
        notes 
      },
      { new: true, runValidators: true }
    ).populate('donor').populate('invoice');

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    res.json({
      message: 'Receipt updated successfully',
      receipt
    });
  } catch (error) {
    console.error('Error updating receipt:', error);
    res.status(500).json({ 
      message: 'Error updating receipt', 
      error: error.message 
    });
  }
});

// Delete receipt (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const receipt = await Receipt.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    res.json({ message: 'Receipt deleted successfully' });
  } catch (error) {
    console.error('Error deleting receipt:', error);
    res.status(500).json({ 
      message: 'Error deleting receipt', 
      error: error.message 
    });
  }
});

// Generate PDF receipt
router.get('/:id/pdf', async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('donor')
      .populate('invoice');
    
    if (!receipt) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    const doc = new PDFDocument();
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="receipt-${receipt.receiptNumber}.pdf"`);
    
    doc.pipe(res);

    // Header
    doc.fontSize(20).text('JAMA MASJID PHUGEWADI', 50, 50);
    doc.fontSize(14).text('Donation Receipt', 50, 80);
    
    // Receipt details
    doc.fontSize(12)
       .text(`Receipt Number: ${receipt.receiptNumber}`, 50, 120)
       .text(`Date: ${new Date(receipt.paymentDate).toLocaleDateString()}`, 50, 140)
       .text(`Payment Method: ${receipt.paymentMethod.replace('_', ' ').toUpperCase()}`, 50, 160);
    
    // Donor details
    doc.text('Received From:', 50, 200)
       .text(`${receipt.donor.firstName} ${receipt.donor.lastName}`, 50, 220)
       .text(`Mobile: ${receipt.donor.mobileNumber}`, 50, 240)
       .text(`Area: ${receipt.donor.area}`, 50, 260);
    
    // Payment details
    doc.text('Payment Details:', 50, 300)
       .text(`Amount: ₹${receipt.amount}`, 50, 320)
       .text(`Description: ${receipt.description}`, 50, 340);
    
    if (receipt.chequeNumber) {
      doc.text(`Cheque Number: ${receipt.chequeNumber}`, 50, 360);
    }
    
    if (receipt.bankName) {
      doc.text(`Bank: ${receipt.bankName}`, 50, 380);
    }
    
    if (receipt.transactionId) {
      doc.text(`Transaction ID: ${receipt.transactionId}`, 50, 400);
    }
    
    if (receipt.notes) {
      doc.text(`Notes: ${receipt.notes}`, 50, 440);
    }
    
    // Footer
    doc.text('Thank you for your generous donation!', 50, 500);
    doc.text('May Allah reward you for your contribution.', 50, 520);
    
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