# Learnit – En kunskapsplattform för utvecklare

Learnit är en webbaserad plattform som samlar tekniknyheter och foruminlägg från flera källor till en enda plats. Målet är att förenkla vardagen för utvecklare och teknikintresserade genom att erbjuda ett personligt, filtrerbart och interaktivt gränssnitt.

## Funktioner

- Sök innehåll från Stack Overflow, Hacker News, Dev.to, NewsAPI och New York Times
- OTP-inloggning (pinkod via mejl) och Google-inloggning via Supabase
- Gilla och spara artiklar och trådar
- Personlig profilsida där användaren ser sparade inlägg
- Responsivt gränssnitt – fungerar på både desktop och mobil
- Automatiskt hämtning av nyheter via cron jobs och edge functions

## Tekniker

- Nuxt 3 (Vue 3)
- Supabase (PostgreSQL, Auth, Edge Functions, Storage)
- Tailwind CSS
- TypeScript
- Lighthouse / Wave för test och tillgänglighetsanalys

## Installation

```bash
git clone https://github.com/Phte1100/examensarbete
cd learnit
npm install
npm run dev
```

## API-routes

Projektet har egna API-routes i `/server/api` som fungerar som mellanlager mot Supabase och externa källor. Exempel:

| Route                  | Metod | Syfte                               |
|------------------------|-------|-------------------------------------|
| /api/likes/toggle      | POST  | Gilla/ogilla artikel                |
| /api/news/list         | GET   | Hämta nyheter från NewsAPI-tabellen |
| /api/news/list2        | GET   | Hämta artiklar från New York Times  |
| /api/search/fetch      | POST  | Hämta trådar från tre forumkällor   |

## Prestanda

- Lighthouse Score:
  - **Performance:** 99
  - **Accessibility:** 95
  - **Best Practices:** 100
  - **SEO:** 83


© 2025 Philip
