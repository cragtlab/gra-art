FROM node:lts-alpine
ENV NODE_ENV=production
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --force
EXPOSE 5500
# RUN chown -R node /usr/src/app
# USER node
RUN npm run both
#CMD ["npm", "run web"]
