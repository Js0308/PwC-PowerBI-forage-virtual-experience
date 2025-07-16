const express = require('express');
const Donor = require('../models/Donor');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Create new donor
router.post('/', async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, area, notes } = req.body;

    // Check if mobile number already exists
    const existingDonor = await Donor.findOne({ mobileNumber });
    if (existingDonor) {
      return res.status(400).json({ message: 'Mobile number already exists' });
    }

    const donor = new Donor({
      firstName,
      lastName,
      mobileNumber,
      area,
      notes
    });

    await donor.save();

    res.status(201).json({
      message: 'Donor created successfully',
      donor
    });
  } catch (error) {
    console.error('Error creating donor:', error);
    res.status(500).json({ 
      message: 'Error creating donor', 
      error: error.message 
    });
  }
});

// Get all donors with pagination and filtering
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const { area, search } = req.query;
    
    let query = { isActive: true };
    
    // Filter by area
    if (area) {
      query.area = area;
    }
    
    // Search by name or mobile number
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { mobileNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const donors = await Donor.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Donor.countDocuments(query);

    res.json({
      donors,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ 
      message: 'Error fetching donors', 
      error: error.message 
    });
  }
});

// Get donor by ID
router.get('/:id', async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json(donor);
  } catch (error) {
    console.error('Error fetching donor:', error);
    res.status(500).json({ 
      message: 'Error fetching donor', 
      error: error.message 
    });
  }
});

// Update donor
router.put('/:id', async (req, res) => {
  try {
    const { firstName, lastName, mobileNumber, area, notes } = req.body;
    
    // Check if mobile number already exists (excluding current donor)
    const existingDonor = await Donor.findOne({ 
      mobileNumber, 
      _id: { $ne: req.params.id } 
    });
    
    if (existingDonor) {
      return res.status(400).json({ message: 'Mobile number already exists' });
    }

    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      { firstName, lastName, mobileNumber, area, notes },
      { new: true, runValidators: true }
    );

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json({
      message: 'Donor updated successfully',
      donor
    });
  } catch (error) {
    console.error('Error updating donor:', error);
    res.status(500).json({ 
      message: 'Error updating donor', 
      error: error.message 
    });
  }
});

// Delete donor (soft delete)
router.delete('/:id', async (req, res) => {
  try {
    const donor = await Donor.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json({ message: 'Donor deleted successfully' });
  } catch (error) {
    console.error('Error deleting donor:', error);
    res.status(500).json({ 
      message: 'Error deleting donor', 
      error: error.message 
    });
  }
});

// Search donors by mobile number
router.get('/search/mobile/:mobile', async (req, res) => {
  try {
    const mobile = req.params.mobile;
    
    if (!/^\d{10}$/.test(mobile)) {
      return res.status(400).json({ message: 'Invalid mobile number format' });
    }

    const donor = await Donor.findOne({ mobileNumber: mobile, isActive: true });
    
    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json(donor);
  } catch (error) {
    console.error('Error searching donor by mobile:', error);
    res.status(500).json({ 
      message: 'Error searching donor', 
      error: error.message 
    });
  }
});

// Search donors by name
router.get('/search/name/:name', async (req, res) => {
  try {
    const name = req.params.name;
    
    const donors = await Donor.find({
      $or: [
        { firstName: { $regex: name, $options: 'i' } },
        { lastName: { $regex: name, $options: 'i' } }
      ],
      isActive: true
    }).limit(10);

    res.json(donors);
  } catch (error) {
    console.error('Error searching donors by name:', error);
    res.status(500).json({ 
      message: 'Error searching donors', 
      error: error.message 
    });
  }
});

module.exports = router;