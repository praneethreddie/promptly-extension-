# Promptly

**Optimize your prompts with AI.**

Promptly is a powerful browser extension designed to help you write better prompts for Advanced LLMs. It integrates directly into the chat interfaces of **ChatGPT**, **Claude**, and **Gemini**, allowing you to optimize your prompts with a single click.

## Features

-   **Deep Integration**: Adds an "Optimize" button directly into the text input area of popular AI chat platforms.
-   **Multi-Provider Support**: Choose your preferred AI backend to power the optimization:
    -   Google Gemini
    -   Anthropic Claude
    -   OpenAI (GPT-3.5/4)
    -   Custom API Endpoint (compatible with OpenAI format)
    -   Default (Free OpenRouter tier)
-   **Privacy Focused**: API keys are stored locally in your browser and never sent to our servers.
-   **Customizable**: Use your own API keys for full control.

## Installation

Since this extension is in development/local mode, you can install it via Chrome's Developer Mode:

1.  **Download/Clone** this repository to your local machine.
2.  Open Google Chrome and navigate to `chrome://extensions`.
3.  Toggle **Developer mode** on (top right corner switch).
4.  Click the **Load unpacked** button (top left).
5.  Select the folder where you saved this project (the folder containing `manifest.json`).
6.  The "Promptly" extension should now appear in your list.

## Configuration

Before using the extension, you need to configure it with an AI provider:

1.  Click the **Promptly icon** in your browser's toolbar (puzzle piece icon -> Promptly).
2.  In the popup window:
    -   Select your **AI Provider** from the dropdown.
    -   Enter the corresponding **API Key** (e.g., your Gemini API key).
    -   *Optional*: For "Custom Endpoint", enter your custom URL and Model name.
3.  Click **Save Settings**.

## Usage

1.  Navigate to one of the supported platforms:
    -   [ChatGPT](https://chatgpt.com)
    -   [Claude](https://claude.ai)
    -   [Gemini](https://gemini.google.com)
2.  Type your rough idea or draft prompt into the chat box.
3.  Look for the **"Lightbulb" icon** button (usually next to the submit button).
4.  Click the button. The extension will process your text and replace it with a structured, detailed, and optimized version of your prompt.
5.  Review the optimized prompt and hit send!

## Developer Guide

### Project Structure

-   `manifest.json`: Configuration file defining permissions, scripts, and extension metadata (Manifest V3).
-   `background.js`: Service worker that handles API calls to AI providers to avoid CORS issues and manage secrets secure usage.
-   `content.js`: Content script specifically for **ChatGPT**.
-   `claude-content.js`: Content script for **Claude**.
-   `gemini-content.js`: Content script for **Gemini**.
-   `popup.html` / `popup.js`: The settings UI handling provider selection and API key storage.

### How to Add a New API Provider

To extend functionality to a new AI provider, follow these steps:

1.  **Update `manifest.json`**:
    -   Add the new API's domain to `host_permissions` to allow the background script to fetch data.
    -   Add the domain to `connect-src` in `content_security_policy` if required.

2.  **Update User Interface**:
    -   In `popup.html`, add a new `<option>` to the `#provider` select element.
    -   In `popup.js`, add logic to show/hide the input field for the new provider's API key.

3.  **Implement Logic in `background.js`**:
    -   In `handleOptimizePrompt()`, add a `case` for your new provider.
    -   Create a new async function (e.g., `callNewProvider(apiKey, prompt)`) that handles the `fetch` request to the API.
    -   Ensure the response is parsed correctly and just the text content is returned.

## Technologies Used

-   **Frontend**: HTML, CSS, Vanilla JavaScript (no frameworks required).
-   **Extension API**: Chrome Extension Manifest V3.
-   **Backend**: None (Serverless architecture; runs entirely client-side interacting directly with public APIs).

---

*Verified locally on Windows environment.*
