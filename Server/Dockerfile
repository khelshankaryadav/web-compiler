#  Dockerfile for Node Express Backend

FROM ubuntu:20.04
RUN apt-get clean 
RUN apt-get update --fix-missing
RUN apt install -y nodejs python gcc redis-server npm  
# Create App Directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install Dependencies
COPY package*.json ./

RUN npm install --silent

# Copy app source code
COPY . .

# Exports
EXPOSE 5000

CMD ["npm","start"]