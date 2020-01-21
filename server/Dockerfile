FROM node:10
WORKDIR /image

RUN ls -la
RUN pwd

COPY ./ /image

RUN ls -la
RUN pwd

EXPOSE 8000
EXPOSE 9000

CMD [ "sh", "runServer.sh" ]