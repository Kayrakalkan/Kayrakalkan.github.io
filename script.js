// ============================================
// macOS Portfolio - Navigation & Interactions
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ============================================
    // Menu Bar Date/Time
    // ============================================
    
    const menubarDateTime = document.getElementById('menubarDateTime');
    
    function updateDateTime() {
        const now = new Date();
        const options = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        };
        const dateTimeStr = now.toLocaleString('en-US', options)
            .replace(',', '')  // Remove comma after day
            .replace('AM', 'AM')
            .replace('PM', 'PM');
        
        if (menubarDateTime) {
            menubarDateTime.querySelector('.datetime-text').textContent = dateTimeStr;
        }
    }
    
    // Update immediately
    updateDateTime();
    
    // Update every minute
    setInterval(updateDateTime, 60000);
    
    
    // ============================================
    // Smooth Scroll & Active Navigation
    // ============================================
    
    const navLinks = document.querySelectorAll('.sidebar nav ul li a');
    const sections = document.querySelectorAll('.content-section');
    const mainContent = document.querySelector('.main-content');
    
    // Update active navigation on scroll
    function updateActiveNav() {
        let current = '';
        const scrollPosition = mainContent.scrollTop;
        const scrollHeight = mainContent.scrollHeight;
        const clientHeight = mainContent.clientHeight;
        
        // Check if scrolled to bottom (within 50px threshold)
        const isAtBottom = scrollHeight - scrollPosition - clientHeight < 50;
        
        if (isAtBottom) {
            // If at bottom, highlight the last section (Contact)
            current = 'contact';
        } else {
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop - 100) {
                    current = section.getAttribute('id');
                }
            });
        }
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Smooth scroll to section
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Scroll with proper offset to show section title
                const offsetTop = targetSection.offsetTop - 80;
                
                mainContent.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update active state immediately
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Listen for scroll events
    mainContent.addEventListener('scroll', updateActiveNav);
    
    // Set initial active state
    updateActiveNav();
    
    
    // ============================================
    // Control Center Dropdown
    // ============================================
    
    const controlCenterTrigger = document.querySelector('.control-center-trigger');
    const controlCenterDropdown = document.getElementById('controlCenterDropdown');
    
    if (controlCenterTrigger && controlCenterDropdown) {
        controlCenterTrigger.addEventListener('click', function(e) {
            e.stopPropagation();
            const isActive = controlCenterDropdown.classList.contains('show');
            
            if (isActive) {
                controlCenterDropdown.classList.remove('show');
                controlCenterTrigger.classList.remove('active');
            } else {
                controlCenterDropdown.classList.add('show');
                controlCenterTrigger.classList.add('active');
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!controlCenterDropdown.contains(e.target) && 
                !controlCenterTrigger.contains(e.target)) {
                controlCenterDropdown.classList.remove('show');
                controlCenterTrigger.classList.remove('active');
            }
        });
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && controlCenterDropdown.classList.contains('show')) {
                controlCenterDropdown.classList.remove('show');
                controlCenterTrigger.classList.remove('active');
            }
        });
    }
    
    
    // ============================================
    // Control Center Features
    // ============================================
    
    const darkModeToggle = document.getElementById('darkModeToggle');
    const airdropBtn = document.getElementById('airdropBtn');
    const macosWindow = document.querySelector('.macos-window');
    
    // Dark Mode Toggle
    if (darkModeToggle) {
        // Check for saved dark mode preference
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        darkModeToggle.checked = isDarkMode;
        if (isDarkMode) {
            document.body.classList.add('dark-mode');
        }
        
        darkModeToggle.addEventListener('change', function() {
            if (this.checked) {
                document.body.classList.add('dark-mode');
                localStorage.setItem('darkMode', 'true');
                applyDarkMode();
            } else {
                document.body.classList.remove('dark-mode');
                localStorage.setItem('darkMode', 'false');
                removeDarkMode();
            }
        });
    }
    
    function applyDarkMode() {
        document.documentElement.style.setProperty('--macos-bg', '#1c1c1e');
        document.documentElement.style.setProperty('--macos-window-bg', '#2c2c2e');
        document.documentElement.style.setProperty('--macos-sidebar-bg', '#252525');
        document.documentElement.style.setProperty('--macos-card-bg', '#2c2c2e');
        document.documentElement.style.setProperty('--macos-text-primary', '#f5f5f7');
        document.documentElement.style.setProperty('--macos-text-secondary', '#aeaeb2');
        document.documentElement.style.setProperty('--macos-border', '#38383a');
    }
    
    function removeDarkMode() {
        document.documentElement.style.setProperty('--macos-bg', '#f5f5f7');
        document.documentElement.style.setProperty('--macos-window-bg', '#ffffff');
        document.documentElement.style.setProperty('--macos-sidebar-bg', '#f9f9f9');
        document.documentElement.style.setProperty('--macos-card-bg', '#ffffff');
        document.documentElement.style.setProperty('--macos-text-primary', '#1d1d1f');
        document.documentElement.style.setProperty('--macos-text-secondary', '#6e6e73');
        document.documentElement.style.setProperty('--macos-border', '#e5e5e5');
    }
    
    // AirDrop Share
    if (airdropBtn) {
        airdropBtn.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: "Kayra's Portfolio",
                    text: 'Check out my portfolio!',
                    url: window.location.href
                }).then(() => {
                    showNotification('Shared successfully!', 'success');
                }).catch(err => {
                    console.log('Share cancelled');
                });
            } else {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(window.location.href).then(() => {
                    showNotification('Link copied to clipboard!', 'success');
                });
            }
        });
    }
    
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 30px;
            background: ${type === 'success' ? '#28ca42' : '#ff5f57'};
            color: white;
            padding: 16px 24px;
            border-radius: 10px;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Add animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                opacity: 0;
                transform: translateX(100px);
            }
            to {
                opacity: 1;
                transform: translateX(0);
            }
        }
        
        @keyframes slideOutRight {
            from {
                opacity: 1;
                transform: translateX(0);
            }
            to {
                opacity: 0;
                transform: translateX(100px);
            }
        }
    `;
    document.head.appendChild(style);
    
    
    // ============================================
    // Traffic Light Buttons (Optional Actions)
    // ============================================
    
    const closeBtn = document.querySelector('.traffic-lights .close');
    const minimizeBtn = document.querySelector('.traffic-lights .minimize');
    const maximizeBtn = document.querySelector('.traffic-lights .maximize');
    
    // Close button - show alert (can be customized)
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            if (confirm('Are you sure you want to close this window?')) {
                window.location.href = 'about:blank';
            }
        });
    }
    
    // Minimize button - scroll to top
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', function() {
            mainContent.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Maximize button - toggle fullscreen
    if (maximizeBtn) {
        maximizeBtn.addEventListener('click', function() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen();
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });
    }
    
    
    // ============================================
    // Project Cards - Direct GitHub Link
    // ============================================
    
    const projectCards = document.querySelectorAll('.project-box.card');
    
    projectCards.forEach(card => {
        // Add cursor pointer and visual feedback
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', function(e) {
            // Prevent default if clicking on a link inside
            if (e.target.tagName === 'A') return;
            
            const githubUrl = this.getAttribute('data-github');
            if (githubUrl) {
                window.open(githubUrl, '_blank');
            }
        });
        
        // Add hover effect enhancement
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    
    // ============================================
    // Card Hover Effects Enhancement
    // ============================================
    
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.25s ease';
        });
        
        // Add ripple on non-project cards for visual feedback
        if (!card.classList.contains('project-box')) {
            card.addEventListener('click', function(e) {
                const feedback = document.createElement('div');
                feedback.className = 'click-feedback';
                feedback.style.cssText = `
                    position: absolute;
                    top: ${e.offsetY}px;
                    left: ${e.offsetX}px;
                    width: 10px;
                    height: 10px;
                    background: rgba(0, 122, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                this.style.position = 'relative';
                this.appendChild(feedback);
                
                setTimeout(() => feedback.remove(), 600);
            });
        }
    });
    
    // Add animations to document head only once
    if (!document.getElementById('custom-animations')) {
        const animationStyles = document.createElement('style');
        animationStyles.id = 'custom-animations';
        animationStyles.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(20);
                    opacity: 0;
                }
            }
            
            .card.expanded {
                grid-column: 1 / -1;
                z-index: 10;
            }
            
            @media (max-width: 768px) {
                .card.expanded {
                    grid-column: auto;
                }
            }
        `;
        document.head.appendChild(animationStyles);
    }
    
    
    // ============================================
    // Responsive Mobile Menu Toggle (if needed)
    // ============================================
    
    // Check if mobile view
    function isMobile() {
        return window.innerWidth <= 768;
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        updateActiveNav();
    });
    
});
