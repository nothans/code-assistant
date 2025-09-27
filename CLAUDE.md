# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a client-side web application that provides an AI assistant interface for coding help. The app communicates directly with OpenAI's API from the browser and stores all data locally using localStorage.

## Architecture

### Core Structure
- **Frontend-only**: No backend server, all API calls made directly from browser to OpenAI
- **Static hosting**: Designed to be served as static files (currently hosted on GitHub Pages)
- **Local storage**: All user data (API keys, settings, custom modes) stored in browser localStorage

### Key Files
- `index.html` - Main application interface with Bootstrap UI and Run Python Code modal
- `scripts/app.js` - Core application logic, OpenAI API integration, Pyodide Python runtime, and UI management
- `scripts/prompt-settings.js` - Predefined mode configurations and prompt templates
- `scripts/prism-buttons.js` - Code syntax highlighting, copy functionality, and Run Code button
- `styles/` - CSS files for styling and animations

### Application Modes
The app has four predefined modes with different prompt configurations:
- **Default**: Python coding assistance
- **Math**: Mathematics and engineering focus
- **Flashcard**: Interactive learning cards for Python concepts
- **Custom**: User-configurable settings

Mode configurations are defined in `prompt-settings.js` in the `prompt_mode_settings` object.

## Development

### No Build Process
This project has no build tools, package managers, or compilation steps. It uses:
- CDN-hosted dependencies (Bootstrap, KaTeX, Showdown, Prism, Pyodide)
- Vanilla JavaScript (no frameworks)
- Static file serving
- Client-side Python execution via Pyodide WebAssembly

### Making Changes
- Edit files directly - no build step required
- Test by serving files locally or opening `index.html` in browser
- All dependencies are loaded from CDNs in `index.html`

### Code Conventions
- Use vanilla JavaScript (ES6+)
- Follow existing naming patterns (snake_case for functions/variables)
- Constants defined in ALL_CAPS at top of files
- HTML uses Bootstrap 5 classes for styling
- All external dependencies loaded via CDN

### Key Constants (app.js)
- `APP_NAME`: Application name displayed in UI
- `APP_MODE_KEY`, `APP_MODE_CUSTOM_KEY`, `APP_API_KEY`: localStorage keys
- `MAX_ASSISTANT_TOKENS`: Token limit for API responses
- `DEFAULT_CODE_LANGUAGE`: Default syntax highlighting language

### Python Code Execution
The application includes a full Python runtime using Pyodide:
- **Pyodide Integration**: WebAssembly-based Python interpreter runs in browser
- **Scientific Packages**: Automatically installs numpy, scipy, matplotlib on first use
- **Interactive Plotting**: Matplotlib plots display in modal with zoom, pan, download controls
- **Code Execution Modal**: Large modal (95% viewport width) for viewing plots and output
- **Error Handling**: Comprehensive Python error reporting with tracebacks
- **Package Management**: Automatic loading of scientific computing packages

### Prism Code Buttons
Code blocks include interactive buttons:
- **Explain**: Sends code to AI for explanation
- **Copy**: Copies code to clipboard
- **Run Code**: Executes Python code in Pyodide environment

### Local Storage Keys
- `code_app_mode`: Currently selected mode
- `code_app_mode_custom`: Custom mode settings object
- `code_app_api_key`: User's OpenAI API key