// OpenRouter API integration for AI-powered content generation
import { OPENROUTER_API_KEY, OPENROUTER_API_URL } from './config.js';

const API_URL = OPENROUTER_API_URL;

export async function parseResumeWithAI(resumeText) {
    const prompt = `Extract the following information from this resume and return it as a valid JSON object. Be thorough and extract all available information:

{
  "name": "Full Name",
  "email": "email@example.com",
  "phone": "phone number",
  "location": "city, country",
  "github": "GitHub username or URL",
  "linkedin": "LinkedIn URL",
  "portfolio": "Portfolio website URL",
  "bio": "Brief professional summary",
  "skills": ["skill1", "skill2", "skill3"],
  "projects": [
    {
      "title": "Project Name",
      "description": "What the project does",
      "technologies": ["tech1", "tech2"],
      "link": "project URL or GitHub link"
    }
  ],
  "education": [
    {
      "degree": "Degree Name",
      "institution": "University/College Name",
      "year": "Graduation Year",
      "gpa": "GPA if mentioned"
    }
  ],
  "experience": [
    {
      "title": "Job Title",
      "company": "Company Name",
      "duration": "Start - End dates",
      "description": "Brief description of responsibilities"
    }
  ]
}

Resume Text:
${resumeText}

Return ONLY the JSON object, no additional text.`;
//resume
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.href,
                'X-Title': 'Portfolio Maker'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.3-70b-instruct:free',
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        // Extract JSON from the response (in case there's extra text)
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
            throw new Error('No valid JSON found in response');
        }
        
        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error('Error parsing resume:', error);
        throw error;
    }
}

export async function enhanceContent(content, type = 'project') {
    const prompts = {
        project: `Rewrite this project description to be more professional and impactful. Keep it 2-3 sentences maximum. Return ONLY the improved description, no explanations: "${content}"`,
        bio: `Rewrite this professional bio to be more engaging and professional. Keep it 2-3 sentences maximum. Return ONLY the improved bio, no explanations or meta-commentary: "${content}"`,
        experience: `Rewrite this work experience description to highlight achievements and impact. Keep it concise (3-4 sentences). Return ONLY the improved description, no explanations: "${content}"`
    };
//enhancer
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': window.location.href,
                'X-Title': 'Portfolio Maker'
            },
            body: JSON.stringify({
                model: 'meta-llama/llama-3.3-8b-instruct:free',
                messages: [
                    {
                        role: 'user',
                        content: prompts[type]
                    }
                ]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content.trim().replace(/^["']|["']$/g, '');
    } catch (error) {
        console.error('Error enhancing content:', error);
        throw error;
    }
}
