# Utilisez une image officielle de Node.js
FROM node:lts

USER root

# Utilisez le répertoire comme répertoire de travail
WORKDIR /app

# Copiez le package.json dans le projet
COPY src/api/package.json .

# Installez les dépendances
RUN npm install -g npm@10.2.1

# Copiez code source
COPY . .

# Exposez le port 3000 pour l'application
EXPOSE 3000

# Lancez le projet
CMD ["npm", "start"]
