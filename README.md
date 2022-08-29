# Beetroot - NFT Marketplace for Negotiators

### To start development

Requirements:

1. `OPENSEA_KEY=` Opensea API key
2. Node version: v16

###### Installing dependencies

```bash
npm install --legacy-peer-deps
```

###### Run setup

```bash
./setup.sh YOUR_OPENSEA_API_KEY
```

###### Running locally on Port 3000

```bash
npm start
```

### Docker deployment

###### Build docker image.

```bash
docker-compose build --build-arg OPENSEA_KEY="YOUR_OPENSEA_API_KEY"
```

###### Run docker container on Port 8000

```bash
docker-compose up
```

### Production deployment

Auto deployment is enabled via [Github workflow](.github).
