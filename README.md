# AppMenu Frontend

## Sobre

Este é o frontend da aplicação AppMenu, feito com React + Vite, buildado para
produção e servido via NGINX.

## Links Importantes

- Repositório GitHub: https://github.com/julianofsz/appmenu-frontend
- Imagem Docker Hub: https://hub.docker.com/r/julianofsz/appmenu-frontend

## Como rodar localmente

### Pré-requisitos

- Node.js (versão 18+)
- Docker (opcional)

### Rodando com Docker

```bash
docker pull seu-usuario/appmenu-frontend:latest
docker run -p 3000:80 seu-usuario/appmenu-frontend:latest
```

### Rodando localmente (modo dev)

```bash
npm install
npm run dev
```

## Variáveis de ambiente

- `VITE_API_URL`: URL da API backend

## GitHub Actions

Este repositório possui um workflow configurado para:

- Buildar a imagem Docker a cada push na branch `main`
- Enviar a imagem para o Docker Hub automaticamente
