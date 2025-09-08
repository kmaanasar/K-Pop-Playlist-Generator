import fetch from 'node-fetch';

export default async function handler(req, res) {
    // Enable CORS for your GitHub Pages frontend
    res.setHeader('Access-Control-Allow-Origin', 'https://kmaanasar.github.io');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { code, redirect_uri } = req.body;

    const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
    const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

    const authString = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('code', code);
    params.append('redirect_uri', redirect_uri);

    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authString}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });

        const data = await response.json();
        res.status(200).json(data); // contains access_token, refresh_token
    } catch (err) {
        res.status(500).json({ error: 'Failed to exchange token', details: err });
    }
}
