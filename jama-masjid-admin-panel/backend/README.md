# Jama Masjid Phugewadi Admin Panel - Backend API

This is the backend API for the Jama Masjid Phugewadi Admin Panel built with Node.js, Express.js, and MongoDB.

## Features

- **Authentication**: JWT-based authentication with predefined admin credentials
- **Donor Management**: CRUD operations for donor data with Google Sheets integration
- **Invoice Management**: Generate and manage invoices with PDF export
- **Receipt Management**: Track donations with PDF receipt generation
- **Expense Management**: Track masjid expenses with categorization
- **Dashboard Analytics**: Comprehensive statistics and reports
- **Google Sheets Integration**: Import/sync donor data from Google Sheets

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd jama-masjid-admin-panel/backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Configure your `.env` file with the following variables:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jama-masjid-admin
JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
JWT_EXPIRE=30d

# Google Sheets Integration
GOOGLE_SHEETS_API_KEY=your-google-sheets-api-key-here
GOOGLE_SHEETS_SHEET_ID=1otUYpqsvKzX4APd1LX3EDgmbJSFqIiV1Dm7QxtsKqBU

# Admin Credentials
ADMIN_ID=jamamasjid
ADMIN_PASSWORD=786786

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

## Database Setup

1. Make sure MongoDB is running on your system
2. The application will automatically create the database and collections on first run
3. No manual database setup required

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with admin credentials
- `GET /api/auth/verify` - Verify JWT token
- `POST /api/auth/logout` - Logout (optional)

### Donors
- `GET /api/donors` - Get all donors with pagination
- `POST /api/donors` - Create new donor
- `GET /api/donors/:id` - Get donor by ID
- `PUT /api/donors/:id` - Update donor
- `DELETE /api/donors/:id` - Delete donor (soft delete)
- `GET /api/donors/search/mobile/:mobile` - Search by mobile number
- `GET /api/donors/search/name/:name` - Search by name

### Invoices
- `GET /api/invoices` - Get all invoices with pagination
- `POST /api/invoices` - Create new invoice
- `GET /api/invoices/:id` - Get invoice by ID
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice
- `GET /api/invoices/:id/pdf` - Generate PDF invoice

### Receipts
- `GET /api/receipts` - Get all receipts with pagination
- `POST /api/receipts` - Create new receipt
- `GET /api/receipts/:id` - Get receipt by ID
- `PUT /api/receipts/:id` - Update receipt
- `DELETE /api/receipts/:id` - Delete receipt (soft delete)
- `GET /api/receipts/:id/pdf` - Generate PDF receipt

### Expenses
- `GET /api/expenses` - Get all expenses with pagination
- `POST /api/expenses` - Create new expense
- `GET /api/expenses/:id` - Get expense by ID
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense (soft delete)
- `GET /api/expenses/stats/summary` - Get expense statistics

### Dashboard
- `GET /api/dashboard/analytics` - Get comprehensive dashboard analytics
- `GET /api/dashboard/quick-stats` - Get quick statistics for cards

### Google Sheets
- `GET /api/google-sheets/fetch-data` - Fetch data from Google Sheets
- `POST /api/google-sheets/import-data` - Import data from Google Sheets
- `POST /api/google-sheets/sync-donor/:mobileNumber` - Sync specific donor
- `GET /api/google-sheets/structure` - Get Google Sheets structure

## Data Models

### Donor
- firstName (String, required)
- lastName (String, required)
- mobileNumber (String, required, unique, 10 digits)
- area (String, enum: ['Masjid Chawl', 'Phugewadi', 'Wakhare Chawl', 'Sanjay Nagar', 'Outside'])
- totalDonations (Number, default: 0)
- lastDonationDate (Date)
- isActive (Boolean, default: true)
- notes (String)

### Invoice
- invoiceNumber (String, auto-generated)
- donor (ObjectId, ref: 'Donor')
- amount (Number, required)
- description (String)
- dueDate (Date, required)
- status (String, enum: ['pending', 'paid', 'overdue', 'cancelled'])
- paymentMethod (String, enum: ['cash', 'cheque', 'online', 'bank_transfer'])
- paymentDate (Date)
- notes (String)

### Receipt
- receiptNumber (String, auto-generated)
- donor (ObjectId, ref: 'Donor')
- invoice (ObjectId, ref: 'Invoice', optional)
- amount (Number, required)
- paymentMethod (String, enum: ['cash', 'cheque', 'online', 'bank_transfer'])
- paymentDate (Date, required)
- chequeNumber (String)
- bankName (String)
- transactionId (String)
- notes (String)

### Expense
- expenseNumber (String, auto-generated)
- title (String, required)
- description (String, required)
- amount (Number, required)
- category (String, enum: ['Maintenance', 'Utilities', 'Religious Events', etc.])
- expenseDate (Date, required)
- paymentMethod (String, enum: ['cash', 'cheque', 'online', 'bank_transfer'])
- vendor (String)
- billNumber (String)
- status (String, enum: ['pending', 'approved', 'rejected', 'paid'])
- notes (String)

## Security Features

- JWT-based authentication
- Rate limiting
- CORS configuration
- Input validation
- Error handling
- Helmet for security headers

## Google Sheets Integration

The application can import donor data from Google Sheets. To set this up:

1. Make sure your Google Sheet is public or "Anyone with the link can view"
2. Publish the sheet (File → Publish to the web → Publish)
3. Add the sheet ID to your `.env` file
4. The expected columns are: First Name, Last Name, Mobile Number, Area, Notes

## Production Deployment

1. Set `NODE_ENV=production` in your environment
2. Use a strong JWT secret
3. Configure proper MongoDB connection string
4. Set up proper logging
5. Use a process manager like PM2
6. Set up reverse proxy with Nginx
7. Use HTTPS in production

## Testing

Currently, no tests are implemented. You can add tests using Jest or Mocha.

## Error Handling

The API includes comprehensive error handling:
- Validation errors return 400 status
- Authentication errors return 401 status
- Authorization errors return 403 status
- Not found errors return 404 status
- Server errors return 500 status

## Rate Limiting

API requests are rate-limited to prevent abuse:
- Default: 100 requests per 15 minutes per IP
- Configurable via environment variables

## Logging

The application uses Morgan for request logging in development mode.

## Support

For issues or questions, please contact the development team or create an issue in the repository.