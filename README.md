# ThreatIQ

## Prerequisites

- Node.js (v18 or higher recommended)
- pnpm (v8 or higher)

## Installation

1. Clone the repository:

```bash
git clone https://github.com/hackventuresorg/threatiq
cd threatiq
```

2. Install dependencies using pnpm:

```bash
pnpm install
```

## Environment Variables

Navigate to the app/client and app/server directory and create a `.env` file and copy the variables from `.env.sample` file.

## Development

```bash
cd apps/server
cp .env.sample .env
```

```bash
cd apps/client
cp .env.sample .env
```

### Run the development server and client in parallel:

```bash
pnpm dev
```

To run the development server individually:

```bash
cd apps/server
pnpm dev
```

To run the development client individually:

```bash
cd apps/client
pnpm dev
```

## Build

To create a production build:

```bash
pnpm build
```

To start the production server:

```bash
pnpm start
```

## Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Create production build
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier

## Project Structure

```bash
threatiq/
├── apps/
│ ├── client/
│ ├── server/
│── packages/
```
