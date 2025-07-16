# Jama Masjid Phugewadi Admin Panel

A comprehensive full-stack application for managing donations, donors, invoices, receipts, and expenses for Jama Masjid Phugewadi. Built with modern technologies including React, Next.js, Node.js, Express.js, and MongoDB.

## 🚀 Features

### Authentication
- Secure login with predefined credentials
- JWT-based authentication
- Session management
- Role-based access control

### Dashboard
- Real-time analytics and statistics
- Donor count and growth metrics
- Total donation collection tracking
- Monthly trends and charts
- Top donors visualization
- Expense tracking and net balance

### Donor Management (Master Data)
- Add new donors with validation
- Search donors by mobile number or name
- Update donor information
- Area-wise donor categorization
- Google Sheets integration for bulk import
- Donation history tracking

### Invoice Management
- Generate invoices for donors
- PDF invoice generation
- Track invoice status (pending, paid, overdue)
- Due date management
- Payment method tracking

### Receipt Management
- Generate receipts for received donations
- PDF receipt generation
- Link receipts to invoices
- Multiple payment method support
- Donation tracking and reporting

### Expense Management
- Track masjid-related expenses
- Categorize expenses by type
- Expense approval workflow
- Monthly expense reports
- Budget tracking and analysis

### Google Sheets Integration
- Import donor data from Google Sheets
- Sync specific donor information
- Bulk data import with validation
- Real-time data synchronization

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with custom components
- **State Management**: React Query for server state
- **Forms**: React Hook Form with validation
- **Charts**: Chart.js with React Chart.js 2
- **UI Components**: Custom component library
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **File Generation**: PDFKit for PDF generation
- **API Integration**: Axios for HTTP requests
- **Security**: Helmet, CORS, Rate limiting
- **Validation**: Built-in validation with Mongoose

### Mobile (React Native)
- **Framework**: React Native with Expo
- **Navigation**: React Navigation
- **State Management**: React Query
- **UI Components**: Native Base or React Native Elements
- **Forms**: React Hook Form

## 📁 Project Structure

```
jama-masjid-admin-panel/
├── backend/                 # Node.js API server
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── server.js           # Main server file
│   └── package.json        # Backend dependencies
├── frontend/               # Next.js web application
│   ├── pages/              # Next.js pages
│   ├── components/         # React components
│   ├── lib/                # Utility functions and API
│   ├── hooks/              # Custom React hooks
│   ├── types/              # TypeScript definitions
│   ├── styles/             # CSS and styling
│   └── package.json        # Frontend dependencies
├── mobile/                 # React Native mobile app
│   ├── src/                # Source code
│   ├── components/         # React Native components
│   ├── screens/            # App screens
│   ├── navigation/         # Navigation setup
│   └── package.json        # Mobile dependencies
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn
- Git

### 1. Clone the Repository
```bash
git clone <repository-url>
cd jama-masjid-admin-panel
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/jama-masjid-admin
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d

# Google Sheets Integration
GOOGLE_SHEETS_API_KEY=your-google-sheets-api-key
GOOGLE_SHEETS_SHEET_ID=1otUYpqsvKzX4APd1LX3EDgmbJSFqIiV1Dm7QxtsKqBU

# Admin Credentials
ADMIN_ID=jamamasjid
ADMIN_PASSWORD=786786
```

Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Start the frontend development server:
```bash
npm run dev
```

### 4. Mobile Setup (Optional)
```bash
cd ../mobile
npm install
npx expo start
```

## 🔐 Default Login Credentials

- **ID**: `jamamasjid`
- **Password**: `786786`

## 📱 Application Sections

### 1. Dashboard
- Overview of key metrics
- Donor statistics
- Donation trends
- Monthly analytics
- Quick action buttons

### 2. Master Data (Donors)
- **Create**: Add new donors with validation
- **Search**: Find donors by mobile number or name
- **Edit**: Update donor information
- **Delete**: Remove donors (soft delete)
- **Import**: Bulk import from Google Sheets

### 3. Invoice Management
- Generate invoices for donors
- Track payment status
- Download PDF invoices
- Set due dates and reminders

### 4. Receipt Management
- Record donation receipts
- Generate PDF receipts
- Link to invoices
- Payment method tracking

### 5. Expense Management
- Add expense entries
- Categorize expenses
- Track spending by category
- Generate expense reports

## 🎨 UI/UX Features

### Design System
- Modern, clean interface
- Responsive design for all devices
- Consistent color scheme
- Accessibility-friendly components
- Loading states and error handling

### Interactive Elements
- Real-time search and filtering
- Sortable tables
- Modal dialogs for forms
- Toast notifications
- Smooth animations

### Mobile-First Design
- Responsive grid system
- Touch-friendly interface
- Optimized for mobile devices
- Progressive Web App features

## 📊 Analytics & Reporting

### Dashboard Metrics
- Total donors count
- Total donation amount
- Monthly donation trends
- Top donors by contribution
- Expense breakdown by category
- Net balance calculation

### Charts & Visualizations
- Monthly donation trends (Line chart)
- Donations by area (Pie chart)
- Expense categories (Bar chart)
- Payment method distribution (Doughnut chart)

## 🔧 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify token
- `POST /api/auth/logout` - User logout

### Donor Endpoints
- `GET /api/donors` - Get all donors
- `POST /api/donors` - Create donor
- `GET /api/donors/:id` - Get donor by ID
- `PUT /api/donors/:id` - Update donor
- `DELETE /api/donors/:id` - Delete donor

### Invoice Endpoints
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create invoice
- `GET /api/invoices/:id/pdf` - Download PDF

### Receipt Endpoints
- `GET /api/receipts` - Get all receipts
- `POST /api/receipts` - Create receipt
- `GET /api/receipts/:id/pdf` - Download PDF

### Expense Endpoints
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create expense
- `GET /api/expenses/stats/summary` - Get statistics

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting to prevent abuse
- CORS configuration
- Input validation and sanitization
- SQL injection prevention
- XSS protection

## 🌐 Google Sheets Integration

### Setup Instructions
1. Create a Google Sheet with donor data
2. Make the sheet public or "Anyone with the link can view"
3. Publish the sheet (File → Publish to web)
4. Extract the sheet ID from the URL
5. Add the sheet ID to your `.env` file

### Expected Sheet Structure
| First Name | Last Name | Mobile Number | Area | Notes |
|------------|-----------|---------------|------|-------|
| John | Doe | 9876543210 | Phugewadi | Sample note |

## 📱 Mobile App Features

### Cross-Platform Support
- iOS and Android compatibility
- Native performance
- Platform-specific UI components
- Push notifications (optional)

### Mobile-Specific Features
- Offline data caching
- Camera integration for receipts
- Location-based services
- Touch ID/Face ID authentication

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to platforms like Heroku, AWS, or DigitalOcean
4. Set up SSL/TLS certificates

### Frontend Deployment
1. Build the Next.js application
2. Deploy to Vercel, Netlify, or AWS
3. Configure environment variables
4. Set up custom domain (optional)

### Mobile Deployment
1. Build for iOS and Android
2. Submit to App Store and Google Play
3. Configure app store listings
4. Set up analytics and crash reporting

## 🔄 Data Flow

1. **Authentication**: User logs in with credentials
2. **Dashboard**: System loads analytics and statistics
3. **CRUD Operations**: Users can create, read, update, delete records
4. **PDF Generation**: System generates invoices and receipts
5. **Google Sheets Sync**: Import/sync donor data
6. **Real-time Updates**: Data updates reflect immediately

## 📚 Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow React best practices
- Implement proper error handling
- Write clean, maintainable code
- Use meaningful variable names

### Testing
- Unit tests for components
- Integration tests for API endpoints
- End-to-end tests for user flows
- Performance testing for large datasets

### Performance Optimization
- Lazy loading for components
- Image optimization
- Code splitting
- Caching strategies
- Database query optimization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests for new features
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation
- Review the FAQ section

## 📞 Contact

- **Organization**: Jama Masjid Phugewadi
- **Email**: admin@jamamasjidphugewadi.org
- **Phone**: +91-XXXXXXXXXX
- **Address**: Phugewadi, [City], [State] - [Pincode]

---

**Built with ❤️ for the community by the Jama Masjid Phugewadi development team**