# Your Energy

A fitness and exercise web application that helps users discover workouts, browse exercises by muscles/body parts/equipment, and save favorites for quick access.

## Features

- **Exercise catalog** — browse and search exercises filtered by muscles, body parts, or equipment with pagination
- **Favorites** — save exercises to a personal favorites list (stored in localStorage)
- **Exercise details** — view detailed info in a modal with the ability to rate exercises
- **Quote of the day** — daily motivational quote fetched from the API
- **Email subscription** — subscribe to exercise updates via the footer form
- **Responsive design** — mobile-first layout with a hamburger menu for smaller screens

## Tech Stack

- **Vite** — build tool and dev server
- **Vanilla JS** — no frameworks, ES modules
- **PostCSS** — with `postcss-sort-media-queries` (mobile-first)
- **vite-plugin-html-inject** — HTML partials support
- **vite-plugin-full-reload** — full reload on HTML changes

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── css/           # Stylesheets (base, components, layout)
├── fonts/         # Custom fonts
├── images/        # Icons, photos (PNG/WebP with @2x)
├── js/            # JavaScript modules
│   ├── api.js          # API client (fetch wrapper)
│   ├── filters.js      # Category tab filtering
│   ├── exercises.js    # Exercise list rendering
│   ├── favorites.js    # Favorites page logic
│   ├── pagination.js   # Pagination component
│   ├── quote.js        # Quote of the day
│   ├── subscription.js # Email subscription
│   ├── exercise-modal.js # Exercise detail modal
│   ├── rating-modal.js   # Rating modal
│   ├── search.js       # Search functionality
│   ├── markup.js       # HTML markup helpers
│   └── icons.js        # Icon helpers
├── partials/      # Reusable HTML partials (header, footer, modals)
├── index.html     # Home page
├── favorites.html # Favorites page
└── main.js        # Entry point
```

## API

The app consumes the [Your Energy API](https://your-energy.b.goit.study/api) with the following endpoints:

| Method  | Endpoint                  | Description                |
| ------- | ------------------------- | -------------------------- |
| GET     | `/quote`                  | Quote of the day           |
| GET     | `/filters`                | Exercise categories        |
| GET     | `/exercises`              | Exercise list              |
| GET     | `/exercises/:id`          | Exercise by ID             |
| PATCH   | `/exercises/:id/rating`   | Update exercise rating     |
| POST    | `/subscription`           | Subscribe by email         |
