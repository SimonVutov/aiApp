# Use Node.js for Vite frontend
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy the rest of the frontend code
COPY . .

# Expose port for frontend
EXPOSE 5173

# Start the Vite development server
CMD ["npm", "run", "dev"]