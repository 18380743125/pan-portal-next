# 构建阶段
FROM node:22.14.0-alpine AS builder

# 安装 pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# 先复制包管理文件
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm config set registry https://registry.npmmirror.com && \
    pnpm install --frozen-lockfile --prod false

# 复制源代码
COPY . .

# 构建项目
RUN pnpm run build:docker && pnpm prune --prod

# 运行阶段
FROM node:22.14.0-alpine

WORKDIR /app
ENV NODE_ENV=production

# 从构建阶段复制必要的文件
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "server.js"]
