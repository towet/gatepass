# Gate Pass Management System

A modern, responsive Single Page Application (SPA) for managing digital gate passes.

## Deployment Instructions

1. **Create a MongoDB Database**
   - Sign up for a free MongoDB Atlas account
   - Create a new cluster
   - Get your connection string

2. **Deploy to Netlify**
   - Connect your GitHub repository to Netlify
   - Add the following environment variable in Netlify settings:
     - Key: `MONGODB_URI`
     - Value: Your MongoDB connection string

3. **Verify Deployment**
   - Netlify will automatically build and deploy your site
   - Check the Functions tab in Netlify to ensure the serverless function is deployed
   - Test the application by creating a new gate pass

## Local Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Environment Variables**
   Create a `.env` file with:
   ```
   MONGODB_URI=your_mongodb_connection_string
   ```

3. **Run Netlify Dev Server**
   ```bash
   netlify dev
   ```

## Features
- Create gate passes for adults and children
- Automatic ID validation for adults
- Real-time form validation
- Persistent data storage in MongoDB
- Responsive design for all devices
- Modern UI with animations

## System Requirements
- Node.js and npm
- Modern web browser
- MongoDB Atlas account (for database)
- Netlify account (for hosting)
