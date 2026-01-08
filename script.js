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
                const offsetTop = targetSection.offsetTop - 150;
                
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
    // Project Cards - Modal Popup
    // ============================================
    
    const projectCards = document.querySelectorAll('.project-box.card');
    const projectModal = document.getElementById('projectModal');
    const modalClose = projectModal ? projectModal.querySelector('.modal-close') : null;
    const modalOverlay = projectModal;
    
    projectCards.forEach(card => {
        // Add cursor pointer
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', function(e) {
            // Prevent default if clicking on a link inside
            if (e.target.tagName === 'A') return;
            
            // Get project data
            const projectTitle = this.querySelector('h3').textContent;
            const projectDescription = this.querySelector('p').textContent;
            const githubUrl = this.getAttribute('data-github');
            const techTags = Array.from(this.querySelectorAll('.tech-tag')).map(tag => tag.textContent);
            
            // Populate modal
            if (projectModal) {
                projectModal.querySelector('#modalTitle').textContent = projectTitle;
                projectModal.querySelector('#modalDescription').textContent = projectDescription;
                
                // Add tech tags
                const modalSkills = projectModal.querySelector('#modalSkills');
                modalSkills.innerHTML = '';
                techTags.forEach(tech => {
                    const tag = document.createElement('span');
                    tag.className = 'tech-tag';
                    tag.textContent = tech;
                    modalSkills.appendChild(tag);
                });
                
                // Set GitHub link
                const githubButton = projectModal.querySelector('#modalGithubLink');
                if (githubUrl && githubButton) {
                    githubButton.onclick = () => window.open(githubUrl, '_blank');
                    githubButton.style.display = 'inline-flex';
                } else if (githubButton) {
                    githubButton.style.display = 'none';
                }
                
                // Show modal
                projectModal.classList.add('show');
                document.body.style.overflow = 'hidden';
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
    
    // Close modal handlers
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            projectModal.classList.remove('show');
            document.body.style.overflow = '';
        });
    }
    
    if (projectModal) {
        // Close when clicking outside modal content
        projectModal.addEventListener('click', function(e) {
            if (e.target === projectModal) {
                projectModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
        
        // Close modal button
        const modalCloseBtn = projectModal.querySelector('#modalClose');
        if (modalCloseBtn) {
            modalCloseBtn.addEventListener('click', function() {
                projectModal.classList.remove('show');
                document.body.style.overflow = '';
            });
        }
        
        // Close on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && projectModal.classList.contains('show')) {
                projectModal.classList.remove('show');
                document.body.style.overflow = '';
            }
        });
    }
    
    
    // ============================================
    // Card Hover Effects Enhancement
    // ============================================
    
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.25s ease';
        });
    });
    
    // Add animations to document head only once
    if (!document.getElementById('custom-animations')) {
        const animationStyles = document.createElement('style');
        animationStyles.id = 'custom-animations';
        animationStyles.textContent = `
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
    // Clickable Cards with External Links
    // ============================================
    
    const clickableCards = document.querySelectorAll('.clickable-card');
    
    clickableCards.forEach(card => {
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', function(e) {
            // Prevent if clicking on a link inside the card
            if (e.target.tagName === 'A') return;
            
            const link = this.getAttribute('data-link');
            if (link) {
                window.open(link, '_blank');
            }
        });
        
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-4px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    
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
    
    // ============================================
    // CV Viewer Modal
    // ============================================
    
    const cvModal = document.getElementById('cvModal');
    const openCvModalBtn = document.getElementById('openCvModal');
    const closeCvModalBtn = document.getElementById('closeCvModal');
    const cvIframe = document.getElementById('cvIframe');
    const cvLoading = document.getElementById('cvLoading');
    
    // Open CV modal
    if (openCvModalBtn) {
        openCvModalBtn.addEventListener('click', function() {
            cvModal.classList.add('show');
            cvLoading.style.display = 'flex';
            
            // Google Docs Viewer URL
            const githubRawUrl = 'https://raw.githubusercontent.com/Kayrakalkan/Kayrakalkan.github.io/main/cv.pdf';
            const googleViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(githubRawUrl)}&embedded=true`;
            
            cvIframe.src = googleViewerUrl;
            document.body.style.overflow = 'hidden';
            
            // Hide loading after iframe loads
            cvIframe.onload = function() {
                setTimeout(() => {
                    cvLoading.style.display = 'none';
                }, 500);
            };
        });
    }
    
    // Close CV modal
    function closeCvModal() {
        cvModal.classList.remove('show');
        cvIframe.src = '';
        cvLoading.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    if (closeCvModalBtn) {
        closeCvModalBtn.addEventListener('click', closeCvModal);
    }
    
    // Close CV modal when clicking outside
    cvModal.addEventListener('click', function(e) {
        if (e.target === cvModal) {
            closeCvModal();
        }
    });
    
    // Close CV modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && cvModal.classList.contains('show')) {
            closeCvModal();
        }
    });
    
});
