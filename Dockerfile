FROM node:lts-alpine
ENV NODE_ENV=production
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --force
# mv node_modules ../
# COPY . .
EXPOSE 5500
# RUN chown -R node /usr/src/app
# USER node
CMD ["npm", "run web"]
