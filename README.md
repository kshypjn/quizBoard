# 🏆 Quiz Scoreboard

A beautiful and modern quiz scoreboard application built with Node.js, Express, and React. Perfect for tracking team scores during quiz competitions with real-time updates and an elegant user interface.

## ✨ Features

- **Team Management**: Create 2-10 teams with custom names
- **Score Tracking**:
  - Quick buttons for +10 (correct answer) and -10 (wrong answer)
  - Custom points input for flexible scoring
  - Quick custom points buttons (-5, -2, +5, +15, +20)
- **Real-time Updates**: Live score updates across all teams
- **Leaderboard**: Teams automatically sorted by score with visual indicators
- **Total Score**: Display of combined team scores
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Beautiful gradient design with smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation & Setup

1. **Install dependencies for both backend and frontend:**

   ```bash
   # Install backend dependencies
   npm install

   # Install frontend dependencies
   cd client && npm install && cd ..
   ```

2. **Start the development servers:**

   **Option 1: Run both servers separately**

   ```bash
   # Terminal 1 - Start backend server
   npm run dev

   # Terminal 2 - Start frontend server
   npm run client
   ```

   **Option 2: Run production build**

   ```bash
   # Build frontend and start server
   npm run build
   npm start
   ```

3. **Access the application:**
   - Development: http://localhost:3000 (frontend) + http://localhost:3001 (backend)
   - Production: http://localhost:3001

## 🎮 How to Use

### Setting Up Teams

1. Enter the number of teams (2-10)
2. Customize team names or use default "Team 1", "Team 2", etc.
3. Click "Start Quiz Game!" to begin

### Scoring

- **Correct Answer**: Click the green "✓ +10" button
- **Wrong Answer**: Click the red "✗ -10" button
- **Custom Points**:
  - Click "Custom" button for the team
  - Enter any number of points (positive or negative)
  - Click "Apply Points" or use quick buttons

### Game Management

- **Total Score**: See the combined score of all teams at the top
- **Leaderboard**: Teams are automatically ranked by score
- **Reset Game**: Click "🔄 Reset Game" to start over

## 🛠️ Technical Details

### Backend (Node.js + Express)

- RESTful API endpoints for team and score management
- In-memory storage for simplicity
- CORS enabled for cross-origin requests
- Error handling and validation

### Frontend (React + TypeScript)

- Modern React with hooks and functional components
- TypeScript for type safety
- Axios for API communication
- Responsive CSS with modern design patterns
- Component-based architecture

### API Endpoints

- `GET /api/teams` - Get all teams and game state
- `POST /api/teams` - Create teams
- `PATCH /api/teams/:id/score` - Update team score
- `POST /api/reset` - Reset the game

## 🎨 Design Features

- **Gradient Backgrounds**: Beautiful purple-blue gradient theme
- **Glass Morphism**: Semi-transparent cards with backdrop blur
- **Smooth Animations**: Hover effects and transitions
- **Visual Hierarchy**: Clear typography and spacing
- **Color Coding**: Green for correct, red for incorrect, gold for leader
- **Mobile First**: Responsive design that works on all devices

## 📱 Mobile Support

The application is fully responsive and works great on:

- Desktop computers
- Tablets
- Mobile phones
- Large displays

## 🚀 Multi-Device Deployment

### Deploy to Vercel (Recommended)

1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel`
4. Share the URL with all devices

### Multi-Device Usage

- **Controller Device**: Set up teams and manage scoring
- **Viewer Devices**: Open the same URL to see live scores
- **No Setup Required**: Just share the Vercel URL
- **Works on Any Device**: Phones, tablets, computers
- **Real-time Updates**: Refresh viewer devices to see latest scores

## 🔧 Customization

You can easily customize:

- **Scoring Values**: Modify the +10/-10 values in the backend
- **Team Limits**: Change the 0-10 team limit
- **Colors**: Update the CSS variables for different themes
- **Quick Points**: Add or modify the custom quick points buttons

## 🚀 Deployment

### Heroku

1. Create a Heroku app
2. Set buildpacks: Node.js
3. Deploy with `git push heroku main`

### Other Platforms

The app can be deployed to any platform that supports Node.js:

- Vercel
- Netlify
- DigitalOcean
- AWS
- Google Cloud

## 🤝 Contributing

Feel free to contribute by:

1. Forking the repository
2. Creating a feature branch
3. Making your changes
4. Submitting a pull request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ for quiz enthusiasts and educators everywhere!
