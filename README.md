# README
**Beautiful documentation straight from GitHub**

README is a web application built with Vue 3 and Element Plus that renders
documentation files directly from GitHub repositories. It supports Markdown,
OpenAPI specifications, JSON files, and more — all presented with a clean,
modern interface.

## Features
 - Vue 3
 - Element Plus
 - TypeScript
 - Vite
 - Vue Router
 - Vuex
 - Markdown Support
 - OpenAPI 3.0.x Viewer
 - Syntax Highlighting (highlight.js)

## Development
```bash
npm install     # Install dependencies
npm start       # Start the Vite dev server
npm run build   # Build for production
npm run preview # Preview the production build
```

## Deployment
The project is deployed to Azure Blob Storage via GitHub Actions. Pushes to
`main` are automatically built and deployed through staging and production
environments.
