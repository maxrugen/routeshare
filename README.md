# Routeshare - Instagram Story Overlays for Activities

A cross-platform MVP application that generates beautiful Instagram Story overlays from your Strava activities or GPX files. Create stunning visual representations of your fitness achievements with clean, minimal designs.

## ✨ Features

- **📱 Instagram Story Ready**: Outputs images in perfect 1080x1920 format
- **🔗 Strava Integration**: Connect your Strava account via OAuth
- **📁 GPX File Support**: Upload and parse GPX files for offline activities
- **🎨 Custom Overlays**: Beautiful templates with customizable colors and positioning
- **🗺️ Route Visualization**: Interactive route maps with start/end markers
- **📊 Activity Stats**: Display distance, duration, elevation, and pace
- **🖼️ Background Images**: Upload custom background photos
- **💾 Export Options**: Download as PNG for immediate use

## 🏗️ Architecture

- **Frontend**: Next.js 14 with App Router, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Node.js + Express + TypeScript
- **Image Processing**: Canvas API (frontend) + Sharp (backend)
- **GPX Parsing**: XML2JS + custom coordinate processing
- **Styling**: Modern, clean aesthetic with Inter font family

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Strava API credentials (optional, for Strava integration)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/maxrugen/routeshare
   cd routeshare
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Environment Setup**
   ```bash
   # Backend
   cd backend
   cp env.example .env
   # Edit .env with your Strava API credentials
   
   # Frontend
   cd ../frontend
   # No additional setup needed
   ```

4. **Start the development servers**
   ```bash
   # From root directory
   npm run dev
   ```

This will start:
- Backend: http://localhost:5001
- Frontend: http://localhost:3000

## 🔧 Configuration

### Strava API Setup

1. Go to [Strava API Settings](https://www.strava.com/settings/api)
2. Create a new application
3. Copy your Client ID and Client Secret
4. Set Redirect URI to: `http://localhost:3000/api/auth/strava/callback`
5. Update your `.env` file:

```env
STRAVA_CLIENT_ID=your_client_id
STRAVA_CLIENT_SECRET=your_client_secret
REDIRECT_URI=http://localhost:3000/api/auth/strava/callback
```

### Environment Variables

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Strava API Configuration
STRAVA_CLIENT_ID=your_strava_client_id
STRAVA_CLIENT_SECRET=your_strava_client_secret
REDIRECT_URI=http://localhost:3000/api/auth/strava/callback

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
```

## 📱 Usage

### 1. Import Activity Data

**Option A: Strava Integration**
- Click "Connect with Strava"
- Authorize the application
- Select an activity from your recent activities

**Option B: GPX File Upload**
- Drag & drop a GPX file or click to browse
- Supported formats: GPX (GPS Exchange Format)
- Maximum file size: 10MB

### 2. Customize Your Overlay

- **Style Options**: Choose primary/secondary colors
- **Position**: Top, center, or bottom placement
- **Elements**: Toggle map and stats display
- **Background**: Upload custom background images

### 3. Generate & Export

- Click "Generate Overlay" to create your design
- Preview the result in real-time
- Download as PNG file
- Share directly to Instagram Stories

## 🏃‍♂️ Demo Mode

Try the app without real data by visiting:
```
http://localhost:3000/dashboard?demo=true
```

This loads sample activity data so you can explore all features immediately.

## 🛠️ Development

### Project Structure

```
routeshare/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API endpoints
│   │   └── types/          # TypeScript definitions
│   ├── uploads/            # File upload directory
│   └── package.json
├── frontend/               # Next.js 14 application
│   ├── app/               # App Router pages
│   ├── components/        # React components
│   ├── types/            # TypeScript definitions
│   └── package.json
└── package.json           # Root package.json
```

### Available Scripts

```bash
# Root directory
npm run dev              # Start both frontend and backend
npm run build           # Build both applications
npm run install:all     # Install all dependencies

# Backend only
cd backend
npm run dev             # Start backend with hot reload
npm run build           # Build TypeScript
npm start               # Start production server

# Frontend only
cd frontend
npm run dev             # Start Next.js dev server
npm run build           # Build Next.js application
npm start               # Start production server
```

### API Endpoints

#### Authentication
- `GET /api/auth/strava` - Initiate Strava OAuth
- `GET /api/auth/strava/callback` - OAuth callback handler
- `GET /api/auth/profile` - Get user profile
- `POST /api/auth/logout` - Logout user

#### GPX Processing
- `POST /api/gpx/upload` - Upload and parse GPX file
- `GET /api/gpx/sample` - Get sample activity data

#### Overlay Generation
- `POST /api/overlay/generate` - Generate Instagram Story overlay
- `POST /api/overlay/generate/custom` - Generate with custom styling
- `GET /api/overlay/templates` - Get available templates
- `POST /api/overlay/templates/:id/preview` - Preview template

## 🎨 Design System

### Color Palette
- **Primary**: Clean grays (#1a1a1a, #666666)
- **Accent**: Blue tones (#3b82f6, #1e40af)
- **Background**: Subtle gradients (#f8fafc, #e2e8f0)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Hierarchy**: Clear contrast between labels and values

### Components
- **Cards**: Subtle shadows with rounded corners
- **Buttons**: Interactive states with hover effects
- **Forms**: Clean input fields with focus states
- **Animations**: Subtle Framer Motion transitions

## 🔒 Security Considerations

- **OAuth 2.0**: Secure Strava authentication
- **File Validation**: GPX file type and size restrictions
- **Session Management**: Secure session handling
- **CORS**: Configured for development and production
- **Input Sanitization**: All user inputs are validated

## 🚧 Future Enhancements

- [ ] **Template Library**: More overlay design options
- [ ] **Social Sharing**: Direct Instagram integration
- [ ] **Activity History**: Save and manage previous overlays
- [ ] **Advanced Customization**: Fonts, layouts, animations
- [ ] **Mobile App**: React Native version
- [ ] **Analytics**: Track overlay usage and engagement
- [ ] **Collaboration**: Share and remix overlay designs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Strava API**: For activity data integration
- **Next.js Team**: For the amazing React framework
- **TailwindCSS**: For the utility-first CSS framework
- **Framer Motion**: For smooth animations
- **Canvas API**: For client-side image generation

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/maxrugen/routeshare/issues)
- **Discussions**: [GitHub Discussions](https://github.com/maxrugen/routeshare/discussions)
- **Email**: hi@maxrugen.com

---

**Made with ❤️ for the fitness community**
