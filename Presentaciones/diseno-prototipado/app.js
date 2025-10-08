// Software Engineering Design and Prototyping Presentation JavaScript

class TechnicalPresentationApp {
    constructor() {
        this.currentSection = 0;
        this.sections = [
            'introduction', 'sdlc-phase', 'importance', 'challenges', 
            'high-level-diagram', 'data-flow-diagram', 'low-level-diagram', 
            'ui-ux', 'wireframe-diagram', 'fidelity-comparison', 'database-schema'
        ];
        this.sectionDurations = [1, 7, 3, 3, 6, 5, 4, 7, 5, 8, 4]; // minutes
        this.totalSections = this.sections.length;
        this.isOnCover = true;
        this.sectionStartTime = null;
        this.totalElapsedTime = 0;
        this.sectionTimer = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
        this.updateSectionCounter();
        this.handleKeyboardNavigation();
        this.initResponsiveFeatures();
        
        // Show cover by default
        this.showCover();
        this.updateNavigationButtons();
        this.startTotalTimer();
        
        console.log('🎓 Technical Software Engineering Presentation initialized');
        console.log(`📚 ${this.totalSections} sections covering Design and Prototyping in SDLC`);
    }

    bindEvents() {
        // Menu toggle
        const menuToggle = document.getElementById('menuToggle');
        const sidebar = document.getElementById('sidebar');
        
        if (menuToggle && sidebar) {
            menuToggle.addEventListener('click', () => this.toggleSidebar());
        }

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionIndex = parseInt(link.dataset.section);
                this.goToSection(sectionIndex);
            });
        });

        // Navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.previousSection());
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextSection());
        }

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const menuToggle = document.getElementById('menuToggle');
            
            if (sidebar && menuToggle && 
                !sidebar.contains(e.target) && 
                !menuToggle.contains(e.target) && 
                sidebar.classList.contains('open') &&
                window.innerWidth <= 768) {
                this.closeSidebar();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                this.closeSidebar();
            }
        });

        // Handle visibility change for timer
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseTimer();
            } else {
                this.resumeTimer();
            }
        });
    }

    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        
        if (sidebar && menuToggle) {
            sidebar.classList.toggle('open');
            menuToggle.classList.toggle('active');
        }
    }

    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const menuToggle = document.getElementById('menuToggle');
        
        if (sidebar && menuToggle) {
            sidebar.classList.remove('open');
            menuToggle.classList.remove('active');
        }
    }

    showCover() {
        // Hide all sections
        document.querySelectorAll('.presentation-section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show cover
        const cover = document.getElementById('cover');
        if (cover) {
            cover.classList.add('active');
        }
        
        this.isOnCover = true;
        this.currentSection = 0;
        this.stopSectionTimer();
        
        // Update navigation
        this.updateNavLinks(-1); // -1 for cover
        this.updateProgress();
        this.updateSectionCounter();
        this.updateNavigationButtons();
        
        // Announce to screen readers
        this.announceToScreenReader('Presentación iniciada - Portada');
    }

    goToSection(sectionIndex) {
        if (sectionIndex < 0 || sectionIndex >= this.totalSections) {
            return;
        }

        // Stop current section timer
        this.stopSectionTimer();

        // Hide cover
        const cover = document.getElementById('cover');
        if (cover) {
            cover.classList.remove('active');
        }

        // Hide all sections
        document.querySelectorAll('.presentation-section').forEach(section => {
            section.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(this.sections[sectionIndex]);
        if (targetSection) {
            targetSection.classList.add('active');
            
            // Add entrance animation
            this.addSectionAnimation(targetSection);
        }

        this.currentSection = sectionIndex;
        this.isOnCover = false;
        this.updateNavLinks(sectionIndex);
        this.updateProgress();
        this.updateSectionCounter();
        this.updateNavigationButtons();
        
        // Start section timer
        this.startSectionTimer();
        
        // Close sidebar on mobile
        if (window.innerWidth <= 768) {
            this.closeSidebar();
        }

        // Scroll to top smoothly
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Announce section change
        const sectionTitle = targetSection.querySelector('.section-title')?.textContent || `Sección ${sectionIndex + 1}`;
        this.announceToScreenReader(`Navegando a: ${sectionTitle}`);
        
        // Log section access for analytics
        console.log(`📍 Section ${sectionIndex + 1}: ${this.sections[sectionIndex]} (${this.sectionDurations[sectionIndex]} min)`);
    }

    nextSection() {
        // If on cover, go to first section
        if (this.isOnCover) {
            this.goToSection(0);
            return;
        }

        if (this.currentSection < this.totalSections - 1) {
            this.goToSection(this.currentSection + 1);
        } else {
            // End of presentation
            this.showPresentationComplete();
        }
    }

    previousSection() {
        // If on first section, go to cover
        if (this.currentSection === 0 && !this.isOnCover) {
            this.showCover();
            return;
        }

        if (this.currentSection > 0) {
            this.goToSection(this.currentSection - 1);
        }
    }

    updateNavLinks(activeIndex) {
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            link.classList.toggle('active', index === activeIndex);
        });
    }

    updateProgress() {
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            let progress = 0;
            
            if (this.isOnCover) {
                progress = 0;
            } else {
                progress = ((this.currentSection + 1) / this.totalSections) * 100;
            }
            
            progressBar.style.width = `${progress}%`;
        }
    }

    updateSectionCounter() {
        const currentSectionEl = document.getElementById('currentSection');
        const totalSectionsEl = document.getElementById('totalSections');
        
        if (currentSectionEl && totalSectionsEl) {
            if (this.isOnCover) {
                currentSectionEl.textContent = '0';
            } else {
                currentSectionEl.textContent = this.currentSection + 1;
            }
            
            totalSectionsEl.textContent = this.totalSections;
        }
    }

    updateNavigationButtons() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn) {
            if (this.isOnCover) {
                prevBtn.style.display = 'none';
            } else {
                prevBtn.style.display = 'flex';
                prevBtn.disabled = false;
            }
        }
        
        if (nextBtn) {
            nextBtn.style.display = 'flex';
            
            if (this.isOnCover) {
                nextBtn.disabled = false;
                nextBtn.innerHTML = 'Comenzar <span>→</span>';
            } else if (this.currentSection >= this.totalSections - 1) {
                nextBtn.disabled = false;
                nextBtn.innerHTML = 'Finalizar <span>✓</span>';
            } else {
                nextBtn.disabled = false;
                nextBtn.innerHTML = 'Siguiente <span>→</span>';
            }
        }
    }

    // Timer functionality
    startTotalTimer() {
        this.totalStartTime = Date.now();
        this.updateTotalTimer();
        
        // Update total timer every second
        setInterval(() => {
            this.updateTotalTimer();
        }, 1000);
    }

    updateTotalTimer() {
        if (!this.totalStartTime) return;
        
        const elapsed = Date.now() - this.totalStartTime + this.totalElapsedTime;
        const totalTimeEl = document.getElementById('totalTime');
        
        if (totalTimeEl) {
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            totalTimeEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        }
    }

    startSectionTimer() {
        this.sectionStartTime = Date.now();
        this.updateSectionTimer();
        
        // Clear existing timer
        if (this.sectionTimer) {
            clearInterval(this.sectionTimer);
        }
        
        // Update section timer every second
        this.sectionTimer = setInterval(() => {
            this.updateSectionTimer();
        }, 1000);
    }

    stopSectionTimer() {
        if (this.sectionTimer) {
            clearInterval(this.sectionTimer);
            this.sectionTimer = null;
        }
    }

    updateSectionTimer() {
        if (!this.sectionStartTime || this.isOnCover) return;
        
        const elapsed = Date.now() - this.sectionStartTime;
        const sectionTimerEl = document.getElementById('sectionTimer');
        
        if (sectionTimerEl) {
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            const expectedMinutes = this.sectionDurations[this.currentSection];
            
            sectionTimerEl.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            // Change color if over expected time
            if (minutes >= expectedMinutes) {
                sectionTimerEl.style.color = 'var(--color-warning)';
                sectionTimerEl.style.fontWeight = 'var(--font-weight-bold)';
            } else {
                sectionTimerEl.style.color = '';
                sectionTimerEl.style.fontWeight = '';
            }
        }
    }

    pauseTimer() {
        if (this.sectionTimer) {
            clearInterval(this.sectionTimer);
        }
    }

    resumeTimer() {
        if (!this.isOnCover && this.sectionStartTime) {
            this.startSectionTimer();
        }
    }

    // Animation and visual enhancements
    addSectionAnimation(section) {
        const elements = section.querySelectorAll('.card, .importance-card, .problem-card, .diagram-type-card, .element-card');
        
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            
            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100 + 200);
        });
    }

    // Keyboard navigation
    handleKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Only handle if not typing in an input
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
                return;
            }
            
            switch(e.key) {
                case 'ArrowRight':
                case ' ': // Space key
                    e.preventDefault();
                    this.nextSection();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    this.previousSection();
                    break;
                case 'Home':
                    e.preventDefault();
                    this.showCover();
                    break;
                case 'End':
                    e.preventDefault();
                    this.goToSection(this.totalSections - 1);
                    break;
                case 'Escape':
                    e.preventDefault();
                    this.closeSidebar();
                    break;
                case 'f':
                case 'F':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        this.toggleFullscreen();
                    }
                    break;
            }
        });
    }

    // Responsive features
    initResponsiveFeatures() {
        // Add touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            this.handleSwipe();
        });
        
        const handleSwipe = () => {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;
            
            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    // Swipe left - next section
                    this.nextSection();
                } else {
                    // Swipe right - previous section
                    this.previousSection();
                }
            }
        };
        
        this.handleSwipe = handleSwipe;
    }

    // Accessibility features
    announceToScreenReader(message) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }

    // Fullscreen functionality
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen not supported');
            });
        } else {
            document.exitFullscreen();
        }
    }

    // Presentation completion
    showPresentationComplete() {
        this.stopSectionTimer();
        
        // Create completion overlay
        const overlay = document.createElement('div');
        overlay.className = 'presentation-complete-overlay';
        overlay.innerHTML = `
            <div class="completion-content">
                <h2>🎓 Presentación Completada</h2>
                <p>Diseño y Prototipado en Ingeniería de Software</p>
                <div class="completion-stats">
                    <div class="stat-item">
                        <strong>${this.totalSections}</strong>
                        <span>Secciones cubiertas</span>
                    </div>
                    <div class="stat-item">
                        <strong>45 min</strong>
                        <span>Duración planificada</span>
                    </div>
                    <div class="stat-item">
                        <strong>100%</strong>
                        <span>Progreso</span>
                    </div>
                </div>
                <div class="completion-actions">
                    <button class="btn btn--primary" onclick="window.presentationApp.restartPresentation()">
                        Reiniciar Presentación
                    </button>
                </div>
            </div>
        `;
        
        // Add styles for overlay
        const styles = `
            .presentation-complete-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                backdrop-filter: blur(10px);
            }
            .completion-content {
                background: var(--color-surface);
                padding: var(--space-32);
                border-radius: var(--radius-lg);
                text-align: center;
                max-width: 500px;
                border: 2px solid var(--color-primary);
                box-shadow: var(--shadow-lg);
            }
            .completion-content h2 {
                color: var(--color-primary);
                margin-bottom: var(--space-16);
            }
            .completion-content p {
                color: var(--color-text-secondary);
                margin-bottom: var(--space-24);
            }
            .completion-stats {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: var(--space-16);
                margin-bottom: var(--space-24);
            }
            .stat-item {
                text-align: center;
            }
            .stat-item strong {
                display: block;
                font-size: var(--font-size-2xl);
                color: var(--color-primary);
                font-family: var(--font-family-mono);
            }
            .stat-item span {
                font-size: var(--font-size-xs);
                color: var(--color-text-secondary);
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
        
        document.body.appendChild(overlay);
        
        this.announceToScreenReader('Presentación completada exitosamente');
    }

    restartPresentation() {
        // Remove completion overlay
        const overlay = document.querySelector('.presentation-complete-overlay');
        if (overlay) {
            overlay.remove();
        }
        
        // Reset state
        this.totalElapsedTime = 0;
        this.currentSection = 0;
        this.showCover();
        
        console.log('🔄 Presentación reiniciada');
    }

    // Utility methods
    getCurrentSectionInfo() {
        if (this.isOnCover) {
            return {
                title: 'Portada',
                duration: 0,
                progress: 0
            };
        }
        
        return {
            title: this.sections[this.currentSection],
            duration: this.sectionDurations[this.currentSection],
            progress: ((this.currentSection + 1) / this.totalSections) * 100
        };
    }

    // Export functionality for academic use
    exportPresentationData() {
        const data = {
            title: 'Diseño y Prototipado en Ingeniería de Software',
            totalSections: this.totalSections,
            sections: this.sections.map((section, index) => ({
                id: section,
                title: section.replace('-', ' ').toUpperCase(),
                duration: this.sectionDurations[index],
                order: index + 1
            })),
            totalDuration: this.sectionDurations.reduce((sum, duration) => sum + duration, 0),
            currentProgress: this.getCurrentSectionInfo()
        };
        
        console.log('📊 Presentation Data:', data);
        return data;
    }
}

// Global functions for HTML onclick handlers
function startPresentation() {
    if (window.presentationApp) {
        window.presentationApp.goToSection(0);
    }
}

function nextSection() {
    if (window.presentationApp) {
        window.presentationApp.nextSection();
    }
}

function previousSection() {
    if (window.presentationApp) {
        window.presentationApp.previousSection();
    }
}

// Enhanced interaction handlers
class InteractionEnhancer {
    constructor() {
        this.init();
    }

    init() {
        this.addHoverEffects();
        this.addClickEffects();
        this.addScrollAnimations();
        this.initAccessibilityFeatures();
    }

    addHoverEffects() {
        // Add hover effects to interactive elements
        const interactiveElements = document.querySelectorAll(
            '.card, .importance-card, .problem-card, .role-card, .overview-card, .diagram-type-card'
        );
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.transform = 'translateY(-4px)';
                element.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translateY(0)';
            });
        });
    }

    addClickEffects() {
        // Add click ripple effect to buttons
        const buttons = document.querySelectorAll('.btn, .nav-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                const ripple = document.createElement('span');
                const rect = button.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                    z-index: 1;
                `;
                
                if (getComputedStyle(button).position === 'static') {
                    button.style.position = 'relative';
                }
                button.style.overflow = 'hidden';
                
                button.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    addScrollAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements for animation
        const animateElements = document.querySelectorAll(
            '.metric-card, .stat-card, .element-card, .c4-level, .level-item'
        );
        
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(el);
        });
    }

    initAccessibilityFeatures() {
        // Add ARIA labels to navigation elements
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach((link, index) => {
            const sectionName = link.textContent.trim();
            link.setAttribute('aria-label', `Ir a la sección ${index + 1}: ${sectionName}`);
        });

        // Add focus indicators
        const focusableElements = document.querySelectorAll('button, a, [tabindex]');
        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid var(--color-primary)';
                element.style.outlineOffset = '2px';
            });
            
            element.addEventListener('blur', () => {
                element.style.outline = '';
                element.style.outlineOffset = '';
            });
        });
    }
}

// CSS animations and styles
const additionalStyles = `
@keyframes ripple {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-in {
    opacity: 1 !important;
    transform: translateY(0) !important;
}

/* Loading states */
.loading {
    opacity: 0.6;
    pointer-events: none;
}

.loading::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 20px;
    height: 20px;
    margin: -10px 0 0 -10px;
    border: 2px solid var(--color-primary);
    border-top: 2px solid transparent;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
    .section-number,
    .nav-link.active,
    .btn--primary {
        border: 2px solid currentColor;
    }
}

/* Reduced motion support */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
    }
}

/* Print styles for academic use */
@media print {
    .header,
    .sidebar,
    .navigation-controls {
        display: none !important;
    }
    
    .main-content {
        margin-left: 0 !important;
        padding-top: 0 !important;
    }
    
    .presentation-section {
        display: block !important;
        page-break-after: always;
    }
    
    .section-header {
        border-bottom: 2px solid #000;
        margin-bottom: 20px;
    }
}
`;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add additional styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = additionalStyles;
    document.head.appendChild(styleSheet);
    
    // Initialize applications
    window.presentationApp = new TechnicalPresentationApp();
    new InteractionEnhancer();
    
    // Add loading complete class for smooth transitions
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
    
    // Log initialization
    console.log('🚀 Software Engineering Presentation System Ready');
    console.log('⌨️  Keyboard shortcuts:');
    console.log('   → or Space: Next section');
    console.log('   ←: Previous section');
    console.log('   Home: Go to cover');
    console.log('   End: Go to last section');
    console.log('   Escape: Close sidebar');
    console.log('   Ctrl+F: Toggle fullscreen');
    console.log('📱 Touch: Swipe left/right to navigate');
});

// Performance monitoring for academic metrics
class PresentationMetrics {
    constructor() {
        this.startTime = Date.now();
        this.sectionTimes = {};
        this.interactions = [];
    }
    
    recordSectionTime(section, duration) {
        this.sectionTimes[section] = duration;
    }
    
    recordInteraction(type, target) {
        this.interactions.push({
            type,
            target,
            timestamp: Date.now() - this.startTime
        });
    }
    
    getMetrics() {
        return {
            totalTime: Date.now() - this.startTime,
            sectionTimes: this.sectionTimes,
            interactions: this.interactions,
            performance: {
                avgSectionTime: Object.values(this.sectionTimes).reduce((a, b) => a + b, 0) / Object.keys(this.sectionTimes).length || 0,
                totalInteractions: this.interactions.length
            }
        };
    }
}

window.presentationMetrics = new PresentationMetrics();