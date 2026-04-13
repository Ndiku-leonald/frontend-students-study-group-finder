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