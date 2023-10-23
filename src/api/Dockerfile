# Utilisez une image officielle de Node.js
FROM node:lts

ENV NODE_ENV=production

USER root

# Utilisez le répertoire comme répertoire de travail
WORKDIR /app

# Copiez le package.json dans le projet
COPY ["package.json", "package-lock.json*", "./"]

# Installez les dépendances
RUN npm install --production

RUN npm install -g nodemon

# Copiez code source
COPY . .

# Exposez le port 3000 pour l'application
EXPOSE 3000

# Lancez le projet
CMD ["npm", "run", "watch"]
