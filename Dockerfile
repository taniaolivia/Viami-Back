# Utilisez une image officielle de Node.js
FROM node:lts

# Supprimez et créez un groupe nommé 'viami-admins'
USER root
RUN groupdel viami-admins || true
RUN groupadd -g 999 viami-admins

# Supprimez et créez un utilisateur non root nommé 'viami' et ajoutez-le au groupe 'viami-admins'
RUN userdel viami || true
RUN useradd -m -u 1002 viami
RUN usermod -aG viami-admins viami

# Créez un répertoire pour l'application
RUN mkdir -p /home/viami/app

# Utilisez le répertoire comme répertoire de travail
WORKDIR /home/viami/app

# Copiez le package.json dans le projet
COPY src/api/package.json ./

# Copiez le reste du code de l'application dans le conteneur
COPY ./ /home/viami/app

# Assurez-vous que l'utilisateur 'viami' possède les droits sur le répertoire de l'application
RUN chown -R viami:viami /home/viami/app

# Passez à l'utilisateur 'viami'
USER viami

# Installez les packages npm
RUN npm install

# Exposez le port 3000 pour l'application
EXPOSE 3000

# Lancez le projet
CMD ["npm", "watch"]
