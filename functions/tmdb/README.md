# TMDB Appwrite Function

## Environment variable

Add this secret in the Appwrite Function settings:

```text
TMDB_API_TOKEN=your-rotated-tmdb-bearer-token
```

Do not add the token to the React app or prefix it with `VITE_`.

## Request body

Send JSON with an optional `query` field:

```json
{ "query": "inception" }
```

An empty query returns popular movies.

## Appwrite settings

- Runtime: Node.js 18 or newer
- Entrypoint: `src/main.js`
- Execute access: allow the users who need to search movies
