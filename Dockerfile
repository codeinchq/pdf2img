####################################################################################################
# PDF2IMG
####################################################################################################
FROM node:21-alpine AS pdf2img

ENV PORT=3000
ENV NODE_ENV=production
WORKDIR /app

RUN apk add --no-cache imagemagick imagemagick-pdf poppler-utils \
  && npm install --global esbuild

EXPOSE $PORT
ENTRYPOINT ["node", "main.mjs"]

####################################################################################################
# PDF2IMG dev
####################################################################################################
FROM pdf2img AS pdf2img-dev

ENV NODE_ENV=development
EXPOSE $PORT
RUN npm install --global nodemon
ENTRYPOINT ["nodemon", "main.mjs"]
