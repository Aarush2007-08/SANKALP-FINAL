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



## FRONTEND BACKEND CONNECTION 

```mermaid
flowchart TD

subgraph group_frontend["Frontend"]
  node_fe_main["Main<br/>entrypoint<br/>[main.tsx]"]
  node_fe_app["App Shell<br/>spa root<br/>[App.tsx]"]
  node_fe_api["API Client<br/>http client<br/>[client.ts]"]
  node_fe_contexts["App State<br/>react context<br/>[AppContext.tsx]"]
  node_fe_buyer_context["Buyer State<br/>react context<br/>[BuyerContext.tsx]"]
  node_fe_layout["Layout Shell<br/>presentation layer<br/>[PlatformLayout.tsx]"]
  node_fe_ui["UI Kit<br/>design system<br/>[button.tsx]"]
  node_fe_i18n["i18n<br/>localization<br/>[index.ts]"]
  node_fe_seller_pages["Seller Pages<br/>[Dashboard.tsx]"]
  node_fe_buyer_pages["Buyer Pages<br/>[Marketplace.tsx]"]
  node_fe_storefront["Storefront<br/>seller page<br/>[Storefront.tsx]"]
  node_fe_offline["Offline Banner<br/>offline UX<br/>[OfflineBanner.tsx]"]
end

subgraph group_backend["Backend"]
  node_be_entry["Server<br/>entrypoint<br/>[index.ts]"]
  node_be_routes_products["Products<br/>route module<br/>[products.ts]"]
  node_be_routes_orders["Orders<br/>route module<br/>[orders.ts]"]
  node_be_routes_earnings["Earnings<br/>route module<br/>[earnings.ts]"]
  node_be_routes_ai["AI Route<br/>route module<br/>[ai.ts]"]
  node_be_ai["AI Service<br/>ai integration<br/>[ai.ts]"]
  node_be_db[("SQLite DB<br/>persistence layer<br/>[index.ts]")]
  node_be_types["Types<br/>shared models<br/>[types.ts]"]
  node_be_seed["Seed Data<br/>bootstrap data<br/>[seed.ts]"]
end

node_fe_main -->|"bootstraps"| node_fe_app
node_fe_app -->|"provides state"| node_fe_contexts
node_fe_app -->|"provides buyer state"| node_fe_buyer_context
node_fe_app -->|"composes"| node_fe_layout
node_fe_app -->|"routes to"| node_fe_seller_pages
node_fe_app -->|"routes to"| node_fe_buyer_pages
node_fe_app -->|"routes to"| node_fe_storefront
node_fe_app -->|"shows"| node_fe_offline
node_fe_app -->|"localizes"| node_fe_i18n
node_fe_seller_pages -->|"fetches data"| node_fe_api
node_fe_buyer_pages -->|"fetches data"| node_fe_api
node_fe_storefront -->|"publishes"| node_fe_api
node_fe_contexts -->|"syncs"| node_fe_api
node_fe_buyer_context -->|"syncs"| node_fe_api
node_be_entry -->|"mounts"| node_be_routes_products
node_be_entry -->|"mounts"| node_be_routes_orders
node_be_entry -->|"mounts"| node_be_routes_earnings
node_be_entry -->|"mounts"| node_be_routes_ai
node_be_routes_products -->|"reads/writes"| node_be_db
node_be_routes_orders -->|"reads/writes"| node_be_db
node_be_routes_earnings -->|"aggregates"| node_be_db
node_be_routes_ai -->|"delegates"| node_be_ai
node_be_ai -->|"uses data"| node_be_db
node_be_seed -->|"initializes"| node_be_db
node_be_routes_products -->|"shares models"| node_be_types
node_be_routes_orders -->|"shares models"| node_be_types
node_be_routes_earnings -->|"shares models"| node_be_types
node_be_routes_ai -->|"shares models"| node_be_types
node_fe_api -->|"HTTP"| node_be_entry

click node_fe_main "https://github.com/aarush2007-08/sankalp-final/blob/main/SELLER SIDE BASIC LOGIC/src/main.tsx"
click node_fe_app "https://github.com/aarush2007-08/sankalp-final/blob/main/SELLER SIDE BASIC LOGIC/src/app/App.tsx"
click node_fe_api "https://github.com/aarush2007-08/sankalp-final/blob/main/SELLER SIDE BASIC LOGIC/src/app/api/client.ts"
click node_fe_contexts "https://github.com/aarush2007-08/sankalp-final/blob/main/SELLER SIDE BASIC LOGIC/src/app/contexts/AppContext.tsx"
click node_fe_buyer_context "https://github.com/aarush2007-08/sankalp-final/blob/main/SELLER SIDE BASIC LOGIC/src/app/contexts/BuyerContext.tsx"
click node_fe_layout "https://github.com/aarush2007-08/sankalp-final/blob/main/SELLER SIDE BASIC LOGIC/src/app/components/layout/PlatformLayout.tsx"
click node_fe_ui "https://github.com/aarush2007-08/sankalp-final/blob/main/SELLER SIDE BASIC LOGIC/src/app/components/ui/button.tsx"
click node_fe_i18n "https://github.com/aarush2007-08/sankalp-final/blob/main/SELLER SIDE BASIC LOGIC/src/i18n/index.ts"
click node_fe_seller_pages "https://github.com/aarush2007-08/sankalp-final/blob/main/SELLER SIDE BASIC LOGIC/src/app/pages/Dashboard.tsx"
click node_fe_buyer_pages "https://github.com/aarush2007-08/sankalp-final/blob/main/SELLER SIDE BASIC LOGIC/src/app/pages/buyer/Marketplace.tsx"
click node_fe_storefront "https://github.com/aarush2007-08/sankalp-final/blob/main/SELLER SIDE BASIC LOGIC/src/app/pages/Storefront.tsx"
click node_fe_offline "https://github.com/aarush2007-08/sankalp-final/blob/main/SELLER SIDE BASIC LOGIC/src/app/components/OfflineBanner.tsx"
click node_be_entry "https://github.com/aarush2007-08/sankalp-final/blob/main/backend/src/index.ts"
click node_be_routes_products "https://github.com/aarush2007-08/sankalp-final/blob/main/backend/src/routes/products.ts"
click node_be_routes_orders "https://github.com/aarush2007-08/sankalp-final/blob/main/backend/src/routes/orders.ts"
click node_be_routes_earnings "https://github.com/aarush2007-08/sankalp-final/blob/main/backend/src/routes/earnings.ts"
click node_be_routes_ai "https://github.com/aarush2007-08/sankalp-final/blob/main/backend/src/routes/ai.ts"
click node_be_ai "https://github.com/aarush2007-08/sankalp-final/blob/main/backend/src/ai.ts"
click node_be_db "https://github.com/aarush2007-08/sankalp-final/blob/main/backend/src/db/index.ts"
click node_be_types "https://github.com/aarush2007-08/sankalp-final/blob/main/backend/src/types.ts"
click node_be_seed "https://github.com/aarush2007-08/sankalp-final/blob/main/backend/src/seed.ts"

classDef toneNeutral fill:#f8fafc,stroke:#334155,stroke-width:1.5px,color:#0f172a
classDef toneBlue fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#172554
classDef toneAmber fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f
classDef toneMint fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d
classDef toneRose fill:#ffe4e6,stroke:#e11d48,stroke-width:1.5px,color:#881337
classDef toneIndigo fill:#e0e7ff,stroke:#4f46e5,stroke-width:1.5px,color:#312e81
classDef toneTeal fill:#ccfbf1,stroke:#0f766e,stroke-width:1.5px,color:#134e4a
class node_fe_main,node_fe_app,node_fe_api,node_fe_contexts,node_fe_buyer_context,node_fe_layout,node_fe_ui,node_fe_i18n,node_fe_seller_pages,node_fe_buyer_pages,node_fe_storefront,node_fe_offline toneBlue
class node_be_entry,node_be_routes_products,node_be_routes_orders,node_be_routes_earnings,node_be_routes_ai,node_be_ai,node_be_db,node_be_types,node_be_seed toneAmber
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
