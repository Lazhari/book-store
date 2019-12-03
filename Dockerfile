FROM node:12-alpine
# set this with shell variables at build-time.
# If they aren't set, then not-set will be default.
ARG CREATED_DATE=not-set
ARG SOURCE_COMMIT=not-set
# labels from https://github.com/opencontainers/image-spec/blob/master/annotations.md
LABEL org.opencontainers.image.authors=mlazhari@outlook.com
LABEL org.opencontainers.image.created=$CREATED_DATE
LABEL org.opencontainers.image.revision=$SOURCE_COMMIT
LABEL org.opencontainers.image.title="Book Store API"
LABEL org.opencontainers.image.url=https://github.com/Lazhari/book-store/packages
LABEL org.opencontainers.image.source=https://github.com/Lazhari/book-store
LABEL org.opencontainers.image.licenses=MIT
LABEL com.bretfisher.nodeversion=$NODE_VERSION

RUN apk add --no-cache tini curl

ENV PORT 8080
ENV NODE_ENV=production

EXPOSE ${PORT}

WORKDIR /usr/src/app

COPY package*.json ./

# we use npm ci here so only the package-lock.json file is used
RUN npm config list \
  && npm ci \
  && npm cache clean --force

COPY . .

ENTRYPOINT ["tini", "--"]

CMD ["node" ,"src/server.js"]