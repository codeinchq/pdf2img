# Copyright (c) 2025 Joan Fabrégat <j@fabreg.at>
# Permission is hereby granted, free of charge, to any person
# obtaining a copy of this software and associated documentation
# files (the "Software"), to deal in the Software without
# restriction, subject to the conditions in the full MIT License.
# The Software is provided "as is", without warranty of any kind.

##
# Base image
##
FROM --platform=$TARGETPLATFORM node:lts-alpine AS base

ENV PORT=3000
ENV NODE_ENV=production
WORKDIR /app

RUN apk add --no-cache imagemagick imagemagick-pdf poppler-utils


##
# Dev image
##
FROM base AS pdf2img-dev

ENV NODE_ENV=development
RUN npm install --global nodemon

EXPOSE $PORT
ENTRYPOINT ["nodemon", "main.mjs"]


##
# Prod image
##
FROM base AS pdf2img-prod

ARG PORT
ARG VERSION
ARG BUILD_ID
ARG COMMIT_SHA

ENV PORT=${PORT}
ENV VERSION=${VERSION}
ENV BUILD_ID=${BUILD_ID}
ENV COMMIT_SHA=${COMMIT_SHA}

COPY main.mjs /app/
COPY package.json /app/
COPY package-lock.json /app/
RUN mkdir -p /app/temp
RUN npm install --omit=dev

EXPOSE $PORT
ENTRYPOINT ["node", "main.mjs"]