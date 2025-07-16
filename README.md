# Donation Management System

A comprehensive web application for managing donor data, tracking donations, generating receipts, and viewing analytics dashboards.

## Features

### 🏠 **Master Data Preparation**
- Comprehensive donor data entry form
- Separate first name and last name fields
- Photo upload functionality for donor profiles
- Mobile number field in addition to phone
- Real-time donor count display
- Visual donor cards with recent entries

### 🏠 **Donor Master Data Management**
- Add, edit, and delete donor information
- Store contact details, addresses, and tax IDs
- Search and filter donors
- Track total donations per donor
- View donor photos in table and card formats

### 💰 **Donation Tracking**
- Record donations with date, amount, and purpose
- Link donations to specific donors
- Filter donations by donor or month
- Automatic receipt number generation

### 📄 **Monthly Receipt Generation**
- Generate professional monthly donation receipts
- Include donor information and donation summaries
- Print-ready format with tax information
- Automatic total calculations

### 📊 **Analytics Dashboard**
- View key statistics (total donations, donors, averages)
- Monthly donation trends chart
- Top donors visualization
- Real-time data updates

## How to Use

### Getting Started
1. Open `index.html` in a web browser
2. The application will load with sample data
3. Navigate between sections using the top navigation buttons

### Master Data Preparation
1. Click on **"Master Data"** tab (default view)
2. Fill in the comprehensive donor form with:
   - First Name and Last Name (required)
   - Email address (required)
   - Phone and Mobile numbers
   - Address and Tax ID
   - Upload donor photo
3. Click **"Save Donor"** to add the donor
4. View recent donors in the visual card layout below
5. Monitor total donor count in the header

### Managing Donors
1. Click on **"Donors"** tab
2. Click **"Add Donor"** to create new donor records
3. Fill in required information (Name, Email) and optional details
4. Use the search bar to find specific donors
5. Edit or delete donors using the action buttons

### Recording Donations
1. Click on **"Donations"** tab
2. Click **"Add Donation"** to record new donations
3. Select a donor, enter amount, date, and purpose
4. Filter donations by donor or month using the filter options
5. View or delete donations using the action buttons

### Generating Receipts
1. Click on **"Receipts"** tab
2. Select a donor from the dropdown
3. Choose the month for which you want to generate a receipt
4. Click **"Generate Receipt"** to create a printable receipt
5. The receipt includes all donations for that donor in the selected month

### Viewing Analytics
1. Click on **"Dashboard"** tab
2. View summary statistics at the top
3. Analyze trends with the monthly donations chart
4. See top donors in the doughnut chart
5. Click **"Refresh"** to update the dashboard

## Technical Features

### Data Storage
- Uses browser's localStorage for data persistence
- Automatic data saving after each operation
- JSON format for easy data management

### Responsive Design
- Mobile-friendly interface
- Adaptable layout for all screen sizes
- Touch-friendly buttons and forms

### Modern UI/UX
- Clean, professional design
- Smooth animations and transitions
- Intuitive navigation
- Visual feedback for user actions

### Charts and Visualization
- Chart.js integration for interactive charts
- Monthly trend analysis
- Top donors breakdown
- Real-time data updates

## File Structure

```
donation-management-system/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality
└── README.md          # This documentation file
```

## Browser Requirements

- Modern web browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- localStorage support
- Internet connection for external libraries (Font Awesome, Chart.js)

## Sample Data

The application includes sample data for demonstration:
- 3 sample donors with contact information
- 5 sample donations across different months
- Realistic donation amounts and purposes

## Data Fields

### Donor Information
- **First Name** (required): Donor's first name
- **Last Name** (required): Donor's last name
- **Email** (required): Email address for communication
- **Phone**: Primary contact phone number
- **Mobile**: Mobile phone number
- **Address**: Mailing address
- **Tax ID**: Tax identification number
- **Photo**: Donor's profile image (optional)

### Donation Information
- **Donor**: Selected from existing donors
- **Amount**: Donation amount in USD
- **Date**: Date of donation
- **Purpose**: Category (General, Education, Healthcare, Emergency, Other)
- **Notes**: Additional comments or details

### Receipt Information
- **Receipt Number**: Automatically generated unique identifier
- **Organization Details**: Customizable organization information
- **Tax Information**: 501(c)(3) status and tax ID
- **Donation Summary**: Tabular format of all donations for the month

## Customization

### Organization Information
Edit the `generateReceiptHtml()` function in `script.js` to customize:
- Organization name and address
- Contact information
- Tax ID number
- Receipt formatting

### Styling
Modify `styles.css` to customize:
- Color scheme
- Typography
- Layout and spacing
- Responsive breakpoints

### Data Fields
Add or modify fields by updating:
- HTML form elements
- CSS styling for new fields
- JavaScript data handling functions

## Security Considerations

- Data is stored locally in the browser
- No server-side processing required
- Consider implementing backup/export functionality for production use
- Sensitive data should be handled according to privacy regulations

## Future Enhancements

- Export data to CSV/Excel
- Email receipt functionality
- Multi-organization support
- Advanced reporting features
- Database integration
- User authentication system

## Support

For issues or questions, please review the code comments and console logs for debugging information.

---

**Note**: This is a client-side application designed for demonstration purposes. For production use, consider implementing server-side data storage and additional security measures.

