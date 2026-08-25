export default async ({ req, res, error }) => {
    try {
        const body = req.bodyJson || (req.body ? JSON.parse(req.body) : {})
        const query = typeof body.query === 'string' ? body.query.trim() : ''

        if (query.length > 200) {
            return res.json({ error: 'Search query is too long' }, 400)
        }

        const endpoint = query
            ? `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}`
            : 'https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc'

        const token = globalThis.process?.env?.TMDB_API_TOKEN

        if (!token) {
            error('TMDB_API_TOKEN is not configured')
            return res.json({ error: 'Movie service is not configured' }, 500)
        }

        const response = await fetch(endpoint, {
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })

        const data = await response.json()

        if (!response.ok) {
            error(`TMDB request failed with status ${response.status}`)
            return res.json({ error: 'Movie service request failed' }, response.status)
        }

        return res.json(data)
    } catch (requestError) {
        error(requestError.message)
        return res.json({ error: 'Unable to fetch movies' }, 500)
    }
}
