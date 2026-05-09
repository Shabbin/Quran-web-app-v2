# Quran Web Application

A responsive Quran reader web application built for a technical assessment.

The project is inspired by the visual style and interaction patterns of [QuranMazid](https://quranmazid.com/1), and implements Quran reading, Surah navigation, ayah search, audio playback, theme switching, font customization, and responsive desktop/mobile layouts.

---

## Live Links

- **Live Demo:** [surahweb.netlify.app/1](https://surahweb.netlify.app/1)
- **Repository:** [GitHub Repository](https://github.com/Shabbin/Quran-web-app-v2)

---

## Overview

This application allows users to read the Quran by Surah, browse all 114 Surahs, listen to individual ayah recitations, search Quran text, and customize the reading experience through font and theme settings.

The frontend is built with **Next.js**, **TypeScript**, and **Tailwind CSS**. Quran data and helper logic are kept in a shared data package, while the web app is organized into reusable components grouped by feature.

The project also includes a Hono/Bun backend structure as required by the assessment.

---

## Features

### Quran Reader

- Displays all verses of the selected Surah.
- Shows Arabic text right-aligned with proper Quranic font rendering.
- Shows English translation below each ayah.
- Displays ayah reference number.
- Includes Surah header with:
  - Surah name
  - Number of ayahs
  - Revelation place: Makkah or Madinah

### Surah Navigation

- Desktop Surah sidebar with all 114 Surahs.
- Each Surah item includes:
  - Surah number
  - English name
  - English translation
  - Arabic name
- Active Surah is visually highlighted.
- Clicking a Surah navigates to its reader page.
- Mobile Surah drawer for smaller screens.

### Search

- Global search modal from the top navigation.
- Supports searching ayahs by:
  - English translation text
  - Arabic text
- Also includes helpful navigation-style results for:
  - Surah names
  - Surah numbers
  - Page numbers
  - Ayah references

### Audio Playback

- Individual play button for each ayah.
- Uses a free Quran recitation audio source/API.
- Audio controls are available directly inside each ayah card.

### Font Settings

- Arabic font selector with two font options:
  - Amiri
  - Scheherazade
- Arabic font size slider.
- Translation font size slider.
- Settings persist across sessions using `localStorage`.

### Theme Support

- Light theme
- Dark theme
- Sepia theme
- System theme option
- Theme preference persists using `localStorage`.

### Responsive Design

- Desktop layout with:
  - Left icon sidebar
  - Surah sidebar
  - Main reader area
  - Settings panel
- Mobile layout with:
  - Mobile header
  - Bottom navigation
  - Surah drawer
  - Settings drawer
  - Search modal
- Mobile overlays lock background scrolling for a cleaner user experience.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Language | TypeScript |
| Frontend | Next.js with Static Site Generation |
| Styling | Tailwind CSS |
| Backend Structure | Hono / Bun |
| Data Source | Quran JSON data |
| Audio | Free Quran recitation audio source |
| State Persistence | localStorage |
| Deployment | Netlify |

---

## Architecture Diagram

```txt
quran-web-app-v2
│
├── apps
│   │
│   ├── web
│   │   │
│   │   ├── src
│   │   │   │
│   │   │   ├── app
│   │   │   │   ├── [surahId]
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── globals.css
│   │   │   │   └── layout.tsx
│   │   │   │
│   │   │   ├── components
│   │   │   │   │
│   │   │   │   ├── navigation
│   │   │   │   │   ├── desktop-topbar.tsx
│   │   │   │   │   ├── mobile-header.tsx
│   │   │   │   │   ├── icon-sidebar.tsx
│   │   │   │   │   └── bottom-nav.tsx
│   │   │   │   │
│   │   │   │   ├── reader
│   │   │   │   │   ├── ayah-card.tsx
│   │   │   │   │   ├── audio-button.tsx
│   │   │   │   │   ├── surah-sidebar.tsx
│   │   │   │   │   ├── mobile-surah-drawer.tsx
│   │   │   │   │   ├── mobile-surah-list.tsx
│   │   │   │   │   ├── mobile-page-list.tsx
│   │   │   │   │   └── page-scrollbar.tsx
│   │   │   │   │
│   │   │   │   ├── search
│   │   │   │   │   └── search-modal.tsx
│   │   │   │   │
│   │   │   │   ├── settings
│   │   │   │   │   ├── settings-panel.tsx
│   │   │   │   │   ├── settings-panel-content.tsx
│   │   │   │   │   └── mobile-settings-drawer.tsx
│   │   │   │   │
│   │   │   │   └── quran-app-shell.tsx
│   │   │   │
│   │   │   ├── hooks
│   │   │   │   ├── use-reader-settings.ts
│   │   │   │   └── use-lock-body-scroll.ts
│   │   │   │
│   │   │   └── lib
│   │   │       └── quran-search.ts
│   │   │
│   │   └── package.json
│   │
│   └── api
│       └── Hono / Bun backend structure
│
├── packages
│   │
│   └── data
│       ├── Quran data
│       ├── TypeScript types
│       ├── Search helpers
│       └── Reader page helpers
│
└── package.json
```

---

## Application Flow Diagram

```txt
User opens app
      │
      ▼
Next.js loads statically generated Surah page
      │
      ▼
QuranAppShell receives Surah data
      │
      ├── Desktop Layout
      │     ├── Icon Sidebar
      │     ├── Surah Sidebar
      │     ├── Reader Area
      │     └── Settings Panel
      │
      └── Mobile Layout
            ├── Mobile Header
            ├── Surah Drawer
            ├── Reader Area
            ├── Settings Drawer
            └── Bottom Navigation
```

---

## Search Flow Diagram

```txt
User opens Search Modal
      │
      ▼
User enters query
      │
      ▼
quran-search.ts processes query
      │
      ├── Match Surah name / number
      ├── Match Page number
      ├── Match Ayah reference
      ├── Match Arabic ayah text
      └── Match English translation
      │
      ▼
SearchModal displays results
      │
      ▼
User clicks result
      │
      ├── Navigate to Surah
      ├── Open page view
      └── Navigate to Ayah reference
```

---

## Settings Persistence Diagram

```txt
User changes reader setting
      │
      ▼
useReaderSettings hook updates state
      │
      ▼
Setting is sanitized and applied
      │
      ▼
Theme / font size / font face updates in UI
      │
      ▼
Settings are saved to localStorage
      │
      ▼
On refresh, saved settings are restored
```

---

## Project Structure

### `apps/web`

Contains the main Next.js frontend application.

Important folders:

- `app/`  
  Next.js App Router pages and layout files.

- `components/`  
  UI components grouped by feature:
  - `navigation`
  - `reader`
  - `search`
  - `settings`

- `hooks/`  
  Reusable client-side hooks:
  - reader settings persistence
  - mobile overlay scroll locking

- `lib/`  
  Shared frontend logic, including Quran search helpers.

### `packages/data`

Contains shared Quran-related data, types, and helper functions used by the web application.

Responsibilities include:

- Quran data access
- Surah and ayah types
- Search helpers
- Reader page generation helpers

### `apps/api`

Contains the backend structure using Hono/Bun as required by the assessment.

---

## Static Site Generation

The Surah reader pages are generated using Next.js Static Site Generation.

Each Surah route is generated ahead of time, allowing URLs such as:

```txt
/1
/2
/3
...
/114
```

This improves performance and ensures the Quran reader pages are available as static content.

---

## Local Storage Settings

Reader preferences are persisted using `localStorage`.

Stored settings include:

- Selected theme
- Arabic font face
- Arabic font size
- Translation font size

This allows users to refresh or reopen the app while keeping their reading preferences.

---

## Mobile Behavior

On mobile devices:

- Desktop sidebars are hidden.
- Surah navigation opens as a drawer.
- Settings open as a drawer.
- Search opens as a modal.
- Background scrolling is locked while overlays are open.
- Bottom navigation is shown for quick access.

---

## Installation

Clone the repository:

```bash
git clone https://github.com/Shabbin/Quran-web-app-v2.git
cd Quran-web-app-v2
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open the app in the browser:

```txt
http://localhost:3000
```

---

## Build

Run the production build:

```bash
npm run build
```

Start the production server:

```bash
npm run start
```

---

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Runs the web app in development mode |
| `npm run build` | Builds the production app |
| `npm run start` | Starts the production server |
| `npm run lint` | Runs linting for the web app |
| `npm run generate:data` | Generates Quran data if needed |

---

## Assessment Requirement Checklist

| Requirement | Status |
|---|---|
| TypeScript | Completed |
| Next.js SSG | Completed |
| Tailwind CSS | Completed |
| Hono/Bun backend structure | Completed |
| Quran data from JSON/source | Completed |
| Left icon sidebar | Completed |
| Surah sidebar with all 114 Surahs | Completed |
| Desktop Surah navigation | Completed |
| Mobile Surah drawer | Completed |
| Ayah display with Arabic and translation | Completed |
| Verse number display | Completed |
| Surah header | Completed |
| Makkah/Madinah revelation place | Completed |
| Audio playback per ayah | Completed |
| Search by Arabic / English text | Completed |
| Font settings panel | Completed |
| Minimum 2 Arabic fonts | Completed |
| Arabic font size control | Completed |
| Translation font size control | Completed |
| localStorage persistence | Completed |
| Dark theme | Completed |
| Responsive desktop/mobile UI | Completed |
| Public GitHub repository | Completed |
| Live deployment | Completed |

---

## Code Quality Notes

- Components are grouped by feature to keep the frontend structure readable.
- Quran search logic is separated into `src/lib/quran-search.ts`.
- Reader settings are managed through a dedicated `useReaderSettings` hook.
- Overlay scroll locking is handled through a reusable `useLockBodyScroll` hook.
- Quran data, types, and helper functions are separated into the shared `packages/data` workspace.
- UI is split into reusable components for navigation, reader, search, and settings.
- TypeScript types are used for Surahs, ayahs, reader pages, settings, and component props.
- The main app shell composes the layout while feature-specific components handle smaller UI sections.

---

## Future Improvements

Some possible future improvements:

- Add full Surah playback.
- Add bookmark functionality.
- Add copy/share options for ayahs.
- Add full Juz navigation.
- Add more reciter options.
- Add more translation options.
- Improve advanced ayah reference navigation.
- Add more accessibility improvements for keyboard navigation.

---

## Author

**Shabbin Hossain**

---

## License

This project is created for a technical assessment.
