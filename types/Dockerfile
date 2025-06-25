# 构建阶段
FROM node:22.14.0-alpine AS builder

WORKDIR /app

# 先复制 package 文件
COPY package*.json ./

# 配置淘宝镜像并安装依赖
RUN npm config set registry https://registry.npmmirror.com && \
    npm install --no-audit --progress=false --loglevel=error

# 复制其他文件并构建
COPY .. .
RUN npm run build:docker

# 运行阶段
FROM node:22.14.0-alpine

WORKDIR /app
ENV NODE_ENV=production

# 从构建阶段复制必要的文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000
CMD ["npm", "start"]