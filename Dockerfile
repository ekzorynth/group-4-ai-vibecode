FROM node:22-bookworm-slim

ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=4310 \
    DB_PATH=/app/web/data/encore-v2.sqlite

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund \
    && npm cache clean --force

COPY --chown=node:node web/ ./web/
RUN mkdir -p /app/web/data \
    && chown node:node /app/web/data

USER node
EXPOSE 4310

HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=5 \
    CMD node -e "fetch('http://127.0.0.1:4310/api/health').then(async r => { if (!r.ok || !(await r.json()).ok) process.exit(1); }).catch(() => process.exit(1))"

CMD ["node", "web/server.mjs"]
