# Frontend - Student Study Group Finder

## Overview
React web application for student/admin workflows: authentication, dashboards, group discovery, group details, invites, scheduling, and profile management.

## Tech Stack
- React 18
- React Router 6
- Axios
- CSS (responsive layout)

## Setup
1. Install dependencies:
   npm install
2. Optional .env values:
   REACT_APP_API_BASE_URL=http://localhost:5000/api
   PORT=3001
3. Start dev server:
   npm start

## Main Screens
- Login and Register
- Student Dashboard
- Admin Dashboard
- Group Directory (search/filter, join/leave)
- Group Form (create/edit)
- Group Detail (members, sessions, posts, invites)
- Session Scheduler
- Invites Page
- Profile Page

## Project Structure
- src/pages/: route pages
- src/components/: shared components (Navbar)
- src/services/: API client and auth helpers
- src/styles/: global styling and responsive rules

## API Integration
- Axios client in src/services/api.js
- Authorization header added automatically from localStorage token
- 401 interceptor clears auth state and redirects to /login

## Responsive UI
- Uses CSS grid/flex and breakpoints for tablet/mobile
- Sidebar and content areas adapt for narrow screens

## Manual User Guide
1. Register as student or admin.
2. Login with your role.
3. Students can browse groups, join/leave, view sessions/posts, and respond to invites.
4. Group leaders can create groups, schedule sessions, and invite members.
5. Admin users can view platform stats and user/group overviews.
6. Update profile details from My Profile.

## Build
- npm run build

## Deploy To GitHub Pages
1. Ensure backend is hosted on a public server (GitHub Pages can only host the frontend static files).
2. Copy `.env.production.example` to `.env.production` and set:
   REACT_APP_API_BASE_URL=https://your-backend-domain.com/api
3. Install dependencies:
   npm install
4. Deploy:
   npm run deploy

This publishes the frontend to:
https://ndiku-leonald.github.io/frontend-students-study-group-finder
