# ResuEase

A modern, professional resume builder application built with React and Node.js. Create, customize, and export professional resumes with an intuitive drag-and-drop interface.

![ResuEase Preview](./preview.png)

## ✨ Features

- **Interactive Resume Builder**: Intuitive form-based interface with real-time preview
- **Professional Templates**: Harvard template with more coming soon
- **Drag & Drop Sections**: Reorder resume sections with drag-and-drop functionality
- **PDF Export**: Generate high-quality PDF resumes using Puppeteer
- **Auto-Save**: Automatic local storage of your work
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **User Authentication**: Secure sign-in with Supabase Auth
- **Custom Sections**: Add personalized sections beyond standard resume components

## 🚀 Quick Start

### Prerequisites

- Node.js 22.13 or higher
- pnpm 11.17 or higher (recommended) or npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/DavidGD616/ResuEase.git
   cd ResuEase
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd apps/app/backend
   pnpm install

   # Install frontend dependencies
   cd ../frontend
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the frontend directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   VITE_API_BASE_URL=http://localhost:3001/api
   ```

4. **Start the development servers**
   
   **Backend (Terminal 1):**
   ```bash
   cd apps/app/backend
   pnpm dev
   ```
   
   **Frontend (Terminal 2):**
   ```bash
   cd apps/app/frontend
   pnpm dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` to start building your resume!

## 🏗️ Project Structure

```
ResuEase/
├── apps/app/
│   ├── backend/                 # Node.js/Express API
│   │   ├── src/
│   │   │   └── controllers/     # API controllers
│   │   ├── server.js           # Express server setup
│   │   └── package.json
│   └── frontend/               # React application
│       ├── src/
│       │   ├── components/     # React components
│       │   ├── hooks/          # Custom React hooks
│       │   ├── pages/          # Page components
│       │   ├── services/       # API services
│       │   └── utils/          # Utility functions
│       └── package.json
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - Modern React with latest features
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Vite** - Fast build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web application framework
- **Puppeteer** - PDF generation
- **CORS** - Cross-origin resource sharing

### Authentication & Database
- **Supabase** - Authentication and database services

### Development Tools
- **pnpm** - Fast, disk space efficient package manager
- **ESLint** - Code linting
- **Nodemon** - Auto-restart development server

## 📝 Available Scripts

### Frontend
```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm preview    # Preview production build
pnpm lint       # Run ESLint
```

### Backend
```bash
pnpm start      # Start production server
pnpm dev        # Start development server with hot reload
```

## 🔧 Configuration

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from the API settings
3. Add them to your `.env` file

### PDF Generation

The application uses Puppeteer for PDF generation. The backend automatically handles:
- HTML to PDF conversion
- Professional formatting
- Download functionality

## 🎨 Templates

Currently available templates:
- **Harvard Template** - Classic academic style resume

*More templates coming soon!*

## 📱 Features in Detail

### Resume Sections
- Personal Details
- Contact Information  
- Professional Summary
- Employment History
- Education
- Projects
- Skills & Technologies
- Languages
- Courses & Certifications
- References
- Custom Sections

### Customization Options
- Drag and drop section reordering
- Add/remove sections dynamically
- Rich text editing for descriptions
- Bullet point management
- Real-time preview

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Test on both desktop and mobile

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🐛 Bug Reports

Found a bug? Please open an issue with:
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser/OS information

## 💡 Feature Requests

Have an idea for a new feature? We'd love to hear it! Open an issue with:
- Feature description
- Use case/problem it solves
- Proposed solution (if any)

## 📞 Support

- 📧 Email: [your-email@example.com](mailto:your-email@example.com)
- 🐛 Issues: [GitHub Issues](https://github.com/DavidGD616/ResuEase/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/DavidGD616/ResuEase/discussions)

## 🙏 Acknowledgments

- Built with ❤️ using React and Node.js
- Icons provided by [Lucide](https://lucide.dev/)
- Authentication powered by [Supabase](https://supabase.com/)
- PDF generation using [Puppeteer](https://pptr.dev/)

---

**Made with ❤️ by [DavidGD616](https://github.com/DavidGD616)**

⭐ Star this repo if you find it helpful!
