FROM node:8.11
WORKDIR /usr/src/app
ENV PORT 8080
COPY package*.json .
RUN npm install 
COPY . .
EXPOSE 8080
CMD ["npm" ,"run", "test"]