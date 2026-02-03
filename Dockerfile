FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY webapp/package*.json ./webapp/

# Install dependencies
RUN npm install
RUN cd webapp && npm install

# Copy source code
COPY . .

# Build web app
RUN cd webapp && npm run build

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "run", "webapp"]
