# Sandbox UI

This is the UI for the Clinia Sandbox. The sandboxes focus on providing a simple and easy to use interface for developers to interact with the Clinia Search API. The sandbox UI demonstrate how to integrate our Search SDK into a Next.js application.

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Building Docker Image

```bash
NPM_TOKEN=<YOUR_NPM_TOKEN> docker buildx build --secret id=npm_token,env=NPM_TOKEN -t clinia/sandbox-ui .
```
