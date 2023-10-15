# 1. Base image
FROM node:14 AS build
WORKDIR /app

# 2. Install Angular CLI and app dependencies
COPY package.json package-lock.json ./
RUN npm install
RUN npm install -g @angular/cli@12

# 3. Copy app source and build
COPY . .
RUN ng build --prod

# 4. Base image for step 2
FROM nginx:1.19.10-alpine AS runtime
COPY --from=build /app/dist/YourAppName /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
