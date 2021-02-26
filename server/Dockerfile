FROM openjdk:8u171-alpine3.7
LABEL maintainer="marco.martinez@feuvert.es"
VOLUME /logs/panel
EXPOSE 8083
ARG LOCALHOST=localhost
ENV HOST_IP=$LOCALHOST
RUN apk --no-cache add curl
COPY build/libs/*.jar panel.jar
CMD java -Dcom.sun.management.jmxremote -Dmicronaut.environments=$ENV -Xmx256m -jar panel.jar
