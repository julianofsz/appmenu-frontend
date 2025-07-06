# Etapa de build
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Etapa de produção usando nginx
FROM nginx:alpine

# Copia os arquivos estáticos do Vite pro nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Expor a porta padrão do nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
