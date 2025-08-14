FROM node:20-alpine

# Install FFmpeg
RUN apk add --no-cache ffmpeg

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create directories
RUN mkdir -p downloads temp

# Expose port
EXPOSE 8080

# Start the application
CMD ["npm", "start"]
