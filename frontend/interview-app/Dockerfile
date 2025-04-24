FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ENV REACT_APP_API_URL=http://backend:8000
ENV REACT_APP_ML_API_URL=http://ml_service:8080

EXPOSE 3000

CMD ["npm", "start"]