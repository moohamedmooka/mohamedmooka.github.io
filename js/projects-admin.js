// projects-admin.js - Enhanced Admin System
// Developer: mohamed mOoka | Version: 4.0

(function() {
    'use strict';
    
    // 🔒 CONFIGURATION
    const CONFIG = {
        PASSWORD: 'moka2024',
        SHORTCUT_ACTIVATE: 'M',
        SHORTCUT_ADD: 'P',
        SHORTCUT_DELETE: 'D',
        SHORTCUT_EDIT: 'E',
        SHORTCUT_EXPORT: 'X',
        STORAGE_KEY: 'cybersecurity-projects-admin',
        SESSION_TIMEOUT: 30 * 60 * 1000 // 30 minutes
    };
    
    // 🎮 STATE MANAGEMENT
    let state = {
        isAdminMode: false,
        adminSession: null,
        selectedProject: null,
        projectsData: []
    };
    
    // 📦 DOM ELEMENTS
    const elements = {
        adminPanel: null,
        projectsContainer: null
    };
    
    // 🚀 INITIALIZATION
    function init() {
        cacheElements();
        loadSavedProjects();
        initEventListeners();
        initKeyboardShortcuts();
        updateCurrentYear();
        
        console.log('🔧 Projects admin system initialized');
        console.log('📝 Press Ctrl+Shift+M to activate admin mode');
    }
    
    function cacheElements() {
        elements.adminPanel = document.getElementById('adminPanel');
        elements.projectsContainer = document.getElementById('projectsContainer');
    }
    
    // 🎮 EVENT LISTENERS
    function initEventListeners() {
        // Admin panel close
        const adminClose = document.getElementById('adminClose');
        if (adminClose) {
            adminClose.addEventListener('click', () => {
                toggleAdminMode(false);
            });
        }
        
        // Admin buttons
        document.getElementById('addProject')?.addEventListener('click', showAddProjectModal);
        document.getElementById('editProject')?.addEventListener('click', showEditProjectModal);
        document.getElementById('exportProjects')?.addEventListener('click', exportProjects);
        
        // Project click for selection
        document.addEventListener('click', (e) => {
            const projectCard = e.target.closest('.project-card');
            if (projectCard && state.isAdminMode) {
                selectProject(projectCard);
            }
        });
    }
    
    // ⌨️ KEYBOARD SHORTCUTS
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey) {
                switch(e.key.toUpperCase()) {
                    case CONFIG.SHORTCUT_ACTIVATE:
                        e.preventDefault();
                        toggleAdminMode();
                        break;
                        
                    case CONFIG.SHORTCUT_ADD:
                        e.preventDefault();
                        if (state.isAdminMode) showAddProjectModal();
                        break;
                        
                    case CONFIG.SHORTCUT_DELETE:
                        e.preventDefault();
                        if (state.isAdminMode) deleteSelectedProject();
                        break;
                        
                    case CONFIG.SHORTCUT_EDIT:
                        e.preventDefault();
                        if (state.isAdminMode) showEditProjectModal();
                        break;
                        
                    case CONFIG.SHORTCUT_EXPORT:
                        e.preventDefault();
                        if (state.isAdminMode) exportProjects();
                        break;
                }
            }
        });
    }
    
    // 🔐 ADMIN MODE MANAGEMENT
    function toggleAdminMode(forceState) {
        if (forceState === undefined) {
            state.isAdminMode = !state.isAdminMode;
        } else {
            state.isAdminMode = forceState;
        }
        
        if (state.isAdminMode) {
            // Activate admin mode
            const password = prompt('🔐 Enter admin password:');
            if (password !== CONFIG.PASSWORD) {
                if (password !== null) {
                    alert('❌ Incorrect password!');
                }
                state.isAdminMode = false;
                return;
            }
            
            state.adminSession = Date.now();
            showAdminPanel();
            showNotification('🔓 Admin mode activated', 'success');
            
            // Session timeout
            setTimeout(() => {
                if (state.isAdminMode && Date.now() - state.adminSession > CONFIG.SESSION_TIMEOUT) {
                    toggleAdminMode(false);
                    showNotification('⏰ Admin session expired', 'warning');
                }
            }, CONFIG.SESSION_TIMEOUT);
            
        } else {
            // Deactivate admin mode
            state.adminSession = null;
            hideAdminPanel();
            showNotification('🔒 Admin mode deactivated', 'info');
        }
    }
    
    function showAdminPanel() {
        if (elements.adminPanel) {
            elements.adminPanel.classList.add('active');
        }
        
        // Add edit indicators to projects
        document.querySelectorAll('.project-card').forEach(card => {
            card.classList.add('admin-editable');
            card.style.cursor = 'pointer';
        });
    }
    
    function hideAdminPanel() {
        if (elements.adminPanel) {
            elements.adminPanel.classList.remove('active');
        }
        
        // Remove edit indicators
        document.querySelectorAll('.project-card').forEach(card => {
            card.classList.remove('admin-editable');
            card.style.cursor = '';
        });
        
        // Deselect project
        deselectProject();
    }
    
    // 🎯 PROJECT SELECTION
    function selectProject(projectCard) {
        // Deselect previous
        deselectProject();
        
        // Select new
        state.selectedProject = projectCard;
        projectCard.classList.add('selected');
        
        // Show selection indicator
        const indicator = document.createElement('div');
        indicator.className = 'selection-indicator';
        indicator.innerHTML = '<i class="fas fa-edit"></i> Selected for editing';
        projectCard.appendChild(indicator);
        
        showNotification('📝 Project selected for editing', 'info');
    }
    
    function deselectProject() {
        if (state.selectedProject) {
            state.selectedProject.classList.remove('selected');
            const indicator = state.selectedProject.querySelector('.selection-indicator');
            if (indicator) indicator.remove();
            state.selectedProject = null;
        }
    }
    
    // ➕ ADD NEW PROJECT
    function showAddProjectModal() {
        if (!state.isAdminMode) return;
        
        const modal = createModal('Add New Security Project');
        
        modal.innerHTML = `
            <div class="modal-content">
                <form id="addProjectForm">
                    <div class="form-group">
                        <label for="projectTitle">
                            <i class="fas fa-heading"></i> Project Title
                        </label>
                        <input type="text" id="projectTitle" required 
                               placeholder="Enterprise SOC Implementation">
                    </div>
                    
                    <div class="form-group">
                        <label for="projectCategory">
                            <i class="fas fa-tag"></i> Category
                        </label>
                        <select id="projectCategory" required>
                            <option value="">Select category</option>
                            <option value="soc">SOC Operations</option>
                            <option value="forensics">Digital Forensics</option>
                            <option value="automation">Automation</option>
                            <option value="research">Research</option>
                            <option value="tools">Tool Development</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="projectDescription">
                            <i class="fas fa-align-left"></i> Description
                        </label>
                        <textarea id="projectDescription" rows="4" required
                                  placeholder="Describe the project objectives, methodology, and outcomes..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="projectTechnologies">
                            <i class="fas fa-code"></i> Technologies (comma separated)
                        </label>
                        <input type="text" id="projectTechnologies" 
                               placeholder="Wazuh, ELK, Python, Docker, Grafana">
                    </div>
                    
                    <div class="form-group">
                        <label for="projectFeatures">
                            <i class="fas fa-check-circle"></i> Key Features (one per line)
                        </label>
                        <textarea id="projectFeatures" rows="3"
                                  placeholder="Real-time threat detection&#10;Automated alerting system&#10;Compliance reporting"></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="projectIcon">
                            <i class="fas fa-icons"></i> Icon (Font Awesome class)
                        </label>
                        <input type="text" id="projectIcon" 
                               placeholder="fas fa-server" value="fas fa-shield-alt">
                    </div>
                    
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-plus"></i> Add Project
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Handle form submission
        document.getElementById('addProjectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            addNewProjectFromForm();
            closeModal();
        });
    }
    
    function addNewProjectFromForm() {
        const projectData = {
            id: Date.now(),
            title: document.getElementById('projectTitle').value,
            category: document.getElementById('projectCategory').value,
            description: document.getElementById('projectDescription').value,
            technologies: document.getElementById('projectTechnologies').value
                .split(',')
                .map(tech => tech.trim())
                .filter(tech => tech),
            features: document.getElementById('projectFeatures').value
                .split('\n')
                .map(feature => feature.trim())
                .filter(feature => feature),
            icon: document.getElementById('projectIcon').value || 'fas fa-shield-alt',
            date: new Date().toLocaleDateString('en-US', { 
                month: 'short', 
                year: 'numeric' 
            }),
            isAdminAdded: true
        };
        
        createProjectCard(projectData);
        saveProjects();
        showNotification('✅ Project added successfully!', 'success');
    }
    
    // ✏️ EDIT PROJECT
    function showEditProjectModal() {
        if (!state.isAdminMode || !state.selectedProject) {
            showNotification('⚠️ Please select a project first', 'warning');
            return;
        }
        
        const projectId = state.selectedProject.dataset.projectId;
        const projectData = state.projectsData.find(p => p.id == projectId);
        
        if (!projectData) {
            showNotification('❌ Project data not found', 'error');
            return;
        }
        
        const modal = createModal('Edit Project');
        
        modal.innerHTML = `
            <div class="modal-content">
                <form id="editProjectForm">
                    <div class="form-group">
                        <label for="editProjectTitle">Project Title</label>
                        <input type="text" id="editProjectTitle" value="${escapeHtml(projectData.title)}" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="editProjectDescription">Description</label>
                        <textarea id="editProjectDescription" rows="4" required>${escapeHtml(projectData.description)}</textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="editProjectTechnologies">Technologies</label>
                        <input type="text" id="editProjectTechnologies" 
                               value="${projectData.technologies.join(', ')}">
                    </div>
                    
                    <div class="modal-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeModal()">
                            Cancel
                        </button>
                        <button type="submit" class="btn btn-primary">
                            <i class="fas fa-save"></i> Save Changes
                        </button>
                        <button type="button" class="btn btn-danger" onclick="deleteSelectedProject()">
                            <i class="fas fa-trash"></i> Delete Project
                        </button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        document.getElementById('editProjectForm').addEventListener('submit', (e) => {
            e.preventDefault();
            updateProject(projectId);
            closeModal();
        });
    }
    
    function updateProject(projectId) {
        const projectIndex = state.projectsData.findIndex(p => p.id == projectId);
        if (projectIndex === -1) return;
        
        state.projectsData[projectIndex].title = document.getElementById('editProjectTitle').value;
        state.projectsData[projectIndex].description = document.getElementById('editProjectDescription').value;
        state.projectsData[projectIndex].technologies = document.getElementById('editProjectTechnologies').value
            .split(',')
            .map(tech => tech.trim())
            .filter(tech => tech);
        
        // Update the card
        const projectCard = document.querySelector(`[data-project-id="${projectId}"]`);
        if (projectCard) {
            updateProjectCard(projectCard, state.projectsData[projectIndex]);
        }
        
        saveProjects();
        showNotification('✅ Project updated successfully!', 'success');
    }
    
    // 🗑️ DELETE PROJECT
    function deleteSelectedProject() {
        if (!state.selectedProject) {
            showNotification('⚠️ Please select a project first', 'warning');
            return;
        }
        
        if (!confirm('🗑️ Are you sure you want to delete this project?')) {
            return;
        }
        
        const projectId = state.selectedProject.dataset.projectId;
        
        // Remove from DOM
        state.selectedProject.style.opacity = '0';
        state.selectedProject.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            state.selectedProject.remove();
            deselectProject();
            
            // Remove from data
            state.projectsData = state.projectsData.filter(p => p.id != projectId);
            saveProjects();
            
            showNotification('🗑️ Project deleted successfully!', 'info');
        }, 300);
    }
    
    // 💾 PROJECT CARD MANAGEMENT
    function createProjectCard(projectData) {
        const card = document.createElement('div');
        card.className = 'project-card admin-added';
        card.dataset.projectId = projectData.id;
        card.dataset.category = projectData.category;
        
        card.innerHTML = `
            <div class="project-header">
                <span class="project-badge">
                    <i class="fas fa-user-shield"></i> Admin Added
                </span>
                <span class="project-date">
                    <i class="far fa-calendar"></i> ${projectData.date}
                </span>
            </div>
            
            <div class="project-icon">
                <i class="${projectData.icon}"></i>
            </div>
            
            <h3 class="project-title">${escapeHtml(projectData.title)}</h3>
            <p class="project-description">${escapeHtml(projectData.description)}</p>
            
            ${projectData.technologies.length ? `
            <div class="project-tech">
                ${projectData.technologies.map(tech => 
                    `<span class="tech-tag">${escapeHtml(tech)}</span>`
                ).join('')}
            </div>
            ` : ''}
            
            ${projectData.features.length ? `
            <div class="project-features">
                ${projectData.features.map(feature => `
                    <div class="feature">
                        <i class="fas fa-check-circle"></i>
                        <span>${escapeHtml(feature)}</span>
                    </div>
                `).join('')}
            </div>
            ` : ''}
            
            <div class="project-links">
                <a href="#" class="project-link">
                    <i class="fas fa-book"></i> Details
                </a>
                <a href="#" class="project-link">
                    <i class="fas fa-code"></i> Code
                </a>
                <a href="#" class="project-link">
                    <i class="fas fa-share"></i> Share
                </a>
            </div>
        `;
        
        // Add to container
        if (elements.projectsContainer) {
            elements.projectsContainer.appendChild(card);
        }
        
        // Add to state
        state.projectsData.push(projectData);
        
        // Animation
        card.style.animation = 'fadeInUp 0.6s ease-out';
        card.style.opacity = '1';
    }
    
    function updateProjectCard(card, projectData) {
        card.querySelector('.project-title').textContent = projectData.title;
        card.querySelector('.project-description').textContent = projectData.description;
        
        const techContainer = card.querySelector('.project-tech');
        if (techContainer) {
            techContainer.innerHTML = projectData.technologies.map(tech => 
                `<span class="tech-tag">${escapeHtml(tech)}</span>`
            ).join('');
        }
    }
    
    // 📁 DATA PERSISTENCE
    function loadSavedProjects() {
        try {
            const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
            if (saved) {
                const projects = JSON.parse(saved);
                projects.forEach(projectData => {
                    if (projectData.isAdminAdded) {
                        createProjectCard(projectData);
                    }
                });
                console.log(`📂 Loaded ${projects.length} saved projects`);
            }
        } catch (error) {
            console.error('❌ Error loading projects:', error);
        }
    }
    
    function saveProjects() {
        try {
            localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(state.projectsData));
            console.log('💾 Projects saved to localStorage');
        } catch (error) {
            console.error('❌ Error saving projects:', error);
        }
    }
    
    // 📤 EXPORT PROJECTS
    function exportProjects() {
        const dataStr = JSON.stringify(state.projectsData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = `cybersecurity-projects-${new Date().toISOString().split('T')[0]}.json`;
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        
        showNotification('📤 Projects exported successfully!', 'success');
    }
    
    // 🛠️ UTILITY FUNCTIONS
    function createModal(title) {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="modal-close" onclick="closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>
        `;
        
        // Add styles if not already present
        if (!document.querySelector('#modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'modal-styles';
            styles.textContent = `
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 2000;
                    backdrop-filter: blur(5px);
                }
                
                .modal {
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-radius: var(--border-radius);
                    width: 90%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                    animation: modalSlideIn 0.3s ease-out;
                }
                
                .modal-header {
                    padding: var(--spacing-lg);
                    border-bottom: 1px solid var(--card-border);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                .modal-header h3 {
                    color: var(--text-primary);
                    margin: 0;
                }
                
                .modal-close {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    font-size: 1.2rem;
                    transition: color var(--transition-base);
                }
                
                .modal-close:hover {
                    color: var(--primary);
                }
                
                .modal-content {
                    padding: var(--spacing-lg);
                }
                
                .modal-actions {
                    display: flex;
                    gap: var(--spacing-sm);
                    justify-content: flex-end;
                    margin-top: var(--spacing-lg);
                }
                
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        return modal;
    }
    
    function closeModal() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.style.opacity = '0';
            setTimeout(() => modal.remove(), 300);
        }
    }
    
    function showNotification(message, type = 'info') {
        // Remove existing notification
        const existing = document.querySelector('.notification');
        if (existing) existing.remove();
        
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add styles if not already present
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: var(--card-bg);
                    border: 1px solid var(--card-border);
                    border-left: 4px solid;
                    border-radius: var(--border-radius);
                    padding: var(--spacing-md);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: var(--spacing-md);
                    min-width: 300px;
                    max-width: 400px;
                    z-index: 3000;
                    animation: slideInRight 0.3s ease-out;
                    box-shadow: var(--shadow-lg);
                }
                
                .notification.info {
                    border-left-color: var(--secondary);
                }
                
                .notification.success {
                    border-left-color: var(--success);
                }
                
                .notification.warning {
                    border-left-color: var(--warning);
                }
                
                .notification.error {
                    border-left-color: var(--danger);
                }
                
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: var(--spacing-sm);
                    flex: 1;
                }
                
                .notification-close {
                    background: transparent;
                    border: none;
                    color: var(--text-muted);
                    cursor: pointer;
                    font-size: 0.9rem;
                }
                
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        });
    }
    
    function getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'check-circle';
            case 'warning': return 'exclamation-triangle';
            case 'error': return 'times-circle';
            default: return 'info-circle';
        }
    }
    
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    function updateCurrentYear() {
        const yearElement = document.getElementById('currentYear');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    }
    
    // 📌 GLOBAL FUNCTIONS (for modal close)
    window.closeModal = closeModal;
    
    // 🚀 START
    document.addEventListener('DOMContentLoaded', init);
    
})();
