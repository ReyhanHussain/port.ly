// HTML portfolio generator with template support

import { getTemplateCSS } from './templates.js';

// Helper function to clean text (remove null/undefined)
function cleanText(text) {
    if (!text || text === 'null' || text === 'undefined') return '';
    return String(text).trim();
}

// Helper function to fix GitHub URLs
function fixGitHubURL(github) {
    if (!github) return '';
    // Remove any 'github.com/' prefix if it appears twice
    github = github.replace(/github\.com\/github\.com\//g, 'github.com/');
    // Ensure it starts with https://
    if (!github.startsWith('http')) {
        github = 'https://github.com/' + github.replace(/^github\.com\//, '');
    }
    return github;
}

// Helper function to fix LinkedIn URLs
function fixLinkedInURL(linkedin) {
    if (!linkedin) return '';
    if (!linkedin.startsWith('http')) {
        return 'https://' + linkedin;
    }
    return linkedin;
}

function escapeHtml(value = '') {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

function escapeAttribute(value = '') {
    return escapeHtml(value).replace(/"/g, '&quot;');
}

export function generatePortfolioHTML(data, templateName, options = {}) {
    const templateCSS = getTemplateCSS(templateName);
    const { siteUrl } = options;
    const faviconDataURI = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCI+CiAgPGRlZnM+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmY2YjZiIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iI2Y5YTgyNiIgLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmZkMTY2IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3QgeD0iNCIgeT0iNCIgd2lkdGg9IjU2IiBoZWlnaHQ9IjU2IiByeD0iMTIiIGZpbGw9InVybCgjZ3JhZCkiIC8+CiAgPHBhdGggZD0iTTIyIDQ0bDYuNS0yNGg3TDQyIDQ0aC01bC0xLjItNWgtOS42TDI1IDQ0aC0zem04LjQtOS41aDYuMkwzMiAyNi4zIDMwLjQgMzQuNXoiIGZpbGw9IiNmZmYiLz4KPC9zdmc+';
    
    // Normalize technologies in projects (ensure it's always an array)
    if (data.projects) {
        data.projects = data.projects.map(p => ({
            ...p,
            technologies: Array.isArray(p.technologies) ? p.technologies : 
                         (p.technologies ? String(p.technologies).split(',').map(t => t.trim()).filter(t => t) : [])
        }));
    }
    
    // Clean data
    const cleanData = {
        ...data,
        name: cleanText(data.name),
        bio: cleanText(data.bio),
        email: data.email || '',
        phone: data.phone || '',
        location: cleanText(data.location),
        github: fixGitHubURL(data.github),
        linkedin: fixLinkedInURL(data.linkedin),
        portfolio: data.portfolio || ''
    };

    const siteUrlTrimmed = siteUrl ? siteUrl.trim() : '';
    const pageTitle = cleanData.name ? `${cleanData.name} - Portfolio` : 'Portfolio | Port.ly';
    const descriptionText = cleanData.bio || `Explore ${cleanData.name || 'this professional'}'s portfolio featuring projects, experience, and skills.`;
    const keywordsSet = new Set([
        cleanData.name,
        'portfolio',
        'Port.ly',
        'projects',
        'experience',
        'skills',
        ...(data.skills || []).map(skill => cleanText(skill))
    ].filter(Boolean));
    const keywords = Array.from(keywordsSet).join(', ');
    const sameAsLinks = [cleanData.github, cleanData.linkedin, cleanData.portfolio].filter(Boolean);
    const ogImage = 'https://portly.pages.dev/favicon.svg';

    const jsonLdData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: cleanData.name || 'Port.ly User',
        description: descriptionText,
        url: siteUrlTrimmed || undefined,
        email: cleanData.email || undefined,
        telephone: cleanData.phone || undefined,
        address: cleanData.location ? {
            '@type': 'PostalAddress',
            addressLocality: cleanData.location
        } : undefined,
        sameAs: sameAsLinks.length ? sameAsLinks : undefined,
        knowsAbout: data.skills && data.skills.length ? data.skills.map(skill => cleanText(skill)).filter(Boolean) : undefined
    };

    const structuredData = JSON.stringify(jsonLdData, null, 2).replace(/</g, '\\u003c');
    const structuredDataIndented = structuredData.split('\n').map(line => `    ${line}`).join('\n');
    const canonicalTag = siteUrlTrimmed ? `    <link rel="canonical" href="${escapeAttribute(siteUrlTrimmed)}">\n` : '';
    const ogUrlTag = siteUrlTrimmed ? `    <meta property="og:url" content="${escapeAttribute(siteUrlTrimmed)}">\n` : '';
    const twitterUrlTag = siteUrlTrimmed ? `    <meta name="twitter:url" content="${escapeAttribute(siteUrlTrimmed)}">\n` : '';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(pageTitle)}</title>
    <meta name="description" content="${escapeAttribute(descriptionText)}">
    <meta name="keywords" content="${escapeAttribute(keywords)}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="${escapeAttribute(cleanData.name || 'Port.ly')}">
${canonicalTag}    <meta property="og:type" content="profile">
    <meta property="og:title" content="${escapeAttribute(pageTitle)}">
    <meta property="og:description" content="${escapeAttribute(descriptionText)}">
${ogUrlTag}    <meta property="og:site_name" content="Port.ly">
    <meta property="og:image" content="${ogImage}">
    <meta property="og:image:alt" content="${escapeAttribute(pageTitle)}">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${escapeAttribute(pageTitle)}">
    <meta name="twitter:description" content="${escapeAttribute(descriptionText)}">
${twitterUrlTag}    <meta name="twitter:image" content="${ogImage}">
    <meta name="theme-color" content="#ff6b6b">
    <link rel="icon" type="image/svg+xml" href="${faviconDataURI}">
    <style>
        ${templateCSS}
        .footer .made-with-portly {
            margin-top: 6px;
            font-size: 0.85rem;
            opacity: 0.75;
        }
        .footer .made-with-portly span {
            color: #ff6b6b;
        }
        .footer .made-with-portly a {
            color: #ff6b6b;
            text-decoration: none;
            font-weight: 600;
        }
        .footer .made-with-portly a:hover {
            text-decoration: underline;
        }
    </style>
    <script type="application/ld+json">
${structuredDataIndented}
    </script>
</head>
<body>
    <div class="container">
        <!-- Header Section -->
        <header class="header">
            <h1>${cleanData.name}</h1>
            ${cleanData.bio ? `<p class="bio">${cleanData.bio}</p>` : ''}
            <div class="contact-info">
                ${cleanData.email ? `<a href="mailto:${cleanData.email}">${cleanData.email}</a>` : ''}
                ${cleanData.phone ? `<span>${cleanData.phone}</span>` : ''}
                ${cleanData.location ? `<span>${cleanData.location}</span>` : ''}
            </div>
            <div class="social-links">
                ${cleanData.github ? `<a href="${cleanData.github}" target="_blank">GitHub</a>` : ''}
                ${cleanData.linkedin ? `<a href="${cleanData.linkedin}" target="_blank">LinkedIn</a>` : ''}
                ${cleanData.portfolio ? `<a href="${cleanData.portfolio}" target="_blank">Portfolio</a>` : ''}
            </div>
        </header>

        <!-- Skills Section -->
        ${data.skills && data.skills.length > 0 ? `
        <section class="section">
            <h2>Skills</h2>
            <div class="skills-grid">
                ${data.skills.map(skill => `<span class="skill-tag">${cleanText(skill)}</span>`).join('')}
            </div>
        </section>
        ` : ''}

        <!-- Projects Section -->
        ${data.projects && data.projects.length > 0 ? `
        <section class="section">
            <h2>Projects</h2>
            <div class="projects-grid">
                ${data.projects.map(project => `
                <div class="project-card">
                    <h3>${cleanText(project.title)}</h3>
                    <p>${cleanText(project.description)}</p>
                    ${project.technologies && project.technologies.length > 0 ? `
                    <div class="tech-tags">
                        ${project.technologies.map(tech => `<span class="tech-tag">${cleanText(tech)}</span>`).join('')}
                    </div>
                    ` : ''}
                    ${project.link ? `<a href="${cleanText(project.link)}" target="_blank" class="project-link">View Project →</a>` : ''}
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <!-- Experience Section -->
        ${data.experience && data.experience.length > 0 ? `
        <section class="section">
            <h2>Experience</h2>
            <div class="timeline">
                ${data.experience.map(exp => `
                <div class="timeline-item">
                    <h3>${cleanText(exp.title)}</h3>
                    <div class="timeline-meta">
                        <span class="company">${cleanText(exp.company)}</span>
                        <span class="duration">${cleanText(exp.duration)}</span>
                    </div>
                    ${exp.description ? `<p>${cleanText(exp.description)}</p>` : ''}
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <!-- Education Section -->
        ${data.education && data.education.length > 0 ? `
        <section class="section">
            <h2>Education</h2>
            <div class="timeline">
                ${data.education.map(edu => `
                <div class="timeline-item">
                    <h3>${cleanText(edu.degree)}</h3>
                    <div class="timeline-meta">
                        <span class="company">${cleanText(edu.institution)}</span>
                        ${cleanText(edu.year) ? `<span class="duration">${cleanText(edu.year)}</span>` : ''}
                    </div>
                    ${edu.gpa && cleanText(edu.gpa) ? `<p>GPA: ${cleanText(edu.gpa)}</p>` : ''}
                </div>
                `).join('')}
            </div>
        </section>
        ` : ''}

        <!-- Footer -->
        <footer class="footer">
            <p>© ${new Date().getFullYear()} ${cleanData.name || 'Port.ly User'}. Built with Port.ly.</p>
            <p class="made-with-portly">Made with <span>❤️</span> using <a href="https://portly.pages.dev/" target="_blank" rel="noopener">Port.ly</a></p>
        </footer>
    </div>
</body>
</html>`;

    return html;
}
