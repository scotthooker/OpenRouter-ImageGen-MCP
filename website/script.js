/**
 * OpenRouter ImageGen MCP Landing Page Scripts
 * Handles interactive features like copy buttons and smooth scrolling
 */

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initializeCopyButtons();
    initializeSmoothScrolling();
    initializeNavHighlight();
});

/**
 * Initialize copy-to-clipboard functionality for code blocks
 */
function initializeCopyButtons() {
    const copyButtons = document.querySelectorAll('.copy-btn');

    copyButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const codeBlock = button.parentElement;
            const code = codeBlock.querySelector('code');

            if (!code) return;

            try {
                await navigator.clipboard.writeText(code.textContent);

                // Visual feedback
                const originalText = button.textContent;
                button.textContent = 'Copied!';
                button.classList.add('copied');

                // Reset after 2 seconds
                setTimeout(() => {
                    button.textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy code:', err);
                button.textContent = 'Failed';

                setTimeout(() => {
                    button.textContent = 'Copy';
                }, 2000);
            }
        });
    });
}

/**
 * Copy code to clipboard (fallback function for onclick)
 */
function copyCode(button) {
    const codeBlock = button.parentElement;
    const code = codeBlock.querySelector('code');

    if (!code) return;

    // Create a temporary textarea
    const textarea = document.createElement('textarea');
    textarea.value = code.textContent;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);

    // Select and copy
    textarea.select();

    try {
        document.execCommand('copy');

        // Visual feedback
        const originalText = button.textContent;
        button.textContent = 'Copied!';
        button.classList.add('copied');

        // Reset after 2 seconds
        setTimeout(() => {
            button.textContent = originalText;
            button.classList.remove('copied');
        }, 2000);
    } catch (err) {
        console.error('Failed to copy code:', err);
        button.textContent = 'Failed';

        setTimeout(() => {
            button.textContent = 'Copy';
        }, 2000);
    } finally {
        document.body.removeChild(textarea);
    }
}

/**
 * Initialize smooth scrolling for anchor links
 */
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip empty or just # hrefs
            if (!href || href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navbarHeight = document.querySelector('.navbar')?.offsetHeight || 0;
                const targetPosition = target.offsetTop - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Highlight active navigation link based on scroll position
 */
function initializeNavHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

    if (sections.length === 0 || navLinks.length === 0) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.style.color = '';
                });

                // Add active class to current section's link
                const activeLink = document.querySelector(
                    `.nav-links a[href="#${entry.target.id}"]`
                );

                if (activeLink) {
                    activeLink.style.color = 'var(--primary-color)';
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}

/**
 * Track analytics events (placeholder for future implementation)
 */
function trackEvent(category, action, label) {
    // Placeholder for analytics integration
    console.log('Event tracked:', { category, action, label });

    // Example: Google Analytics
    // if (window.gtag) {
    //     gtag('event', action, {
    //         event_category: category,
    //         event_label: label
    //     });
    // }
}

/**
 * Add event listeners for tracking
 */
function initializeAnalytics() {
    // Track GitHub button clicks
    document.querySelectorAll('a[href*="github.com"]').forEach(link => {
        link.addEventListener('click', () => {
            trackEvent('Outbound Link', 'Click', 'GitHub Repository');
        });
    });

    // Track installation section interactions
    const installationSection = document.querySelector('#installation');
    if (installationSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    trackEvent('Engagement', 'View', 'Installation Section');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(installationSection);
    }
}

// Initialize analytics tracking
initializeAnalytics();

// Export functions for global use
window.copyCode = copyCode;
window.trackEvent = trackEvent;
