FROM nginx:1.26.0-alpine
RUN apk add nodejs=20.12.1-r0 && apk add npm=10.2.5-r0



WORKDIR /opt/fit-friends/apps/backend
COPY ./dist/apps/backend/package.json .
RUN npm install --omit=dev
COPY ./libs/models/src/prisma .
RUN npx prisma@5.12.1 generate --schema schema.prisma
RUN cp -R ../../../../node_modules/.prisma ./node_modules
COPY ./dist/apps/backend .



WORKDIR /opt/fit-friends/apps/cli
COPY ./dist/apps/cli/package.json .
RUN npm install --omit=dev
RUN cp -R ../../../../node_modules/.prisma ./node_modules
COPY ./dist/apps/cli .



WORKDIR /usr/share/nginx/html
COPY ./dist/apps/frontend .



COPY server.nginx.conf /etc/nginx/conf.d/default.conf
RUN rm -rf ../../../../node_modules
WORKDIR /opt/fit-friends
COPY .stage.env .env
COPY stage.start.sh .
RUN chmod +x stage.start.sh
CMD ["sh", "stage.start.sh"]
