# Code Assistant

A simple web application that helps you code with AI. This app provides an interactive interface to communicate with OpenAI's language models, specifically tailored for coding assistance and learning.

## Features

- **Multiple Specialized Modes**:
  - **Default Mode**: Python coding assistance with code examples and explanations
  - **Math Mode**: Mathematics assistance focusing on linear algebra, calculus, and engineering math
  - **Flashcard Mode**: Creates interactive flashcards to help learn Python concepts
  - **Custom Mode**: Fully customizable settings for personalized AI interactions

- **Customization Options**:
  - System prompts to define AI behavior
  - Default user prompts and assistant messages
  - Temperature settings to control response randomness
  - Model selection (gpt-4o-mini, gpt-4o, gpt-3.5-turbo)
  - Custom user prompt templates

- **User Interface Features**:
  - Syntax highlighting for code snippets
  - Copy-to-clipboard functionality for code
  - Interactive follow-up suggestion buttons
  - Session download capability
  - Mobile-responsive design

- **Technical Features**:
  - Markdown rendering with Showdown.js
  - Mathematical formula rendering with KaTeX
  - Code syntax highlighting with Prism.js
  - Bootstrap 5 for responsive layout

## Requirements

- An OpenAI API Key is required to use this application
- Modern web browser with JavaScript enabled

## Usage

1. Open the application in your browser
2. Enter your OpenAI API Key when prompted (stored locally in your browser)
3. Select a mode from the dropdown menu in the top-right corner
4. Type your question or prompt in the input field at the bottom
5. Press Enter or click the chat button to submit
6. Interact with the AI responses and suggested follow-up prompts

## Customization

To customize the app:

1. Select "Custom" from the mode dropdown
2. Click the "Custom" button that appears
3. Modify any of the following settings:
   - System prompt (instructions for the AI)
   - Default assistant message (initial greeting)
   - Default user prompt (pre-filled in the input field)
   - User prompt format (formatting instructions)
   - Temperature (randomness of responses)
   - Model (AI model selection)
   - User prompts (suggested prompts for random selection)
4. Click "Save" to apply your changes

## Local Storage

The app uses your browser's local storage to save:
- Your OpenAI API Key
- Current app mode selection
- Custom mode settings

You can clear the cache using the "Clear cache" link at the bottom of the page.
