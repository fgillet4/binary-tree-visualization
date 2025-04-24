# Installation Guide

This document provides detailed instructions for setting up the Binary Search Tree Visualization project on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (version 14.0.0 or higher)
- **npm** (version 6.0.0 or higher)

You can check your current versions with:

```bash
node --version
npm --version
```

## Step-by-Step Installation

### 1. Clone or Download the Repository

#### Option A: Clone using Git

If you have Git installed, clone the repository:

```bash
git clone https://github.com/yourusername/binary-tree-visualization.git
cd binary-tree-visualization
```

#### Option B: Download ZIP

Alternatively, download the ZIP file and extract it to a location of your choice.

### 2. Install Dependencies

From the project root directory, install all required dependencies:

```bash
npm install
```

This will read the `package.json` file and install all necessary packages.

### 3. Start the Development Server

Once dependencies are installed, start the development server:

```bash
npm start
```

This command will:
- Compile the application
- Start a local development server
- Open your default browser to `http://localhost:3000`

If the browser doesn't open automatically, you can manually navigate to `http://localhost:3000`.

### 4. Development and Modifications

The application uses React's hot reloading feature. When you make changes to the code, most updates will be immediately visible in the browser without requiring a manual refresh.

#### Project Structure for Development

Below is a reminder of the key project folders:

- `src/components/` - React components
- `src/models/` - Data structures
- `src/utils/` - Utility functions
- `src/constants/` - Constants and content
- `src/styles/` - CSS styles

## Troubleshooting

### Common Issues and Solutions

#### "npm install" fails
- Try clearing npm cache: `npm cache clean --force`
- Ensure you have the correct permissions for the directory

#### Development server doesn't start
- Check if port 3000 is already in use by another application
- To use a different port, modify the start script in package.json or use:
  ```bash
  PORT=3001 npm start
  ```

#### Blank page in browser
- Check the browser console for errors
- Ensure all dependencies were properly installed
- Verify there are no syntax errors in the code

## Building for Production

When you're ready to deploy the application, create a production build:

```bash
npm run build
```

This creates optimized files in the `build/` directory, which can be served by any static file server.

## Additional Configuration

### Customizing Port

To change the default port (3000), you can:

1. Create a `.env` file in the project root
2. Add `PORT=3001` (or your preferred port)

### Using HTTPS Locally

To use HTTPS during development:

1. Create a `.env` file in the project root
2. Add `HTTPS=true`

Note: This will use a self-signed certificate, which will show browser warnings.

## Support

If you encounter any issues not covered in this guide, please reach out via:
- Opening an issue on the GitHub repository
- Contacting the project maintainer directly