# Routeshare - Instagram Story Overlays for Activities

A streamlined MVP application that generates beautiful Instagram Story overlays from your GPX files. Create stunning visual representations of your fitness achievements with clean, minimal designs. Next up: Strava integration to import activities directly!

## ✨ Features

- **📱 Instagram Story Ready**: Outputs images in perfect 1080x1920 format
- **📁 GPX File Support**: Upload and parse GPX files with full coordinate processing
- **📊 Activity Stats**: Display distance, duration, elevation, and pace
- **💾 Export Options**: Download as PNG with white/black color variants
- **🔧 Type Safety**: Full TypeScript support with zero compilation errors
- **⚡ Development Ready**: Hot reload, concurrent development servers, and optimized builds

## ✅ Build Status

- **Backend**: ✅ TypeScript compilation successful
- **Frontend**: ✅ Next.js build successful  
- **Development**: ✅ Hot reload working
- **Type Safety**: ✅ All TypeScript errors resolved

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

> **Note**: The project is now fully functional with all TypeScript compilation errors resolved. Both frontend and backend build successfully and are ready for development.

## �� Configuration

### Environment Variables

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
```

## 📱 Usage

### 1. Import Activity Data

**GPX File Upload**
- Drag & drop a GPX file or click to browse
- Supported formats: GPX (GPS Exchange Format)
- Maximum file size: 10MB

### 2. Generate Your Overlay

- **Simple Process**: Upload GPX file and get instant overlay
- **Activity Stats**: View distance, duration, elevation, and pace
- **Clean Design**: Minimal, Instagram Story ready format

### 3. Export & Share

- Choose between white or black overlay variants
- Download as PNG file in perfect 1080x1920 format
- Share directly to Instagram Stories

<!-- Demo mode removed -->

## 🛠️ Development

### Project Structure

```
routeshare/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── types/          # TypeScript definitions
│   │   ├── middleware/     # Express middleware
│   │   └── utils/          # Utility functions
│   ├── uploads/            # File upload directory
│   └── package.json
├── frontend/               # Next.js 14 application
│   ├── app/               # App Router pages
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility libraries
│   ├── types/             # TypeScript definitions
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

#### GPX Processing
- `POST /api/gpx/upload` - Upload and parse GPX file
<!-- Sample endpoint removed -->

#### Overlay Generation
- `POST /api/overlay/generate` - Generate Instagram Story overlay

## 🔧 Troubleshooting

### Common Issues

**TypeScript Compilation Errors**
- ✅ All TypeScript errors have been resolved
- ✅ Both frontend and backend build successfully
- ✅ Path mapping issues fixed

**Port Conflicts**
- Backend runs on port 5001 (not 5000)
- Frontend runs on port 3000
- Update your `.env` file accordingly

**Import Path Issues**
- All component imports use relative paths
- Type definitions are properly mapped
- No more `@/types` import errors

**Build Issues**
- Backend: Use `npm run build` to compile TypeScript
- Frontend: Use `npm run build` to build Next.js app
- Both should complete without errors

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

- [ ] **Strava Integration**: Connect your Strava account and import activities directly
  - Need to explore: OAuth authentication flow, activity selection, GPX data extraction
- [ ] **Social Sharing**: Direct Instagram integration
- [ ] **Admin Analytics**: Backend usage statistics and user activity tracking
- [ ] **Mobile App**: React Native version (needs exploration)
- [ ] **Batch Processing**: Generate multiple overlays at once (needs exploration)

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
