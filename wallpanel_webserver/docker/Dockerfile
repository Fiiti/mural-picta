# MuralPicta WallPanel Server – Dockerfile
# Dreistufiger Build: deps → builder → runtime
# Build-Kontext: wallpanel_webserver/ (Verzeichnis oberhalb von docker/)

# ---- Stage 1: Production-Dependencies ----
FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
# npm-Cache zwischen Builds wiederverwenden (BuildKit)
RUN --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# ---- Stage 2: Admin-SPA bauen ----
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm ci
COPY . .
RUN npm run build:admin

# ---- Stage 3: Minimales Runtime-Image ----
FROM node:22-alpine AS runtime

# OCI-Standard-Labels für Docker Hub und Registry-Metadaten
LABEL org.opencontainers.image.title="MuralPicta WallPanel Server"
LABEL org.opencontainers.image.description="Eigenständiger Bild- und Video-Diashow-Webserver für Wandpanels"
LABEL org.opencontainers.image.source="https://github.com/Fiiti/mural-picta"
LABEL org.opencontainers.image.licenses="GPL-3.0-only"

WORKDIR /app

# Nur die nötigen Produktionsdateien kopieren
COPY --from=deps    /app/node_modules   ./node_modules
COPY --from=builder /app/server         ./server
COPY --from=builder /app/frontend       ./frontend
COPY --from=builder /app/admin/dist     ./admin/dist
COPY --from=builder /app/package.json   ./package.json

# Non-root User (Sicherheitshärtung)
# /app/config  → wird als Volume gemountet (read-write, Admin speichert config.json)
# /data/media  → wird als Volume gemountet (read-only, NAS/Medienordner)
RUN addgroup -g 1001 -S wallpanel && \
    adduser  -S wallpanel -u 1001 -G wallpanel && \
    mkdir -p /app/config /data/media && \
    chown -R wallpanel:wallpanel /app/config

USER wallpanel

EXPOSE 3000

# Healthcheck: alle 30s prüfen ob der Server antwortet
# --start-period=15s: Container hat 15s Zeit beim ersten Start
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:3000/api/status || exit 1

CMD ["node", "server/index.js"]
