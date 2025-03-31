# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.16.0

FROM node:${NODE_VERSION}-alpine

# Use production node environment by default.
ENV NODE_ENV=production

WORKDIR /usr/src/app

# Install PM2 globally
RUN npm install -g pm2

# Download dependencies as a separate step to take advantage of Docker's caching.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

# Run the application as a non-root user.
USER node

# Copy the rest of the source files into the image.
COPY . .

# Copy the ecosystem configuration file
COPY ecosystem.config.cjs . 

# Expose the port that the application listens on.
EXPOSE 55555

# Run the application with PM2 using the ecosystem file
CMD ["pm2-runtime", "ecosystem.config.cjs"]
