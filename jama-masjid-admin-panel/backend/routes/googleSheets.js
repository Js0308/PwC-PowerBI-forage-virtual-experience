const express = require('express');
const axios = require('axios');
const Donor = require('../models/Donor');
const auth = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(auth);

// Google Sheets API URL - for public sheets
const GOOGLE_SHEETS_BASE_URL = 'https://sheets.googleapis.com/v4/spreadsheets';

// Fetch data from Google Sheets
router.get('/fetch-data', async (req, res) => {
  try {
    const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
    const range = 'Sheet1!A:E'; // Adjust range as needed
    
    // For public sheets, you can use this URL format
    const publicUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
    
    // Alternative: Using Google Sheets API (requires API key)
    // const apiUrl = `${GOOGLE_SHEETS_BASE_URL}/${sheetId}/values/${range}?key=${process.env.GOOGLE_SHEETS_API_KEY}`;
    
    const response = await axios.get(publicUrl);
    const csvData = response.data;
    
    // Parse CSV data
    const rows = csvData.split('\n').map(row => row.split(','));
    const headers = rows[0];
    const data = rows.slice(1).filter(row => row.length > 1);
    
    const parsedData = data.map(row => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[header.trim()] = row[index]?.trim() || '';
      });
      return obj;
    });

    res.json({
      message: 'Data fetched successfully from Google Sheets',
      data: parsedData,
      count: parsedData.length
    });
  } catch (error) {
    console.error('Error fetching Google Sheets data:', error);
    res.status(500).json({ 
      message: 'Error fetching Google Sheets data', 
      error: error.message 
    });
  }
});

// Import data from Google Sheets to database
router.post('/import-data', async (req, res) => {
  try {
    const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
    const publicUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
    
    const response = await axios.get(publicUrl);
    const csvData = response.data;
    
    // Parse CSV data
    const rows = csvData.split('\n').map(row => row.split(','));
    const headers = rows[0];
    const data = rows.slice(1).filter(row => row.length > 1);
    
    let importedCount = 0;
    let skippedCount = 0;
    let errors = [];

    for (const row of data) {
      try {
        const rowData = {};
        headers.forEach((header, index) => {
          rowData[header.trim()] = row[index]?.trim() || '';
        });

        // Map Google Sheets columns to our Donor model
        // Adjust these mappings based on your actual Google Sheets structure
        const donorData = {
          firstName: rowData['First Name'] || rowData['firstName'] || '',
          lastName: rowData['Last Name'] || rowData['lastName'] || '',
          mobileNumber: rowData['Mobile Number'] || rowData['mobileNumber'] || '',
          area: rowData['Area'] || rowData['area'] || 'Outside',
          notes: rowData['Notes'] || rowData['notes'] || ''
        };

        // Validate required fields
        if (!donorData.firstName || !donorData.lastName || !donorData.mobileNumber) {
          skippedCount++;
          continue;
        }

        // Validate mobile number format
        if (!/^\d{10}$/.test(donorData.mobileNumber)) {
          skippedCount++;
          continue;
        }

        // Check if donor already exists
        const existingDonor = await Donor.findOne({ mobileNumber: donorData.mobileNumber });
        if (existingDonor) {
          skippedCount++;
          continue;
        }

        // Create new donor
        const donor = new Donor(donorData);
        await donor.save();
        importedCount++;

      } catch (error) {
        errors.push(`Row ${data.indexOf(row) + 1}: ${error.message}`);
        skippedCount++;
      }
    }

    res.json({
      message: 'Data import completed',
      imported: importedCount,
      skipped: skippedCount,
      errors: errors.length > 0 ? errors : null
    });
  } catch (error) {
    console.error('Error importing Google Sheets data:', error);
    res.status(500).json({ 
      message: 'Error importing Google Sheets data', 
      error: error.message 
    });
  }
});

// Sync specific donor data from Google Sheets
router.post('/sync-donor/:mobileNumber', async (req, res) => {
  try {
    const { mobileNumber } = req.params;
    const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
    const publicUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
    
    const response = await axios.get(publicUrl);
    const csvData = response.data;
    
    // Parse CSV data
    const rows = csvData.split('\n').map(row => row.split(','));
    const headers = rows[0];
    const data = rows.slice(1).filter(row => row.length > 1);
    
    // Find donor in Google Sheets data
    let donorFound = false;
    for (const row of data) {
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header.trim()] = row[index]?.trim() || '';
      });

      const sheetMobileNumber = rowData['Mobile Number'] || rowData['mobileNumber'] || '';
      
      if (sheetMobileNumber === mobileNumber) {
        donorFound = true;
        
        const donorData = {
          firstName: rowData['First Name'] || rowData['firstName'] || '',
          lastName: rowData['Last Name'] || rowData['lastName'] || '',
          mobileNumber: sheetMobileNumber,
          area: rowData['Area'] || rowData['area'] || 'Outside',
          notes: rowData['Notes'] || rowData['notes'] || ''
        };

        // Update or create donor
        const donor = await Donor.findOneAndUpdate(
          { mobileNumber },
          donorData,
          { new: true, upsert: true, runValidators: true }
        );

        return res.json({
          message: 'Donor synced successfully from Google Sheets',
          donor
        });
      }
    }

    if (!donorFound) {
      return res.status(404).json({ 
        message: 'Donor not found in Google Sheets' 
      });
    }

  } catch (error) {
    console.error('Error syncing donor from Google Sheets:', error);
    res.status(500).json({ 
      message: 'Error syncing donor from Google Sheets', 
      error: error.message 
    });
  }
});

// Get Google Sheets structure/headers
router.get('/structure', async (req, res) => {
  try {
    const sheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
    const publicUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=0`;
    
    const response = await axios.get(publicUrl);
    const csvData = response.data;
    
    // Parse CSV data to get headers
    const rows = csvData.split('\n').map(row => row.split(','));
    const headers = rows[0].map(header => header.trim());
    
    res.json({
      message: 'Google Sheets structure fetched successfully',
      headers,
      sampleData: rows.slice(1, 6) // First 5 rows as sample
    });
  } catch (error) {
    console.error('Error fetching Google Sheets structure:', error);
    res.status(500).json({ 
      message: 'Error fetching Google Sheets structure', 
      error: error.message 
    });
  }
});

module.exports = router;