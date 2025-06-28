## 构建镜像

- docker build --no-cache -t pan-portal-next .
- docker run -p 3000:3000 --name pan-portal -d pan-portal-next
- docker images | grep pan-portal-next

## 导出镜像

- docker save -o pan-next-app.tar pan-portal-next:latest
