# Dolphin Portal v2

Admin portal for Dolphin Laundry (landing page content, portal users, POS management).
Frontend only — a Vite + React SPA built with Refine v5 and HeroUI v3.
All data comes from the separate **Dolphin API**; this app never talks to a database.

Migrated from the Next.js `dolphin-portal`. Components, features and pages were carried over as-is.

## Getting started

```bash
cp .env.example .env     # set VITE_API_URL to the API base URL
npm install
npm run dev              # http://localhost:5173
```

| Script              | What it does                         |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Dev server (Refine CLI + Vite)       |
| `npm run typecheck` | `tsc --noEmit`                       |
| `npm run build`     | Type-check, then build to `dist/`    |
| `npm run preview`   | Serve the production build locally   |

## Project structure

```
src/
  main.tsx, App.tsx      entry + Refine/router/provider setup
  routes/
    resources.tsx        Refine resources (sidebar menu, grouped by meta.parent)
    AppRoutes.tsx        React Router routes (lazy-loaded pages, auth guard)
  pages/<area>/<resource>/{list,create,edit,show}.tsx   thin page shells
  features/<area>/<resource>/   columns, interfaces, tabs, form/Detail.tsx
  components/            shared UI (DataTable, CreateOrEditWrapper, inputs, layout…)
  providers/             data provider, auth provider, axios, notifications
  hooks/, contexts/, config/, utils/, lib/, interfaces/, styles/
```

Areas: `landing-page-content`, `users` (portal management), `pos`.

## API contract

`VITE_API_URL` is the base for every request (e.g. `http://localhost:3000/api`).
Every request sends `Authorization: Bearer <token>`. A `401` logs the user out.
The API must allow CORS from the portal's origin.

**Auth (new — replaces NextAuth)**

| Method | Path          | Body / response                                                   |
| ------ | ------------- | ----------------------------------------------------------------- |
| POST   | `/auth/login` | `{ email, password }` → `{ token, user: { id, name, email, role } }` |

**CRUD resources** — same paths as the old Next.js `/api/*` routes, without the `/api` prefix.
Resources named `pos-*` map to `/pos/*` (`pos-services` → `/pos/services`).

- List `GET /{resource}?page&limit&sort&filters` → `{ data: [], total }`
- One `GET /{resource}/:id` → `{ data: {} }`
- Create `POST /{resource}`, bulk create `POST /{resource}/bulk` (array body)
- Update `PATCH /{resource}/:id`, delete `DELETE /{resource}/:id`
- `GET /{resource}/next-sort-order` → `{ sortOrder }`

**Other endpoints**

| Method | Path                            | Notes                                    |
| ------ | ------------------------------- | ---------------------------------------- |
| GET    | `/pos/dashboard`                | Exists in the old API                    |
| GET    | `/dashboard/landing`            | **New** → `{ data: { totalPerfumes, totalPerfumeCategories, totalPricings, totalFaqs } }` |
| GET    | `/dashboard/portal`             | **New** → `{ data: { totalUsers, activeUsers, adminUsers } }` |
| PATCH  | `/pos/transactions/:id/status`  | Cancel / restore a transaction           |
| GET    | `/perfumes/by-categories/:id`   |                                          |
| GET    | `/pricings/by-category/:id`     |                                          |
| POST   | `/articles/upload`              | multipart: `file`, `folder` → `{ success, fileUrl }` |
| GET    | `/dashboard/content`            | Content Studio → `{ data: { ideas, drafts, inReview, ready, postedThisMonth, publishedArticles, draftArticles } }` |

**Content Studio — `social-posts`** (plain CRUD, no `next-sort-order`). A workspace only:
nothing is sent to Instagram; staff post by hand and mark the post as posted.
Fields: `title`, `platform` (instagram/tiktok/facebook), `format` (feed/carousel/reel/story),
`caption`, `media` (`[{ url, alt? }]` in slide order, uploaded via `/articles/upload` with folder `social`),
`canvaUrl`, `status` (idea → draft → review → ready → posted), `scheduledAt`, `postedAt`, `postUrl`, `notes`.
Filters: `q`, `status`, `platform`, `format`, `scheduledFrom`, `scheduledTo`.

The landing and portal dashboard stats were queried straight from the database in the
Next.js server component; they need these two new endpoints in the API.
