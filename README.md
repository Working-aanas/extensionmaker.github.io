# My Portfolio Website

This project is a React application that showcases my portfolio. It is built using Vite for fast development and optimized builds. The application is designed to be deployed on GitHub Pages.

## Project Structure

```
my-portfolio-website
├── src
│   ├── App.tsx          # Main component of the React application
│   └── main.tsx         # Entry point of the React application
├── .github
│   └── workflows
│       └── deploy.yml   # GitHub Actions workflow for deployment
├── package.json          # npm configuration file
├── vite.config.ts       # Vite configuration file
├── index.html           # Main HTML file
└── README.md            # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/my-portfolio-website.git
   cd my-portfolio-website
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Build the project for production:**
   ```bash
   npm run build
   ```

5. **Deploy to GitHub Pages:**
   The project is configured to deploy automatically to GitHub Pages using GitHub Actions. Make sure to set up the `gh-pages` branch in your repository.

## License

This project is licensed under the MIT License.