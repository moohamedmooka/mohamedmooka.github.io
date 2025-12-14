// projects-handler.js - Handle Project Navigation & Interactions

class ProjectsHandler {
    constructor() {
        this.projects = [];
        this.currentProjectIndex = 0;
    }

    init() {
        this.initProjectCards();
        this.initProjectNavigation();
        this.initProjectRating();
        this.trackProjectViews();
        this.setupProjectGallery();
    }

    initProjectCards() {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach((card, index) => {
            this.projects.push({
                id: index,
                element: card,
                title: card.querySelector('.project-title')?.textContent || `Project ${index + 1}`
            });

            // Make entire card clickable
            card.style.cursor = 'pointer';
            
            card.addEventListener('click', (e) => {
                this.handleProjectClick(e, card);
            });
            
            // Hover effects
            card.addEventListener('mouseenter', () => {
                this.animateCardHover(card);
            });
            
            card.addEventListener('mouseleave', () => {
                this.resetCardHover(card);
            });
        });
    }

    handleProjectClick(e, card) {
        // Don't trigger if clicking on links inside
        if (e.target.tagName === 'A' || e.target.closest('a')) {
            return;
        }
        
        const link = card.querySelector('a.project-link');
        if (link) {
            // Add click animation
            card.style.transform = 'scale(0.95)';
            setTimeout(() => {
                card.style.transform = '';
            }, 200);
            
            // Navigate to project page
            window.location.href = link.href;
        }
    }

    animateCardHover(card) {
        card.style.transform = 'translateY(-10px) scale(1.02)';
        card.style.boxShadow = '0 20px 40px rgba(0, 255, 136, 0.2)';
        
        // Animate tech tags
        const techTags = card.querySelectorAll('.tech-tag, .tag');
        techTags.forEach((tag, index) => {
            tag.style.transitionDelay = `${index * 0.05}s`;
            tag.style.transform = 'translateY(-5px)';
        });

        // Animate icon
        const icon = card.querySelector('.project-icon i');
        if (icon) {
            icon.style.transform = 'rotate(10deg) scale(1.2)';
            icon.style.transition = 'transform 0.3s ease';
        }
    }

    resetCardHover(card) {
        card.style.transform = '';
        card.style.boxShadow = '';
        
        // Reset tech tags
        const techTags = card.querySelectorAll('.tech-tag, .tag');
        techTags.forEach(tag => {
            tag.style.transform = '';
        });

        // Reset icon
        const icon = card.querySelector('.project-icon i');
        if (icon) {
            icon.style.transform = '';
        }
    }

    initProjectNavigation() {
        // Previous/Next buttons for project detail pages
        const prevBtn = document.querySelector('.btn-prev-project');
        const nextBtn = document.querySelector('.btn-next-project');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => this.navigateToProject(e));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => this.navigateToProject(e));
        }
    }

    navigateToProject(e) {
        e.preventDefault();
        
        const btn = e.currentTarget;
        const projectUrl = btn.getAttribute('href');
        
        if (!projectUrl || projectUrl === '#') return;
        
        // Add loading animation
        const originalText = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        btn.disabled = true;
        
        // Smooth transition
        document.body.style.opacity = '0.7';
        document.body.style.transition = 'opacity 0.3s ease';
        
        setTimeout(() => {
            window.location.href = projectUrl;
        }, 300);
    }

    trackProjectViews() {
        const projectId = this.getProjectIdFromUrl();
        
        if (projectId) {
            const views = JSON.parse(localStorage.getItem('projectViews') || '{}');
            views[projectId] = (views[projectId] || 0) + 1;
            localStorage.setItem('projectViews', JSON.stringify(views));
            
            // Update view count display if exists
            const viewCountElement = document.getElementById('projectViewCount');
            if (viewCountElement) {
                viewCountElement.textContent = views[projectId];
            }
        }
    }

    getProjectIdFromUrl() {
        const path = window.location.pathname;
        const match = path.match(/projects\/(.+?)\.html/);
        return match ? match[1] : null;
    }

    initProjectRating() {
        const ratingContainer = document.getElementById('projectRating');
        if (!ratingContainer) return;
        
        const projectId = this.getProjectIdFromUrl();
        const ratings = JSON.parse(localStorage.getItem('projectRatings') || '{}');
        const currentRating = ratings[projectId] || 0;
        
        // Create star rating UI
        ratingContainer.innerHTML = '';
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement('i');
            star.className = `fas fa-star ${i <= currentRating ? 'rated' : ''}`;
            star.style.cursor = 'pointer';
            star.style.color = i <= currentRating ? '#ffcc00' : '#666';
            star.style.margin = '0 2px';
            star.style.fontSize = '1.2rem';
            star.style.transition = 'all 0.3s ease';
            
            star.addEventListener('click', () => this.rateProject(i));
            star.addEventListener('mouseenter', () => this.highlightStars(i));
            star.addEventListener('mouseleave', () => this.resetStars(currentRating));
            
            ratingContainer.appendChild(star);
        }
        
        // Add rating count
        const ratingCount = document.createElement('span');
        ratingCount.textContent = ` (${currentRating}/5)`;
        ratingCount.style.color = '#888';
        ratingContainer.appendChild(ratingCount);
    }

    highlightStars(upTo) {
        const stars = document.querySelectorAll('#projectRating .fa-star');
        stars.forEach((star, index) => {
            star.style.color = index < upTo ? '#ffcc00' : '#666';
            star.style.transform = index < upTo ? 'scale(1.2)' : 'scale(1)';
        });
    }

    resetStars(currentRating) {
        const stars = document.querySelectorAll('#projectRating .fa-star');
        stars.forEach((star, index) => {
            star.style.color = index < currentRating ? '#ffcc00' : '#666';
            star.style.transform = 'scale(1)';
        });
    }

    rateProject(rating) {
        const projectId = this.getProjectIdFromUrl();
        const ratings = JSON.parse(localStorage.getItem('projectRatings') || '{}');
        ratings[projectId] = rating;
        localStorage.setItem('projectRatings', JSON.stringify(ratings));
        
        // Show confirmation
        this.showNotification(`Thanks! You rated this project ${rating}/5`, 'success');
        this.initProjectRating(); // Refresh display
    }

    setupProjectGallery() {
        const galleryImages = document.querySelectorAll('.project-gallery img');
        
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                this.openLightbox(img.src, img.alt);
            });
        });
    }

    openLightbox(src, alt) {
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <button class="lightbox-close">&times;</button>
                <button class="lightbox-prev"><i class="fas fa-chevron-left"></i></button>
                <img src="${src}" alt="${alt}">
                <button class="lightbox-next"><i class="fas fa-chevron-right"></i></button>
                <div class="lightbox-caption">${alt}</div>
            </div>
        `;
        
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            animation: fadeIn 0.3s ease forwards;
        `;
        
        document.body.appendChild(lightbox);
        
        // Close on click
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
                lightbox.style.opacity = '0';
                setTimeout(() => lightbox.remove(), 300);
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                lightbox.style.opacity = '0';
                setTimeout(() => lightbox.remove(), 300);
            }
        });
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--card-bg);
            border: 1px solid var(--card-border);
            border-left: 4px solid ${type === 'success' ? '#00cc66' : '#0066ff'};
            border-radius: var(--border-radius);
            padding: var(--spacing-md);
            display: flex;
            align-items: center;
            gap: var(--spacing-sm);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            box-shadow: var(--shadow-lg);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Utility function to get project data
    getProjectData() {
        return this.projects;
    }

    // Filter projects by category
    filterProjects(category) {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const cardCategory = card.dataset.category;
            
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'block';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 10);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const projectsHandler = new ProjectsHandler();
    projectsHandler.init();
    
    // Make it globally available
    window.projectsHandler = projectsHandler;
});
