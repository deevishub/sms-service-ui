# SMS Service UI

A web-based user interface for the SMS Service, built with [Next.js](https://nextjs.org/) and TypeScript.

## Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- npm, yarn, or pnpm

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Scripts

| Command           | Description                  |
| ----------------- | ---------------------------- |
| `npm run dev`     | Start development server     |
| `npm run build`   | Build for production         |
| `npm run start`   | Start production server      |
| `npm run lint`    | Run ESLint                   |

## Project Structure

```
├── app/            # App Router pages and layouts
├── components/     # Reusable UI components
├── public/         # Static assets
└── ...
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```
