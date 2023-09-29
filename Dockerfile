FROM node:20-alpine3.17

# Create app directory
WORKDIR /app

# Copy all files from current directory to /app in container except files in .dockerignore
COPY . .

# Install app dependencies
RUN npm install

# Build app
RUN npm run build

# Run production
CMD ["npm", "run", "start:prod"]
