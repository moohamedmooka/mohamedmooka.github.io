// projects-handler.js - Handle Project Navigation & Interactions

document.addEventListener('DOMContentLoaded', function() {
    initProjectCards();
    initProjectNavigation();
});

function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        // Make entire card clickable
        card.style.cursor = 'pointer';
        
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on links inside
            if (e.target.tagName === 'A' || e.target.closest('a')) {
                return;
            }
            
            const link = this.querySelector('a.project-link');
            if (link) {
                link.click();
            }
        });
        
        // Hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 20px 40px rgba(0, 255, 136, 0.2)';
            
            // Animate tech tags
            const techTags = this.querySelectorAll('.tech-tag, .tag');
            techTags.forEach((tag, index) => {
                tag.style.transitionDelay = `${index * 0.05}s`;
                tag.style.transform = 'translateY(-5px)';
            });
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
            
            // Reset tech tags
            const techTags = this.querySelectorAll('.tech-tag, .tag');
            techTags.forEach(tag => {
                tag.style.transform = 'translateY(0)';
            });
        });
    });
}

function initProjectNavigation() {
    // Previous/Next project navigation
    const prevBtn = document.querySelector('.btn-prev-project');
    const nextBtn = document.querySelector('.btn-next-project');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', navigateToProject);
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', navigateToProject);
    }
    
    // Project progress tracking
    trackProjectViews();
}

function navigateToProject(e) {
    e.preventDefault();
    
    const btn = e.currentTarget;
    const projectUrl = btn.getAttribute('href');
    
    // Add loading animation
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
    // Smooth transition
    document.body.style.opacity = '0.7';
    
    setTimeout(() => {
        window.location.href = projectUrl;
    }, 300);
}

function trackProjectViews() {
    const projectId = getProjectIdFromUrl();
    
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

function getProjectIdFromUrl() {
    const path = window.location.pathname;
    const match = path.match(/projects\/(.+?)\.html/);
    return match ? match[1] : null;
}

// Project rating system
function initProjectRating() {
    const ratingContainer = document.getElementById('projectRating');
    if (!ratingContainer) return;
    
    const projectId = getProjectIdFromUrl();
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
        
        star.addEventListener('click', () => rateProject(i));
        star.addEventListener('mouseenter', () => highlightStars(i));
        star.addEventListener('mouseleave', () => resetStars(currentRating));
        
        ratingContainer.appendChild(star);
    }
    
    // Add rating count
    const ratingCount = document.createElement('span');
    ratingCount.textContent = ` (${currentRating}/5)`;
    ratingCount.style.color = '#888';
    ratingContainer.appendChild(ratingCount);
}

function highlightStars(upTo) {
    const stars = document.querySelectorAll('#projectRating .fa-star');
    stars.forEach((star, index) => {
        star.style.color = index < upTo ? '#ffcc00' : '#666';
        star.style.transform = index < upTo ? 'scale(1.2)' : 'scale(1)';
    });
}

function resetStars(currentRating) {
    const stars = document.querySelectorAll('#projectRating .fa-star');
    stars.forEach((star, index) => {
        star.style.color = index < currentRating ? '#ffcc00' : '#666';
        star.style.transform = 'scale(1)';
    });
}

function rateProject(rating) {
    const projectId = getProjectIdFromUrl();
    const ratings = JSON.parse(localStorage.getItem('projectRatings') || '{}');
    ratings[projectId] = rating;
    localStorage.setItem('projectRatings', JSON.stringify(ratings));
    
    // Show confirmation
    showNotification(`Thanks! You rated this project ${rating}/5`, 'success');
    initProjectRating(); // Refresh display
}

function showNotification(message, type = 'info') {
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

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initProjectRating();
});
