FROM mcr.microsoft.com/playwright:v1.44.0-jammy

WORKDIR /app

COPY package.json pnpm-lock.yaml .npmrc ./

RUN npm install -g pnpm && pnpm install --frozen-lockfile

COPY . .

RUN npx playwright install --with-deps

CMD ["npx", "playwright", "test", "tests/e2e/data-migration.spec.ts"]