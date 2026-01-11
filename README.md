# RentalDay - Vehicle Rental Management System

RentalDay is a comprehensive vehicle rental management system built with React, TypeScript, and Node.js. The application provides an intuitive platform for managing vehicle rentals, user accounts, and booking operations.

## 🚀 Features

### Admin Dashboard
- **System Overview**: Comprehensive dashboard with analytics and insights
- **Vehicle Management**: Add, edit, and delete vehicles with detailed specifications
- **User Governance**: Manage user accounts and permissions
- **Rental Operations**: Track and manage all rental bookings and statuses

### User Features
- **Vehicle Listings**: Browse available vehicles with detailed specifications
- **Booking System**: Intuitive booking process with date selection
- **User Profiles**: Manage personal information and booking history
- **Authentication**: Secure login and registration system

### Technical Features
- **Responsive Design**: Works seamlessly across devices
- **Modern UI/UX**: Clean, intuitive interface with dark/light mode support
- **Real-time Updates**: Live data updates without page refresh
- **Secure Authentication**: JWT-based authentication system

## 🛠️ Tech Stack

### Frontend
- **React**: Component-based UI library
- **TypeScript**: Static typing for improved code quality
- **Bootstrap**: Responsive CSS framework
- **Chart.js**: Interactive data visualization
- **Axios**: HTTP client for API requests

### Backend
- **Node.js**: JavaScript runtime environment
- **Express**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **JWT**: Authentication and authorization

### Development Tools
- **Vite**: Fast build tool and development server
- **ESLint**: Code linting and quality assurance
- **Git**: Version control system

## 📋 Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v16 or higher)
- npm or yarn package manager
- MongoDB (local or cloud instance)
- Git

## 🔧 Installation

1. Clone the repository:
```bash
git clone https://github.com/ShanthanosJr/RentalDay_MS.git
cd RentalDay_MS
```

2. Install dependencies for both client and server:
```bash
# Install server dependencies
npm install

# Navigate to client and install frontend dependencies
cd client
npm install
cd ../server
npm install
```

3. Set up environment variables:
Create `.env` files in both the root and client directories:

Root directory (.env):
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5003
```

Client directory (client/.env):
```
VITE_API_URL=http://localhost:5003
```

4. Start the development servers:
```bash
# In root directory, start both servers concurrently
npm run dev
```

## 🏗️ Project Structure

```
RentalDay/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Application pages
│   │   ├── styles/         # CSS and styling files
│   │   └── context/        # React Context providers
│   └── public/
├── server/                 # Backend Express application
│   ├── models/             # Database models
│   ├── routes/             # API route definitions
│   └── middleware/         # Custom middleware
├── package.json            # Root package file
└── README.md
```

## 🚀 Deployment

### Frontend Deployment
The frontend can be deployed to platforms like Netlify, Vercel, or GitHub Pages:
```bash
cd client
npm run build
```

### Backend Deployment
The backend can be deployed to platforms like Heroku, Railway, or AWS:
- Ensure environment variables are configured
- Connect to a production MongoDB instance
- Set proper CORS origins

## 🤝 Contributing

Contributions are welcome! Here's how you can contribute:

1. Fork the project
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Shanthanos Jr.

## 🐛 Issues

If you encounter any bugs or issues, please report them in the [Issues](https://github.com/ShanthanosJr/RentalDay_MS/issues) section.

## 🆘 Support

For support, please contact the project maintainers through the GitHub repository.