FROM openjdk:8u171-alpine3.7
LABEL maintainer="marco.martinez@feuvert.es"
VOLUME /logs/schedules
EXPOSE 8084
ARG LOCALHOST=localhost
ENV HOST_IP=$LOCALHOST
RUN apk --no-cache add curl
COPY build/libs/*.jar schedules.jar
CMD java -Dcom.sun.management.jmxremote -Dmicronaut.environments=$ENV -Xmx128m -jar schedules.jar
