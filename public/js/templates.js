// Template CSS definitions

export function getTemplateCSS(templateName) {
    const templates = {
        student: `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
                min-height: 100vh;
                padding: 30px 20px;
                line-height: 1.7;
            }
            
            .container {
                max-width: 1100px;
                margin: 0 auto;
                background: white;
                border-radius: 24px;
                box-shadow: 0 25px 80px rgba(0,0,0,0.25);
                overflow: hidden;
                animation: fadeIn 0.6s ease;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(30px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 80px 50px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: -50%;
                right: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
                animation: pulse 8s ease-in-out infinite;
            }
            
            @keyframes pulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }
            
            .header h1 {
                font-size: 3.5em;
                margin-bottom: 20px;
                font-weight: 800;
                letter-spacing: -1px;
                position: relative;
                z-index: 1;
            }
            
            .bio {
                font-size: 1.25em;
                margin: 25px auto;
                max-width: 700px;
                opacity: 0.95;
                line-height: 1.8;
                font-weight: 300;
                position: relative;
                z-index: 1;
            }
            
            .contact-info {
                margin: 30px 0 0;
                display: flex;
                gap: 20px;
                justify-content: center;
                flex-wrap: wrap;
                position: relative;
                z-index: 1;
            }
            
            .contact-info a, .contact-info span {
                color: rgba(255,255,255,0.95);
                text-decoration: none;
                padding: 8px 16px;
                background: rgba(255,255,255,0.15);
                border-radius: 20px;
                backdrop-filter: blur(10px);
                transition: all 0.3s;
                font-size: 0.95em;
            }
            
            .contact-info a:hover {
                background: rgba(255,255,255,0.25);
                transform: translateY(-2px);
            }
            
            .social-links {
                display: flex;
                gap: 15px;
                justify-content: center;
                margin-top: 30px;
                position: relative;
                z-index: 1;
            }
            
            .social-links a {
                background: white;
                color: #667eea;
                padding: 12px 28px;
                border-radius: 30px;
                text-decoration: none;
                transition: all 0.3s;
                font-weight: 600;
                box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }
            
            .social-links a:hover {
                transform: translateY(-3px);
                box-shadow: 0 8px 25px rgba(0,0,0,0.3);
                background: #764ba2;
                color: white;
            }
            
            .section {
                padding: 70px 50px;
                background: white;
            }
            
            .section:nth-child(even) {
                background: linear-gradient(to bottom, #f8f9ff 0%, white 100%);
            }
            
            .section h2 {
                font-size: 2.5em;
                margin-bottom: 40px;
                color: #2d3748;
                font-weight: 800;
                position: relative;
                display: inline-block;
                padding-bottom: 15px;
            }
            
            .section h2::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 60px;
                height: 4px;
                background: linear-gradient(90deg, #667eea, #764ba2);
                border-radius: 2px;
            }
            
            .skills-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
            }
            
            .skill-tag {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 12px 24px;
                border-radius: 30px;
                font-size: 0.95em;
                font-weight: 600;
                transition: all 0.3s;
                box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
            }
            
            .skill-tag:hover {
                transform: translateY(-3px) scale(1.05);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }
            
            .projects-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                gap: 30px;
            }
            
            .project-card {
                background: white;
                border: 2px solid #e8eaf6;
                border-radius: 20px;
                padding: 30px;
                transition: all 0.4s;
                box-shadow: 0 4px 20px rgba(0,0,0,0.08);
            }
            
            .project-card:hover {
                border-color: #667eea;
                transform: translateY(-8px);
                box-shadow: 0 20px 40px rgba(102, 126, 234, 0.25);
            }
            
            .project-card h3 {
                color: #667eea;
                margin-bottom: 15px;
                font-size: 1.5em;
                font-weight: 700;
            }
            
            .project-card p {
                color: #4a5568;
                margin-bottom: 20px;
                line-height: 1.8;
            }
            
            .tech-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .tech-tag {
                background: #f0f4ff;
                color: #667eea;
                padding: 6px 14px;
                border-radius: 15px;
                font-size: 0.85em;
                font-weight: 600;
                border: 1px solid #e0e7ff;
            }
            
            .project-link {
                color: #667eea;
                text-decoration: none;
                font-weight: 700;
                display: inline-flex;
                align-items: center;
                gap: 5px;
                transition: all 0.3s;
            }
            
            .project-link:hover {
                color: #764ba2;
                transform: translateX(5px);
            }
            
            .project-link::after {
                content: '→';
            }
            
            .timeline {
                border-left: 3px solid #667eea;
                padding-left: 35px;
                position: relative;
            }
            
            .timeline-item {
                margin-bottom: 45px;
                position: relative;
            }
            
            .timeline-item::before {
                content: '';
                width: 18px;
                height: 18px;
                background: white;
                border: 4px solid #667eea;
                border-radius: 50%;
                position: absolute;
                left: -45.5px;
                top: 5px;
                box-shadow: 0 0 0 4px white;
            }
            
            .timeline-item h3 {
                color: #2d3748;
                font-size: 1.4em;
                margin-bottom: 10px;
                font-weight: 700;
            }
            
            .timeline-meta {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 15px;
                margin-bottom: 15px;
                color: #667eea;
                font-weight: 600;
                font-size: 0.95em;
            }
            
            .timeline-item p {
                color: #4a5568;
                line-height: 1.8;
            }
            
            .footer {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 40px;
                text-align: center;
                color: white;
                font-size: 0.95em;
            }
            
            @media (max-width: 768px) {
                body {
                    padding: 15px;
                }
                .header {
                    padding: 60px 30px;
                }
                .header h1 {
                    font-size: 2.2em;
                }
                .section {
                    padding: 50px 30px;
                }
                .projects-grid {
                    grid-template-columns: 1fr;
                }
                .timeline {
                    padding-left: 25px;
                }
                .timeline-item::before {
                    left: -35px;
                }
            }
        `,
        
        professional: `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Playfair Display', 'Georgia', serif;
                background: linear-gradient(135deg, #1e3a5f 0%, #2c5282 100%);
                padding: 40px 20px;
                line-height: 1.8;
                color: #1a202c;
                min-height: 100vh;
            }
            
            .container {
                max-width: 1000px;
                margin: 0 auto;
                background: white;
                box-shadow: 0 30px 90px rgba(0,0,0,0.3);
                border-radius: 8px;
                overflow: hidden;
            }
            
            .header {
                background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
                color: white;
                padding: 90px 70px;
                position: relative;
                overflow: hidden;
            }
            
            .header::after {
                content: '';
                position: absolute;
                top: 0;
                right: 0;
                width: 300px;
                height: 300px;
                background: radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%);
                border-radius: 50%;
            }
            
            .header h1 {
                font-size: 3.2em;
                margin-bottom: 20px;
                font-weight: 600;
                letter-spacing: -0.5px;
                position: relative;
                z-index: 1;
                color: #f7fafc;
            }
            
            .bio {
                font-size: 1.15em;
                margin: 30px 0;
                opacity: 0.92;
                font-family: 'Inter', 'Segoe UI', sans-serif;
                line-height: 1.9;
                max-width: 750px;
                font-weight: 300;
                position: relative;
                z-index: 1;
            }
            
            .contact-info {
                margin: 30px 0 0;
                display: flex;
                gap: 30px;
                flex-wrap: wrap;
                font-family: 'Inter', sans-serif;
                position: relative;
                z-index: 1;
            }
            
            .contact-info a, .contact-info span {
                color: #d4af37;
                text-decoration: none;
                font-size: 0.95em;
                font-weight: 500;
                transition: all 0.3s;
            }
            
            .contact-info a:hover {
                color: #f6e05e;
            }
            
            .social-links {
                display: flex;
                gap: 20px;
                margin-top: 35px;
                font-family: 'Inter', sans-serif;
                position: relative;
                z-index: 1;
            }
            
            .social-links a {
                color: white;
                text-decoration: none;
                padding: 10px 24px;
                border: 2px solid rgba(212, 175, 55, 0.5);
                border-radius: 6px;
                transition: all 0.3s;
                font-weight: 600;
                font-size: 0.9em;
            }
            
            .social-links a:hover {
                background: #d4af37;
                border-color: #d4af37;
                color: #1a365d;
                transform: translateY(-2px);
            }
            
            .section {
                padding: 80px 70px;
                background: white;
            }
            
            .section:nth-child(even) {
                background: #f7fafc;
            }
            
            .section h2 {
                font-size: 2.2em;
                margin-bottom: 45px;
                color: #1a365d;
                font-weight: 600;
                letter-spacing: -0.5px;
                position: relative;
                padding-bottom: 20px;
            }
            
            .section h2::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 80px;
                height: 4px;
                background: linear-gradient(90deg, #d4af37, #f6e05e);
            }
            
            .skills-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
                gap: 18px;
            }
            
            .skill-tag {
                background: white;
                color: #1a365d;
                padding: 16px 24px;
                border: 2px solid #e2e8f0;
                text-align: center;
                font-size: 0.95em;
                font-family: 'Inter', sans-serif;
                font-weight: 600;
                transition: all 0.3s;
                border-radius: 6px;
            }
            
            .skill-tag:hover {
                border-color: #d4af37;
                background: #fffbeb;
                transform: translateY(-3px);
                box-shadow: 0 8px 20px rgba(212, 175, 55, 0.2);
            }
            
            .projects-grid {
                display: flex;
                flex-direction: column;
                gap: 50px;
            }
            
            .project-card {
                border-left: 4px solid #d4af37;
                padding-left: 30px;
                padding-bottom: 40px;
                border-bottom: 1px solid #e2e8f0;
                transition: all 0.3s;
            }
            
            .project-card:last-child {
                border-bottom: none;
            }
            
            .project-card:hover {
                border-left-color: #1a365d;
                padding-left: 35px;
            }
            
            .project-card h3 {
                color: #1a365d;
                margin-bottom: 18px;
                font-size: 1.8em;
                font-weight: 600;
                letter-spacing: -0.5px;
            }
            
            .project-card p {
                color: #4a5568;
                margin-bottom: 25px;
                font-family: 'Inter', sans-serif;
                line-height: 1.9;
            }
            
            .tech-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 12px;
                margin-bottom: 25px;
            }
            
            .tech-tag {
                background: #f7fafc;
                color: #1a365d;
                padding: 8px 18px;
                font-size: 0.85em;
                border: 1px solid #cbd5e0;
                font-family: 'Inter', sans-serif;
                font-weight: 600;
                border-radius: 4px;
            }
            
            .project-link {
                color: #1a365d;
                text-decoration: none;
                font-weight: 700;
                font-family: 'Inter', sans-serif;
                display: inline-flex;
                align-items: center;
                gap: 8px;
                padding: 10px 20px;
                border: 2px solid #d4af37;
                border-radius: 6px;
                transition: all 0.3s;
            }
            
            .project-link:hover {
                background: #d4af37;
                color: white;
                transform: translateX(5px);
            }
            
            .project-link::after {
                content: '→';
            }
            
            .timeline {
                border-left: 3px solid #d4af37;
                padding-left: 35px;
                position: relative;
            }
            
            .timeline-item {
                margin-bottom: 50px;
                position: relative;
            }
            
            .timeline-item::before {
                content: '';
                width: 16px;
                height: 16px;
                background: #d4af37;
                border: 4px solid white;
                border-radius: 50%;
                position: absolute;
                left: -44.5px;
                top: 8px;
                box-shadow: 0 0 0 3px #f7fafc;
            }
            
            .timeline-item h3 {
                color: #1a365d;
                font-size: 1.6em;
                margin-bottom: 12px;
                font-weight: 600;
                letter-spacing: -0.5px;
            }
            
            .timeline-meta {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 20px;
                margin-bottom: 18px;
                color: #718096;
                font-size: 0.95em;
                font-family: 'Inter', sans-serif;
                font-weight: 600;
            }
            
            .timeline-meta .company {
                color: #d4af37;
            }
            
            .timeline-item p {
                color: #4a5568;
                font-family: 'Inter', sans-serif;
                line-height: 1.9;
            }
            
            .footer {
                background: linear-gradient(135deg, #1a365d 0%, #2d3748 100%);
                padding: 50px;
                text-align: center;
                color: #cbd5e0;
                font-family: 'Inter', sans-serif;
                border-top: 4px solid #d4af37;
            }
            
            @media (max-width: 768px) {
                body {
                    padding: 20px 10px;
                }
                .header {
                    padding: 60px 40px;
                }
                .header h1 {
                    font-size: 2.2em;
                }
                .section {
                    padding: 60px 40px;
                }
                .timeline {
                    padding-left: 25px;
                }
                .timeline-item::before {
                    left: -34px;
                }
            }
        `,
        
        creative: `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Arial', sans-serif;
                background: #0a0a0a;
                color: white;
                line-height: 1.6;
            }
            
            .container {
                max-width: 100%;
            }
            
            .header {
                background: linear-gradient(135deg, #ff6b6b 0%, #ffa500 50%, #ffff00 100%);
                padding: 100px 60px;
                text-align: center;
                position: relative;
                overflow: hidden;
            }
            
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.3);
                z-index: 0;
            }
            
            .header > * {
                position: relative;
                z-index: 1;
            }
            
            .header h1 {
                font-size: 4em;
                margin-bottom: 20px;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 3px;
                text-shadow: 3px 3px 6px rgba(0,0,0,0.5);
            }
            
            .bio {
                font-size: 1.3em;
                margin: 25px auto;
                max-width: 700px;
                font-weight: 300;
            }
            
            .contact-info {
                margin: 30px 0;
                display: flex;
                gap: 30px;
                justify-content: center;
                flex-wrap: wrap;
                font-size: 1.1em;
            }
            
            .contact-info a, .contact-info span {
                color: white;
                text-decoration: none;
                font-weight: 500;
            }
            
            .contact-info a:hover {
                text-decoration: underline;
            }
            
            .social-links {
                display: flex;
                gap: 20px;
                justify-content: center;
                margin-top: 30px;
            }
            
            .social-links a {
                background: rgba(255,255,255,0.2);
                color: white;
                padding: 12px 30px;
                text-decoration: none;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                transition: all 0.3s;
                border: 2px solid white;
            }
            
            .social-links a:hover {
                background: white;
                color: #0a0a0a;
            }
            
            .section {
                padding: 80px 60px;
                background: #0a0a0a;
            }
            
            .section:nth-child(even) {
                background: #1a1a1a;
            }
            
            .section h2 {
                font-size: 2.5em;
                margin-bottom: 50px;
                color: #ff6b6b;
                font-weight: 900;
                text-transform: uppercase;
                letter-spacing: 2px;
            }
            
            .skills-grid {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
            }
            
            .skill-tag {
                background: linear-gradient(135deg, #ff6b6b, #ffa500);
                color: white;
                padding: 15px 30px;
                font-size: 1em;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                border: 2px solid transparent;
                transition: all 0.3s;
            }
            
            .skill-tag:hover {
                border-color: #ffff00;
                transform: scale(1.05);
            }
            
            .projects-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                gap: 30px;
            }
            
            .project-card {
                background: #1a1a1a;
                border: 3px solid #ff6b6b;
                padding: 30px;
                transition: all 0.3s;
                position: relative;
                overflow: hidden;
            }
            
            .project-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,107,107,0.2), transparent);
                transition: left 0.5s;
            }
            
            .project-card:hover::before {
                left: 100%;
            }
            
            .project-card:hover {
                border-color: #ffa500;
                transform: translateY(-5px);
            }
            
            .project-card h3 {
                color: #ffff00;
                margin-bottom: 15px;
                font-size: 1.6em;
                font-weight: 900;
                text-transform: uppercase;
            }
            
            .project-card p {
                color: #ccc;
                margin-bottom: 20px;
                line-height: 1.8;
            }
            
            .tech-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 20px;
            }
            
            .tech-tag {
                background: #0a0a0a;
                color: #ffa500;
                padding: 8px 16px;
                font-size: 0.85em;
                border: 1px solid #ffa500;
                font-weight: 700;
            }
            
            .project-link {
                color: #ffff00;
                text-decoration: none;
                font-weight: 700;
                text-transform: uppercase;
                letter-spacing: 1px;
                border-bottom: 2px solid #ffff00;
            }
            
            .project-link:hover {
                color: #ff6b6b;
                border-bottom-color: #ff6b6b;
            }
            
            .timeline {
                border-left: 4px solid #ff6b6b;
                padding-left: 40px;
            }
            
            .timeline-item {
                margin-bottom: 50px;
                position: relative;
            }
            
            .timeline-item::before {
                content: '';
                width: 20px;
                height: 20px;
                background: #ffa500;
                border: 4px solid #0a0a0a;
                border-radius: 50%;
                position: absolute;
                left: -52px;
                top: 8px;
            }
            
            .timeline-item h3 {
                color: #ffff00;
                font-size: 1.5em;
                margin-bottom: 10px;
                font-weight: 900;
                text-transform: uppercase;
            }
            
            .timeline-meta {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 15px;
                margin-bottom: 15px;
                color: #ff6b6b;
                font-weight: 700;
                text-transform: uppercase;
                font-size: 0.9em;
            }
            
            .timeline-item p {
                color: #ccc;
            }
            
            .footer {
                background: #0a0a0a;
                padding: 50px;
                text-align: center;
                color: #666;
                border-top: 4px solid #ff6b6b;
            }
            
            @media (max-width: 768px) {
                .header h1 {
                    font-size: 2.5em;
                }
                .header, .section {
                    padding: 50px 30px;
                }
                .projects-grid {
                    grid-template-columns: 1fr;
                }
            }
        `
    };
    
    return templates[templateName] || templates.student;
}
