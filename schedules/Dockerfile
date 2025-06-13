FROM gradle:7.4.2-jdk18-alpine
ENV HOME=/app
RUN mkdir -p $HOME
WORKDIR $HOME
#RUN ./gradlew --version
CMD ./gradlew -t runApp
