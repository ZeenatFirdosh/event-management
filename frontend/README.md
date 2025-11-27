# Event Management System

A React + Redux application for managing events across multiple profiles and timezones.

## Deployed link: https://event-management-s1cf.vercel.app/

## Features

- **Profile Management**: Create and manage multiple user profiles
- **Multi-timezone Support**: View and create events in different timezones
- **Event Creation**: Create events for single or multiple profiles
- **Event Editing**: Update existing events with change tracking
- **Event Logs**: View history of all event updates
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: React 18+ with Redux Toolkit
- **Styling**: Vanilla CSS with custom component library
- **Timezone**: Day.js with timezone support
- **State Management**: Redux Toolkit

## Environment Variables

Create a `.env.local` file:

\`\`\`
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Open [http://localhost:3000](http://localhost:3000)