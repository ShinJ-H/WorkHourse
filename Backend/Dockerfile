FROM node:20

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source
COPY . .

# Expose backend port
EXPOSE 5000

# Start server
CMD ["npm", "start"]