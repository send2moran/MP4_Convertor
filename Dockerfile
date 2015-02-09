#FROM   jrottenberg/ffmpeg:2.4.3
FROM send2moran/ffmpeg

# Enable EPEL for Node.js
RUN     rpm -Uvh http://download.fedoraproject.org/pub/epel/6/i386/epel-release-6-8.noarch.rpm
# Install Node.js and npm
RUN     yum install -y npm nodejs git


# Clone the conf files into the docker container
# Bundle app source
COPY . /MP4_Convertor
# Install app dependencies
RUN cd /MP4_Convertor; npm install

ENV PORT 8080
EXPOSE  8080


WORKDIR /MP4_Convertor
ENTRYPOINT ["npm", "start"]
