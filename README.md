# ARTISYNK - Rural Women Artisan E-Commerce Platform

This repository contains the complete codebase for **ARTISYNK**, a platform designed to empower rural women artisans by providing them with an easy-to-use storefront, AI-assisted product listing, order tracking, and earnings dashboard.

## System Architecture

The project is split into a frontend application tailored for sellers and a backend API.

```mermaid
graph TD
    subgraph Frontend [Seller Application - Vite/React]
        UI[User Interface]
        State[State Management]
        OfflineQueue[Offline Sync Queue]
        API_Client[API Client]
    end

    subgraph Backend [Express/SQLite API]
        Router[API Router]
        Controllers[Business Logic]
        DB[(SQLite Database)]
        AI_Service[AI Integration]
    end

    UI --> State
    State --> API_Client
    State --> OfflineQueue
    OfflineQueue --> API_Client
    API_Client -->|HTTP/REST| Router
    Router --> Controllers
    Controllers --> DB
    Controllers --> AI_Service
```

## User Workflow

```mermaid
sequenceDiagram
    actor Artisan
    participant Frontend as Seller App
    participant Offline as Local Storage (Offline)
    participant Backend as Express API
    participant AI as AI Service
    
    Artisan->>Frontend: Upload Image/Voice
    Frontend->>Backend: Request AI Listing Generation
    Backend->>AI: Generate Product Description & Title
    AI-->>Backend: AI Generated Listing
    Backend-->>Frontend: Return Draft Listing
    
    Artisan->>Frontend: Edit & Publish Listing
    alt is Online
        Frontend->>Backend: POST /api/products
        Backend-->>Frontend: Success (Product Live)
    else is Offline
        Frontend->>Offline: Save to Offline Queue
    end
    
    Artisan->>Frontend: View Dashboard (Earnings/Orders)
    Frontend->>Backend: GET /api/earnings/summary
    Backend-->>Frontend: Dashboard Metrics
```

## Folder Structure

- **`backend/`**: Express + SQLite REST API serving the seller app (and future buyer app).
- **`SELLER SIDE BASIC LOGIC/`**: Vite + React frontend application with multilingual support, offline sync, and an AI-driven product creation flow.

## Getting Started

### Run the entire stack:

Navigate to the seller directory:
```bash
cd "SELLER SIDE BASIC LOGIC"
npm install
npm run dev:all
```
*(This will install dependencies and concurrently start the backend API on port 3001 and frontend on port 5173).*
