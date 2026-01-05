/**
 * Content script for injecting the Promptly button into the Gemini UI.
 */

console.log("Promptly button loading for Gemini...");

const observer = new MutationObserver(() => {
    // Target the wrapper for the buttons to the left of the prompt input
    const leadingActionsWrapper = document.querySelector('.leading-actions-wrapper');

    // Check if wrapper exists and button hasn't been added yet
    if (leadingActionsWrapper && !leadingActionsWrapper.querySelector("#promptly-btn")) {

        // Create button
        const promptlyButton = document.createElement("button");
        promptlyButton.id = "promptly-btn";
        Object.assign(promptlyButton.style, {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            border: '1px solid transparent',
            backgroundColor: 'transparent',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: '8px',
            padding: '0',
            position: 'relative',
            color: 'var(--gm-color-on-surface-variant)',
            transition: 'background-color 0.3s, transform 0.2s, box-shadow 0.3s',
        });

        // Icon handling
        const iconUrl = chrome.runtime.getURL("icons8-bulb.gif");
        const imgElement = document.createElement('img');
        imgElement.style.cssText = "width: 100%; height: 100%; border-radius: 50%; object-fit: cover; pointer-events: none;";
        imgElement.alt = "Optimize";

        // Prepare static frame
        let staticIconUrl = iconUrl; // Fallback
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const freezerImg = new Image();
        freezerImg.crossOrigin = "Anonymous";
        freezerImg.src = iconUrl;

        freezerImg.onload = () => {
            canvas.width = freezerImg.naturalWidth;
            canvas.height = freezerImg.naturalHeight;
            ctx.drawImage(freezerImg, 0, 0);
            staticIconUrl = canvas.toDataURL();
            // Set initial state to static once generated
            if (!promptlyButton.classList.contains('active')) {
                imgElement.src = staticIconUrl;
            }
        };

        // Initial state (defaults to gif until frozen, or if freeze fails)
        imgElement.src = iconUrl;
        promptlyButton.appendChild(imgElement);

        // Create tooltip
        const tooltip = document.createElement("div");
        tooltip.textContent = "Optimize";
        Object.assign(tooltip.style, {
            position: 'fixed',
            backgroundColor: '#333',
            color: '#fff',
            padding: '4px 8px',
            fontSize: '12px',
            borderRadius: '4px',
            whiteSpace: 'nowrap',
            opacity: '0',
            pointerEvents: 'none',
            transition: 'opacity 0.2s',
            zIndex: '10000',
        });
        document.body.appendChild(tooltip);

        // Tooltip hover effects
        promptlyButton.addEventListener("mouseenter", () => {
            tooltip.style.opacity = '1';
            const rect = promptlyButton.getBoundingClientRect();
            tooltip.style.top = rect.top - tooltip.offsetHeight - 6 + "px";
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + "px";
            promptlyButton.style.backgroundColor = 'var(--gm-color-surface-container-highest)';
        });

        promptlyButton.addEventListener("mouseleave", () => {
            tooltip.style.opacity = '0';
            if (!promptlyButton.classList.contains('active')) {
                promptlyButton.style.backgroundColor = 'transparent';
            }
        });

        // Click handler - toggle active state
        promptlyButton.addEventListener("click", (event) => {
            event.stopPropagation();
            event.preventDefault();

            promptlyButton.classList.toggle('active');

            if (promptlyButton.classList.contains('active')) {
                imgElement.src = iconUrl; // Switch to animated GIF
                promptlyButton.style.boxShadow = "0 0 15px 4px #FFC107"; // Warm halogen glow
                promptlyButton.style.color = "#FFC107";
                promptlyButton.style.backgroundColor = 'var(--gm-color-surface-container-highest)';
                console.log("Promptly activated");

                // --- OPTIMIZATION LOGIC ---
                // Find Gemini input field (rich textarea)
                const inputArea = document.querySelector('.rich-textarea') || document.querySelector('div[contenteditable="true"]');
                if (inputArea) {
                    const originalText = inputArea.innerText;
                    if (originalText && originalText.trim().length > 0) {
                        console.log("Sending text for optimization:", originalText);

                        // Show loading state (optional: maybe change cursor or opacity)
                        promptlyButton.style.cursor = "wait";

                        chrome.runtime.sendMessage({ action: "optimize_prompt", text: originalText }, (response) => {
                            promptlyButton.style.cursor = "pointer";

                            if (chrome.runtime.lastError) {
                                alert("Error: " + chrome.runtime.lastError.message);
                                return;
                            }

                            if (response.error) {
                                alert("Optimization Error: " + response.error);
                                return;
                            }

                            if (response.optimizedText) {
                                try {
                                    inputArea.focus();
                                    // Select all text
                                    const range = document.createRange();
                                    range.selectNodeContents(inputArea);
                                    const sel = window.getSelection();
                                    sel.removeAllRanges();
                                    sel.addRange(range);

                                    // Use execCommand
                                    const success = document.execCommand('insertText', false, response.optimizedText);

                                    if (!success) {
                                        inputArea.innerText = response.optimizedText;
                                        inputArea.dispatchEvent(new Event('input', { bubbles: true }));
                                    }
                                } catch (e) {
                                    console.error("Gemini replacement failed", e);
                                    inputArea.innerText = response.optimizedText;
                                }

                                console.log("Text optimized successfully");
                            }
                        });
                    } else {
                        alert("Please enter a prompt first!");
                        // meaningful interaction done, toggle back? or leave active?
                        // leaving active for now as per user request (loop when clicked)
                    }
                } else {
                    console.error("Could not find Gemini input area");
                }
                // --- END OPTIMIZATION LOGIC ---

            } else {
                imgElement.src = staticIconUrl; // Switch to static frame
                promptlyButton.style.boxShadow = "none";
                promptlyButton.style.color = 'var(--gm-color-on-surface-variant)';
                promptlyButton.style.backgroundColor = 'transparent';
                console.log("Promptly deactivated");

                // Add your custom cleanup here
            }
        });

        // Prepend button to wrapper
        leadingActionsWrapper.prepend(promptlyButton);
    }
});

// Start observing DOM changes
observer.observe(document.body, {
    childList: true,
    subtree: true
});

console.log("Promptly button loaded for Gemini.");