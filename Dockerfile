####################################################################################################
# PDF2IMG
####################################################################################################
FROM --platform=$TARGETPLATFORM node:21-alpine AS pdf2img

ENV PORT=3000
ENV NODE_ENV=production
WORKDIR /app

RUN apk add --no-cache imagemagick imagemagick-pdf poppler-utils \
  && npm install --global esbuild


####################################################################################################
# PDF2IMG prod
####################################################################################################
FROM pdf2img AS pdf2img-prod

COPY main.mjs /app/
COPY package.json /app/
COPY package-lock.json /app/
RUN mkdir -p /app/temp
RUN npm install --production

EXPOSE $PORT
ENTRYPOINT ["node", "main.mjs"]


####################################################################################################
# PDF2IMG dev
####################################################################################################
FROM pdf2img AS pdf2img-dev

ENV NODE_ENV=development
RUN npm install --global nodemon

EXPOSE $PORT
ENTRYPOINT ["nodemon", "main.mjs"]
