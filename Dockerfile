# Builds the static SPA and serves it with `serve`.
# VITE_API_URL is baked in at build time: docker build --build-arg VITE_API_URL=https://api.example.com/api .
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json .npmrc ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
USER node
EXPOSE 3000
# -s: single-page app mode, so deep links like /pos/services fall back to index.html
CMD ["serve", "-s", "dist", "-l", "3000"]
