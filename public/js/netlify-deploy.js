// Netlify deployment module
// Deploys portfolio HTML as a Netlify site using manual deploy API

import { NETLIFY_TOKEN, NETLIFY_API } from './config.js';

/**
 * Deploy portfolio to Netlify
 * @param {string} username - Portfolio username (becomes site name)
 * @param {string} htmlContent - Complete HTML content
 * @returns {Promise<string>} - Live portfolio URL
 */
export async function deployToNetlify(username, htmlContent) {
    const siteName = `portly-${username}`;
    
    try {
        // Step 1: Create or get existing site
        const site = await createOrGetSite(siteName);
        
        // Step 2: Create a deploy with the HTML file
        const digest = await sha1(htmlContent);
        
        const deployPayload = {
            files: {
                '/index.html': digest
            }
        };
        
        const deployResponse = await fetch(`${NETLIFY_API}/sites/${site.id}/deploys`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${NETLIFY_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deployPayload)
        });
        
        if (!deployResponse.ok) {
            throw new Error(`Deploy creation failed: ${await deployResponse.text()}`);
        }
        
        const deploy = await deployResponse.json();
        
        // Step 3: Upload the required file
        if (deploy.required && deploy.required.includes(digest)) {
            const uploadResponse = await fetch(`${NETLIFY_API}/deploys/${deploy.id}/files/index.html`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${NETLIFY_TOKEN}`,
                    'Content-Type': 'text/html'
                },
                body: htmlContent
            });
            
            if (!uploadResponse.ok) {
                throw new Error(`File upload failed: ${await uploadResponse.text()}`);
            }
        }
        
        // Return the live URL
        return site.url || `https://${siteName}.netlify.app`;
        
    } catch (error) {
        console.error('Netlify deployment error:', error);
        throw new Error(`Failed to deploy to Netlify: ${error.message}`);
    }
}

/**
 * Create a new site or get existing one
 */
async function createOrGetSite(siteName) {
    // Try to create new site
    const createResponse = await fetch(`${NETLIFY_API}/sites`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${NETLIFY_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: siteName
        })
    });
    
    if (createResponse.ok) {
        return await createResponse.json();
    }
    
    // If failed (likely exists), find it
    const sitesResponse = await fetch(`${NETLIFY_API}/sites`, {
        headers: {
            'Authorization': `Bearer ${NETLIFY_TOKEN}`
        }
    });
    
    if (!sitesResponse.ok) {
        throw new Error('Failed to fetch sites');
    }
    
    const sites = await sitesResponse.json();
    const existingSite = sites.find(s => s.name === siteName);
    
    if (existingSite) {
        return existingSite;
    }
    
    throw new Error(`Site "${siteName}" not found and could not be created`);
}

/**
 * Calculate SHA1 hash (required by Netlify)
 */
async function sha1(str) {
    const buffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-1', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}