FROM mcr.microsoft.com/playwright:v1.59.1-jammy

RUN apt-get update && apt-get install -y docker.io && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

ENTRYPOINT ["npx", "playwright", "test"]