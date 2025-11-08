import { extractTextFromPDF } from './js/pdf-parser.js';
import { parseResumeWithAI, enhanceContent } from './js/api.js';
import { generatePortfolioHTML } from './js/generator.js';
import { deployToNetlify } from './js/netlify-deploy.js';

// Global state
const EMPTY_PORTFOLIO = {
    name: '',
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    portfolio: '',
    bio: '',
    skills: [],
    projects: [],
    experience: [],
    education: []
};

let portfolioData = { ...EMPTY_PORTFOLIO };

let selectedTemplate = 'student';
let currentStep = 1;

const UNSUPPORTED_FILE_MESSAGE = 'Please upload a scannable PDF resume. Support for images and DOC files is coming soon.';
const EMPTY_PARSE_MESSAGE = 'Unable to scan resume. Please enter your details manually.';

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupUploadHandlers();
    setupFormHandlers();
});

// ===== STEP 1: PDF UPLOAD =====

function setupUploadHandlers() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('pdfFile');

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const file = e.dataTransfer.files[0];
        if (file && file.type === 'application/pdf') {
            handlePDFUpload(file);
        } else {
            alert(UNSUPPORTED_FILE_MESSAGE);
        }
    });

    // File input
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) {
            return;
        }

        if (file.type === 'application/pdf') {
            handlePDFUpload(file);
        } else {
            alert(UNSUPPORTED_FILE_MESSAGE);
            fileInput.value = '';
        }
    });
}

async function handlePDFUpload(file) {
    const uploadArea = document.getElementById('uploadArea');
    const loading = document.getElementById('loadingParse');

    try {
        uploadArea.classList.add('hidden');
        loading.classList.remove('hidden');

        // Extract text from PDF
        const text = await extractTextFromPDF(file);
        
        // Parse with AI
        const parsedData = await parseResumeWithAI(text);
        
        // Normalize data - ensure arrays are arrays
        if (parsedData.projects) {
            parsedData.projects = parsedData.projects.map(p => ({
                ...p,
                technologies: Array.isArray(p.technologies) ? p.technologies : 
                             (p.technologies ? String(p.technologies).split(',').map(t => t.trim()) : [])
            }));
        }
        if (parsedData.skills && !Array.isArray(parsedData.skills)) {
            parsedData.skills = String(parsedData.skills).split(',').map(s => s.trim());
        }
        
        const hasMeaningfulData = Boolean(
            (parsedData.name && parsedData.name.trim()) ||
            (parsedData.email && parsedData.email.trim()) ||
            (parsedData.phone && parsedData.phone.trim()) ||
            (parsedData.location && parsedData.location.trim()) ||
            (parsedData.bio && parsedData.bio.trim()) ||
            (parsedData.skills && parsedData.skills.length > 0) ||
            (parsedData.projects && parsedData.projects.length > 0) ||
            (parsedData.experience && parsedData.experience.length > 0) ||
            (parsedData.education && parsedData.education.length > 0)
        );

        // Update global state
        portfolioData = hasMeaningfulData
            ? { ...EMPTY_PORTFOLIO, ...parsedData }
            : { ...EMPTY_PORTFOLIO };
        
        // Fill form
        fillForm();

        if (!hasMeaningfulData) {
            alert(EMPTY_PARSE_MESSAGE);
        }
        
        // Move to next step without scrolling to top
        currentStep = 2;
        document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
        document.getElementById('formSection').classList.add('active');
        document.querySelectorAll('.progress-steps .step').forEach(stepEl => {
            stepEl.classList.toggle('active', parseInt(stepEl.dataset.step) === 2);
        });
        
        // Smooth scroll to form section
        document.getElementById('formSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
        
    } catch (error) {
        console.error('Error processing PDF:', error);
        alert('Error processing PDF: ' + error.message + '\n\nPlease ensure you are uploading a scannable PDF, or fill the form manually.');
        uploadArea.classList.remove('hidden');
        loading.classList.add('hidden');
    }
}

// ===== STEP 2: FORM EDITING =====

function setupFormHandlers() {
    // Handle Enter key in skill input
    document.getElementById('skillInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            window.addSkill();
        }
    });

    // Real-time form validation
    document.getElementById('name').addEventListener('input', updateFormData);
    document.getElementById('email').addEventListener('input', updateFormData);
    document.getElementById('phone').addEventListener('input', updateFormData);
    document.getElementById('location').addEventListener('input', updateFormData);
    document.getElementById('github').addEventListener('input', () => {
        updateFormData();
        checkMissingFields();
    });
    document.getElementById('linkedin').addEventListener('input', () => {
        updateFormData();
        checkMissingFields();
    });
    document.getElementById('portfolio').addEventListener('input', () => {
        updateFormData();
        checkMissingFields();
    });
    document.getElementById('bio').addEventListener('input', updateFormData);
}

function fillForm() {
    document.getElementById('name').value = portfolioData.name || '';
    document.getElementById('email').value = portfolioData.email || '';
    document.getElementById('phone').value = portfolioData.phone || '';
    document.getElementById('location').value = portfolioData.location || '';
    document.getElementById('github').value = portfolioData.github || '';
    document.getElementById('linkedin').value = portfolioData.linkedin || '';
    document.getElementById('portfolio').value = portfolioData.portfolio || '';
    document.getElementById('bio').value = portfolioData.bio || '';

    // Skills
    const skillsDisplay = document.getElementById('skillsDisplay');
    skillsDisplay.innerHTML = '';
    portfolioData.skills.forEach((skill, index) => {
        addSkillChip(skill, index);
    });

    // Projects
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '';
    portfolioData.projects.forEach((project, index) => {
        addProjectItem(project, index);
    });

    // Experience
    const experienceList = document.getElementById('experienceList');
    experienceList.innerHTML = '';
    portfolioData.experience.forEach((exp, index) => {
        addExperienceItem(exp, index);
    });

    // Education
    const educationList = document.getElementById('educationList');
    educationList.innerHTML = '';
    portfolioData.education.forEach((edu, index) => {
        addEducationItem(edu, index);
    });

    checkMissingFields();
}

function updateFormData() {
    portfolioData.name = document.getElementById('name').value;
    portfolioData.email = document.getElementById('email').value;
    portfolioData.phone = document.getElementById('phone').value;
    portfolioData.location = document.getElementById('location').value;
    portfolioData.github = document.getElementById('github').value;
    portfolioData.linkedin = document.getElementById('linkedin').value;
    portfolioData.portfolio = document.getElementById('portfolio').value;
    portfolioData.bio = document.getElementById('bio').value;
}

function checkMissingFields() {
    const github = document.getElementById('github').value;
    const linkedin = document.getElementById('linkedin').value;
    const portfolio = document.getElementById('portfolio').value;

    document.getElementById('github').closest('.form-group').classList.toggle('missing', !github);
    document.getElementById('linkedin').closest('.form-group').classList.toggle('missing', !linkedin);
    document.getElementById('portfolio').closest('.form-group').classList.toggle('missing', !portfolio);
}

// Skills Management
window.addSkill = function() {
    const input = document.getElementById('skillInput');
    const skill = input.value.trim();
    
    if (skill && !portfolioData.skills.includes(skill)) {
        portfolioData.skills.push(skill);
        addSkillChip(skill, portfolioData.skills.length - 1);
        input.value = '';
    }
}

function addSkillChip(skill, index) {
    const skillsDisplay = document.getElementById('skillsDisplay');
    const chip = document.createElement('div');
    chip.className = 'skill-chip';
    chip.innerHTML = `
        ${skill}
        <button onclick="removeSkill(${index})">×</button>
    `;
    skillsDisplay.appendChild(chip);
}

window.removeSkill = function(index) {
    portfolioData.skills.splice(index, 1);
    const skillsDisplay = document.getElementById('skillsDisplay');
    skillsDisplay.innerHTML = '';
    portfolioData.skills.forEach((skill, idx) => {
        addSkillChip(skill, idx);
    });
}

// Projects Management
window.addProject = function() {
    const newProject = {
        title: '',
        description: '',
        technologies: [],
        link: ''
    };
    portfolioData.projects.push(newProject);
    addProjectItem(newProject, portfolioData.projects.length - 1);
}

function addProjectItem(project, index) {
    const projectsList = document.getElementById('projectsList');
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
        <div class="list-item-header">
            <strong>Project ${index + 1}</strong>
            <div>
                <button class="btn-enhance" onclick="enhanceProject(${index})">✨ Enhance</button>
                <button class="btn-remove" onclick="removeProject(${index})">Remove</button>
            </div>
        </div>
        <div class="form-group">
            <label>Project Title</label>
            <input type="text" value="${project.title || ''}" onchange="updateProject(${index}, 'title', this.value)">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea onchange="updateProject(${index}, 'description', this.value)">${project.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label>Technologies (comma-separated)</label>
            <input type="text" value="${project.technologies ? (Array.isArray(project.technologies) ? project.technologies.join(', ') : project.technologies) : ''}" 
                   onchange="updateProject(${index}, 'technologies', this.value.split(',').map(t => t.trim()).filter(t => t))">
        </div>
        <div class="form-group">
            <label>Project Link (Optional)</label>
            <input type="url" value="${project.link || ''}" onchange="updateProject(${index}, 'link', this.value)" placeholder="https://github.com/username/project">
        </div>
        ${project.link ? `
        <div class="form-group">
            <button class="btn btn-primary btn-sm" onclick="window.open('${project.link}', '_blank')" target="_blank">
                <i class='bx bx-external-link'></i> View Project
            </button>
        </div>
        ` : ''}
    `;
    projectsList.appendChild(item);
}

window.updateProject = function(index, field, value) {
    portfolioData.projects[index][field] = value;
    // Refresh projects if link field changed to show/hide View Project button
    if (field === 'link') {
        refreshProjects();
    }
}

window.removeProject = function(index) {
    portfolioData.projects.splice(index, 1);
    refreshProjects();
}

window.enhanceProject = async function(index) {
    const project = portfolioData.projects[index];
    if (!project.description) {
        alert('Please add a description first!');
        return;
    }
    
    // Find the button and show loading state
    const buttons = document.querySelectorAll('.btn-enhance');
    const button = Array.from(buttons).find(btn => btn.onclick && btn.onclick.toString().includes(`enhanceProject(${index})`));
    
    if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Enhancing...';
    }
    
    try {
        const enhanced = await enhanceContent(project.description, 'project');
        portfolioData.projects[index].description = enhanced;
        refreshProjects();
    } catch (error) {
        alert('Error enhancing content: ' + error.message);
        if (button) {
            button.disabled = false;
            button.innerHTML = '✨ Enhance';
        }
    }
}

function refreshProjects() {
    const projectsList = document.getElementById('projectsList');
    projectsList.innerHTML = '';
    portfolioData.projects.forEach((project, index) => {
        addProjectItem(project, index);
    });
}

// Experience Management
window.addExperience = function() {
    const newExp = {
        title: '',
        company: '',
        duration: '',
        description: ''
    };
    portfolioData.experience.push(newExp);
    addExperienceItem(newExp, portfolioData.experience.length - 1);
}

function addExperienceItem(exp, index) {
    const experienceList = document.getElementById('experienceList');
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
        <div class="list-item-header">
            <strong>Experience ${index + 1}</strong>
            <div>
                <button class="btn-enhance" onclick="enhanceExperience(${index})">✨ Enhance</button>
                <button class="btn-remove" onclick="removeExperience(${index})">Remove</button>
            </div>
        </div>
        <div class="form-group">
            <label>Job Title</label>
            <input type="text" value="${exp.title || ''}" onchange="updateExperience(${index}, 'title', this.value)">
        </div>
        <div class="form-group">
            <label>Company</label>
            <input type="text" value="${exp.company || ''}" onchange="updateExperience(${index}, 'company', this.value)">
        </div>
        <div class="form-group">
            <label>Duration</label>
            <input type="text" value="${exp.duration || ''}" placeholder="e.g., Jan 2020 - Dec 2021" 
                   onchange="updateExperience(${index}, 'duration', this.value)">
        </div>
        <div class="form-group">
            <label>Description</label>
            <textarea onchange="updateExperience(${index}, 'description', this.value)">${exp.description || ''}</textarea>
        </div>
    `;
    experienceList.appendChild(item);
}

window.updateExperience = function(index, field, value) {
    portfolioData.experience[index][field] = value;
}

window.removeExperience = function(index) {
    portfolioData.experience.splice(index, 1);
    refreshExperience();
}

window.enhanceExperience = async function(index) {
    const exp = portfolioData.experience[index];
    if (!exp.description) {
        alert('Please add a description first!');
        return;
    }
    
    // Find the button and show loading state
    const buttons = document.querySelectorAll('.btn-enhance');
    const button = Array.from(buttons).find(btn => btn.onclick && btn.onclick.toString().includes(`enhanceExperience(${index})`));
    
    if (button) {
        button.disabled = true;
        button.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Enhancing...';
    }
    
    try {
        const enhanced = await enhanceContent(exp.description, 'experience');
        portfolioData.experience[index].description = enhanced;
        refreshExperience();
    } catch (error) {
        alert('Error enhancing content: ' + error.message);
        if (button) {
            button.disabled = false;
            button.innerHTML = '✨ Enhance';
        }
    }
}

function refreshExperience() {
    const experienceList = document.getElementById('experienceList');
    experienceList.innerHTML = '';
    portfolioData.experience.forEach((exp, index) => {
        addExperienceItem(exp, index);
    });
}

// Education Management
window.addEducation = function() {
    const newEdu = {
        degree: '',
        institution: '',
        year: '',
        gpa: ''
    };
    portfolioData.education.push(newEdu);
    addEducationItem(newEdu, portfolioData.education.length - 1);
}

function addEducationItem(edu, index) {
    const educationList = document.getElementById('educationList');
    const item = document.createElement('div');
    item.className = 'list-item';
    item.innerHTML = `
        <div class="list-item-header">
            <strong>Education ${index + 1}</strong>
            <button class="btn-remove" onclick="removeEducation(${index})">Remove</button>
        </div>
        <div class="form-group">
            <label>Degree</label>
            <input type="text" value="${edu.degree || ''}" onchange="updateEducation(${index}, 'degree', this.value)">
        </div>
        <div class="form-group">
            <label>Institution</label>
            <input type="text" value="${edu.institution || ''}" onchange="updateEducation(${index}, 'institution', this.value)">
        </div>
        <div class="form-group">
            <label>Year</label>
            <input type="text" value="${edu.year || ''}" placeholder="e.g., 2020 or 2018-2022" 
                   onchange="updateEducation(${index}, 'year', this.value)">
        </div>
        <div class="form-group">
            <label>GPA (optional)</label>
            <input type="text" value="${edu.gpa || ''}" onchange="updateEducation(${index}, 'gpa', this.value)">
        </div>
    `;
    educationList.appendChild(item);
}

window.updateEducation = function(index, field, value) {
    portfolioData.education[index][field] = value;
}

window.removeEducation = function(index) {
    portfolioData.education.splice(index, 1);
    refreshEducation();
}

function refreshEducation() {
    const educationList = document.getElementById('educationList');
    educationList.innerHTML = '';
    portfolioData.education.forEach((edu, index) => {
        addEducationItem(edu, index);
    });
}

// Enhance Bio
window.enhanceBio = async function() {
    const bioInput = document.getElementById('bio');
    if (!bioInput.value) {
        alert('Please add a bio first!');
        return;
    }
    
    // Find the enhance bio button and show loading state
    const enhanceBtn = document.querySelector('.btn-enhance');
    const originalText = enhanceBtn ? enhanceBtn.innerHTML : '✨ Enhance with AI';
    
    if (enhanceBtn) {
        enhanceBtn.disabled = true;
        enhanceBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Enhancing...';
    }
    
    try {
        const enhanced = await enhanceContent(bioInput.value, 'bio');
        bioInput.value = enhanced;
        portfolioData.bio = enhanced;
        
        if (enhanceBtn) {
            enhanceBtn.innerHTML = '<i class="bx bx-check"></i> Enhanced!';
            setTimeout(() => {
                enhanceBtn.disabled = false;
                enhanceBtn.innerHTML = originalText;
            }, 2000);
        }
    } catch (error) {
        alert('Error enhancing content: ' + error.message);
        if (enhanceBtn) {
            enhanceBtn.disabled = false;
            enhanceBtn.innerHTML = originalText;
        }
    }
}

// ===== STEP 3: TEMPLATE SELECTION =====

window.selectTemplate = function(templateName) {
    selectedTemplate = templateName;
    
    // Update UI
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-template="${templateName}"]`).classList.add('selected');
    
    // Enable next button
    document.getElementById('btnNextToPublish').disabled = false;
}

// ===== STEP 4: PUBLISH =====

window.checkUsername = async function() {
    const usernameInput = document.getElementById('username');
    const username = usernameInput.value.trim().toLowerCase();
    const availabilityMessage = document.getElementById('availabilityMessage');
    const btnPublish = document.getElementById('btnPublish');
    const previewURL = document.getElementById('previewURL');
    
    if (!username) {
        alert('Please enter a username');
        return;
    }
    
    // Validate username format
    if (!/^[a-zA-Z0-9-]+$/.test(username)) {
        alert('Username can only contain letters, numbers, and hyphens');
        return;
    }
    
    // Update preview URL (matching deployment format)
    const siteName = `portly-${username}`;
    previewURL.textContent = `https://${siteName}.netlify.app`;
    
    try {
        availabilityMessage.classList.remove('hidden');
        availabilityMessage.className = 'availability checking';
        availabilityMessage.textContent = '🔍 Checking availability...';
        btnPublish.disabled = true;
        
        // Check if subdomain exists on Netlify by attempting to fetch it
        const netlifyUrl = `https://${siteName}.netlify.app`;
        
        // Use a simple fetch to check if the site exists
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        try {
            const response = await fetch(netlifyUrl, {
                method: 'HEAD',
                signal: controller.signal,
                cache: 'no-cache'
            });
            
            clearTimeout(timeoutId);
            
            // If we get a response (even 404), the subdomain exists
            if (response.ok || response.status === 404 || response.status === 403) {
                availabilityMessage.className = 'availability unavailable';
                availabilityMessage.textContent = '❌ This subdomain is already taken on Netlify. Try another.';
                btnPublish.disabled = true;
            } else {
                // Unexpected status, assume available but warn
                availabilityMessage.className = 'availability available';
                availabilityMessage.textContent = '✅ Username appears available!';
                btnPublish.disabled = false;
            }
        } catch (fetchError) {
            clearTimeout(timeoutId);
            
            // If fetch fails (network error, CORS, timeout), subdomain likely doesn't exist
            if (fetchError.name === 'AbortError') {
                // Timeout - likely available
                availabilityMessage.className = 'availability available';
                availabilityMessage.textContent = '✅ Username appears available!';
                btnPublish.disabled = false;
            } else {
                // Network error or CORS - subdomain likely doesn't exist
                availabilityMessage.className = 'availability available';
                availabilityMessage.textContent = '✅ Username appears available!';
                btnPublish.disabled = false;
            }
        }
    } catch (error) {
        console.error('Error checking username:', error);
        availabilityMessage.className = 'availability available';
        availabilityMessage.textContent = '⚠️ Could not verify. Proceeding with this username.';
        btnPublish.disabled = false;
    }
}

window.publishPortfolio = async function() {
    const username = document.getElementById('username').value.trim().toLowerCase();
    const publishLoading = document.getElementById('publishLoading');
    const btnPublish = document.getElementById('btnPublish');
    const successMessage = document.getElementById('successMessage');
    
    if (!username) {
        alert('Please enter a username');
        return;
    }
    
    if (!portfolioData.name || !portfolioData.email) {
        alert('Please fill in at least your name and email');
        return;
    }
    
    try {
        btnPublish.disabled = true;
        publishLoading.classList.remove('hidden');
        
        // Generate HTML
        const html = generatePortfolioHTML(portfolioData, selectedTemplate);
        
        // Deploy to Netlify (DNS check already done in checkUsername)
        const liveURL = await deployToNetlify(username, html);
        
        // Show success
        publishLoading.classList.add('hidden');
        successMessage.classList.remove('hidden');
        document.getElementById('liveLink').href = liveURL;
        document.getElementById('liveLink').textContent = liveURL;
        
        // Scroll to success message smoothly
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
    } catch (error) {
        console.error('Error publishing portfolio:', error);
        alert('Error publishing portfolio: ' + error.message);
        publishLoading.classList.add('hidden');
        btnPublish.disabled = false;
    }
}

// Update preview URL
document.getElementById('username')?.addEventListener('input', function() {
    const username = this.value.trim().toLowerCase();
    const previewURL = document.getElementById('previewURL');
    if (username) {
        previewURL.textContent = `https://portly-${username}.netlify.app`;
    } else {
        previewURL.textContent = '...';
    }
});

// ===== NAVIGATION =====

window.goToStep = function(step) {
    // Validation
    if (step === 3 && (!portfolioData.name || !portfolioData.email)) {
        alert('Please fill in at least your name and email before proceeding');
        return;
    }
    
    currentStep = step;
    
    // Hide all sections
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Show current section
    const sections = {
        1: 'uploadSection',
        2: 'formSection',
        3: 'templateSection',
        4: 'publishSection'
    };
    document.getElementById(sections[step]).classList.add('active');
    
    // Update step indicators
    document.querySelectorAll('.progress-steps .step').forEach(stepEl => {
        const stepNum = parseInt(stepEl.dataset.step);
        if (stepNum === step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
    
    // Only scroll to top if we're manually navigating (not auto-progressing)
    // Scroll to content area instead of top of page
    const contentArea = document.querySelector('.content');
    if (contentArea) {
        contentArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// ===== MODERN DESIGN INTERACTIONS =====

// --- STICKY HEADER ---
const header = document.getElementById('main-header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

// --- MOBILE HAMBURGER MENU ---
const hamburger = document.getElementById('hamburger-menu');
const navLinks = document.querySelector('.nav-links');
if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// --- SCROLL-TRIGGERED FADE-IN ANIMATIONS ---
const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
};
const observer = new IntersectionObserver(observerCallback, observerOptions);
const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
elementsToAnimate.forEach(el => observer.observe(el));

// --- MODAL FUNCTIONALITY ---
const modalContent = {
    about: {
        title: 'About Port.ly',
        content: `
            <p>Port.ly is an AI-powered portfolio builder that helps you create stunning portfolio websites in seconds.</p>
            
            <h3>Our Mission</h3>
            <p>We believe everyone deserves a professional online presence. Our mission is to make portfolio creation accessible, fast, and beautiful for everyone.</p>
            
            <h3>How It Works</h3>
            <p>Simply upload your resume, and our AI will parse your information, allowing you to customize it with our beautiful templates. Within minutes, your portfolio is live and ready to share with the world.</p>
            
            <h3>Why Choose Port.ly?</h3>
            <ul>
                <li>AI-powered resume parsing saves you time</li>
                <li>Beautiful, responsive templates</li>
                <li>Instant deployment to Netlify</li>
                <li>No coding required</li>
                <li>Free to use</li>
            </ul>
        `
    },
    privacy: {
        title: 'Privacy Policy',
        content: `
            <p><strong>Last Updated:</strong> January 2025</p>
            
            <h3>Information We Collect</h3>
            <p>We collect information you provide when creating your portfolio, including:</p>
            <ul>
                <li>Personal information (name, email, phone)</li>
                <li>Professional information (work experience, education, skills)</li>
                <li>Resume content for parsing</li>
            </ul>
            
            <h3>How We Use Your Information</h3>
            <p>Your information is used solely to:</p>
            <ul>
                <li>Generate your portfolio website</li>
                <li>Store your portfolio metadata</li>
                <li>Improve our AI parsing capabilities</li>
            </ul>
            
            <h3>Data Security</h3>
            <p>We use industry-standard encryption and secure storage practices. Your data is stored securely in our database and is never shared with third parties without your consent.</p>
            
            <h3>Your Rights</h3>
            <p>You have the right to access, modify, or delete your data at any time. Contact us if you have any privacy concerns.</p>
        `
    },
    terms: {
        title: 'Terms of Service',
        content: `
            <p><strong>Last Updated:</strong> January 2025</p>
            
            <h3>Acceptance of Terms</h3>
            <p>By using Port.ly, you agree to these terms of service. If you do not agree, please do not use our service.</p>
            
            <h3>Service Description</h3>
            <p>Port.ly provides an AI-powered portfolio creation service. We aim to deliver reliable service but do not guarantee uninterrupted availability.</p>
            
            <h3>User Responsibilities</h3>
            <ul>
                <li>Provide accurate information</li>
                <li>Do not upload malicious content</li>
                <li>Respect intellectual property rights</li>
                <li>Use the service for lawful purposes only</li>
            </ul>
            
            <h3>Content Ownership</h3>
            <p>You retain full ownership of the content you provide. We have a license to use your content only to provide our services.</p>
            
            <h3>Limitation of Liability</h3>
            <p>Port.ly is provided "as is" without warranties. We are not liable for any damages arising from the use of our service.</p>
            
            <h3>Changes to Terms</h3>
            <p>We reserve the right to modify these terms at any time. Continued use of the service constitutes acceptance of any changes.</p>
        `
    }
};

window.openModal = function(type) {
    const modal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    if (modalContent[type]) {
        modalTitle.textContent = modalContent[type].title;
        modalBody.innerHTML = modalContent[type].content;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

window.closeModal = function() {
    const modal = document.getElementById('infoModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// Close modal when clicking outside
document.getElementById('infoModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'infoModal') {
        closeModal();
    }
});

// ===== TEMPLATE PREVIEW =====
window.previewTemplate = function(templateName) {
    // Generate the HTML for preview
    const html = generatePortfolioHTML(portfolioData, templateName);
    
    // Get the modal and iframe
    const modal = document.getElementById('previewModal');
    const iframe = document.getElementById('previewFrame');
    const title = document.getElementById('previewModalTitle');
    
    // Update title
    const templateNames = {
        student: 'Student Template Preview',
        professional: 'Professional Template Preview',
        creative: 'Creative Template Preview'
    };
    title.textContent = templateNames[templateName] || 'Template Preview';
    
    // Show modal
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Load HTML into iframe
    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    iframeDoc.open();
    iframeDoc.write(html);
    iframeDoc.close();
}

window.closePreviewModal = function() {
    const modal = document.getElementById('previewModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close preview modal on escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closePreviewModal();
    }
});

// Close preview modal when clicking outside
document.getElementById('previewModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'previewModal') {
        closePreviewModal();
    }
});
