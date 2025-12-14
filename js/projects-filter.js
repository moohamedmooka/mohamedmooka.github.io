// projects-filter.js - Projects Filtering & Search

document.addEventListener('DOMContentLoaded', function() {
    initProjectsFilter();
    initProjectSearch();
    initLoadMore();
});

function initProjectsFilter() {
    const filterTags = document.querySelectorAll('.filter-tag');
    const projectCards = document.querySelectorAll('.project-card');
    
    filterTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Update active tag
            filterTags.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
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
            
            // Update URL hash
            if (filter !== 'all') {
                window.location.hash = `#${filter}`;
            }
        });
    });
    
    // Check URL for initial filter
    const hash = window.location.hash.replace('#', '');
    if (hash) {
        const initialTag = document.querySelector(`[data-filter="${hash}"]`);
        if (initialTag) {
            initialTag.click();
        }
    }
}

function initProjectSearch() {
    const searchInput = document.getElementById('projectSearch');
    const projectCards = document.querySelectorAll('.project-card');
    
    if (!searchInput) return;
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        
        projectCards.forEach(card => {
            const title = card.querySelector('.project-title').textContent.toLowerCase();
            const description = card.querySelector('.project-description').textContent.toLowerCase();
            const techTags = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(searchTerm) ||
                           description.includes(searchTerm) ||
                           techTags.some(tag => tag.includes(searchTerm));
            
            if (matches || searchTerm === '') {
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
    });
    
    // Clear search on escape
    searchInput.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            this.dispatchEvent(new Event('input'));
        }
    });
}

function initLoadMore() {
    const loadMoreBtn = document.getElementById('loadMore');
    const projectsContainer = document.getElementById('projectsContainer');
    
    if (!loadMoreBtn || !projectsContainer) return;
    
    // Initially hide some projects
    const allProjects = Array.from(projectsContainer.querySelectorAll('.project-card'));
    const initialCount = 6;
    
    // Show initial projects
    allProjects.forEach((project, index) => {
        if (index >= initialCount) {
            project.style.display = 'none';
        }
    });
    
    // Update button text
    const remaining = allProjects.length - initialCount;
    loadMoreBtn.innerHTML = `<i class="fas fa-plus"></i> Load More (${remaining} remaining)`;
    
    loadMoreBtn.addEventListener('click', function() {
        const hiddenProjects = Array.from(projectsContainer.querySelectorAll('.project-card'))
            .filter(p => p.style.display === 'none');
        
        // Show next 3 projects
        hiddenProjects.slice(0, 3).forEach(project => {
            project.style.display = 'block';
            setTimeout(() => {
                project.style.opacity = '1';
                project.style.transform = 'translateY(0)';
            }, 10);
        });
        
        // Update button text
        const newRemaining = hiddenProjects.length - 3;
        if (newRemaining <= 0) {
            this.style.display = 'none';
        } else {
            this.innerHTML = `<i class="fas fa-plus"></i> Load More (${newRemaining} remaining)`;
        }
        
        // Scroll to newly loaded projects
        const newlyVisible = projectsContainer.querySelectorAll('.project-card[style*="display: block"]');
        const lastVisible = newlyVisible[newlyVisible.length - 1];
        
        if (lastVisible) {
            lastVisible.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });
}

// Project card hover effects
function initCardHoverEffects() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const icon = this.querySelector('.project-icon i');
            if (icon) {
                icon.style.transform = 'scale(1.2) rotate(10deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
            
            const techTags = this.querySelectorAll('.tech-tag');
            techTags.forEach((tag, index) => {
                tag.style.transitionDelay = `${index * 0.05}s`;
                tag.style.transform = 'translateY(-2px)';
            });
        });
        
        card.addEventListener('mouseleave', function() {
            const icon = this.querySelector('.project-icon i');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
            
            const techTags = this.querySelectorAll('.tech-tag');
            techTags.forEach(tag => {
                tag.style.transform = 'translateY(0)';
            });
        });
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initCardHoverEffects();
});
