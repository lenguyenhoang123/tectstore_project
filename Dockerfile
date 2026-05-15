# Sử dụng Node.js official image
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
# RUN npm ci --only=production
RUN npm ci

# Copy source code
COPY . .

# Tạo thư mục logs
RUN mkdir -p logs

# Expose port 5000
EXPOSE 5000

# Command để chạy ứng dụng
CMD ["node", "server.js"]
