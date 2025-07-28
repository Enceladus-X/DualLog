# 🎮 Omegagu - Card Game Tracker

Professional card game match tracker with comprehensive statistics and reporting features.

## ✨ Features

### 📊 Match Tracking
- **Real-time Match Recording**: Quick input for deck names, position (first/second), and results
- **Win Streak Tracking**: Automatic calculation and display of current win streaks
- **Daily Match Management**: Separate today's matches from historical data

### 📈 Advanced Statistics
- **Comprehensive Analytics**: Win rates, deck performance, position analysis
- **Matchup Analysis**: Detailed head-to-head statistics between deck combinations
- **Time-based Analysis**: Performance tracking by time of day
- **Historical Data**: Complete match history with filtering and sorting

### 📋 Reporting System
- **Text Reports**: Detailed text-based summaries with customizable content
- **Visual Reports**: Beautiful image reports with charts and statistics
- **Privacy Options**: Hide sensitive information like deck names
- **Export Options**: CSV export/import for data management

### 🎨 User Experience
- **Dual Language Support**: Korean and English interface
- **Dark/Light Theme**: Customizable appearance
- **Responsive Design**: Optimized for various screen sizes
- **Intuitive Interface**: Clean, modern design with easy navigation

## 🚀 Quick Start

### Installation
\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/omegagu-tracker.git

# Navigate to project directory
cd omegagu-tracker

# Install dependencies
npm install

# Start development server
npm run dev
\`\`\`

### Building for Production
\`\`\`bash
# Build the application
npm run build

# Start production server
npm start

# Or export static files
npm run export
\`\`\`

## 📱 Usage

### Recording Matches
1. Enter your deck name and opponent's deck name
2. Select your position (First/Second)
3. Choose the result (Win/Lose)
4. Click "Add" to record the match

### Viewing Statistics
- Click the "Stats" button to access comprehensive analytics
- Browse through different tabs: Overview, Detailed, Matchup, History
- Use filters to analyze specific data segments

### Generating Reports
- Click "Generate Report" on the main page
- Choose between text and image formats
- Customize privacy settings and content options
- Copy to clipboard or download the report

### Data Management
- Export your data as CSV files for backup
- Import existing match data from CSV files
- Clear all data when needed (with confirmation)

## 🛠️ Technical Stack

- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **Icons**: Lucide React
- **Data Storage**: Local Storage with CSV import/export
- **Canvas**: HTML5 Canvas for image generation

## 📊 Data Structure

### Match Record
\`\`\`typescript
interface Match {
  yourDeck: string
  opponentDeck: string
  position: "first" | "second"
  result: "win" | "lose"
  timestamp: string
  winStreak: number
  note?: string
}
\`\`\`

### Statistics
- Deck performance analysis
- Position-based win rates
- Time-based performance patterns
- Matchup effectiveness ratings

## 🎯 Key Features Explained

### Win Streak Calculation
- Automatically tracks consecutive wins
- Resets on losses
- Historical maximum streak tracking

### Matchup Analysis
- Requires minimum 3 games per combination
- Color-coded advantage indicators
- Detailed win/loss breakdowns

### Report Generation
- **Text Format**: Markdown-style reports with full statistics
- **Image Format**: Visual cards with charts and game lists
- **Privacy Controls**: Hide deck names or opponent information

## 🔧 Configuration

### Settings Options
- **Language**: Korean/English interface
- **Theme**: Light/Dark mode
- **Auto-save**: Automatic statistics saving
- **Notifications**: Win streak alerts
- **Display**: Compact mode and win streak visibility

## 📈 Statistics Categories

1. **Overview**: Total games, win rate, best records
2. **Detailed**: Deck usage, position analysis, time patterns
3. **Matchup**: Head-to-head performance analysis
4. **History**: Complete match log with filtering

## 🎨 Design Philosophy

- **Minimalist Interface**: Clean, distraction-free design
- **Data-Driven**: Focus on actionable insights
- **User-Centric**: Intuitive workflows and quick access
- **Professional**: Suitable for competitive gaming analysis

## 📝 License

MIT License - feel free to use and modify for your needs.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and enhancement requests.

---

**Built with ❤️ for the card gaming community**
