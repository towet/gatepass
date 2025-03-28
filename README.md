# Gate Pass Management System

A modern, responsive Single Page Application (SPA) for managing digital gate passes.

## Setup Instructions

1. **Install json-server globally**
   ```bash
   npm install -g json-server
   ```

2. **Start the Backend Server**
   - Open a terminal in VS Code
   - Run the following command:
   ```bash
   json-server --watch db.json
   ```
   - The backend will start at http://localhost:3000

3. **Start the Frontend**
   - Install "Live Server" extension in VS Code
   - Right-click on `index.html`
   - Select "Open with Live Server"
   - The app will open in your default browser

## Important Notes
- Keep both servers running:
  - json-server (Backend, port 3000)
  - Live Server (Frontend, usually port 5500)
- Internet connection required for icons
- Use modern browsers (Chrome, Firefox, Edge)
- Make sure ports 3000 and 5500 are available

## Features
- Create gate passes for adults and children
- Automatic ID validation for adults
- Real-time form validation
- Persistent data storage
- Responsive design for all devices
- Modern UI with animations

## System Requirements
- Node.js and npm
- Modern web browser
- VS Code with Live Server extension
- Available ports: 3000 and 5500
