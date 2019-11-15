import { createServer as createTcpServer, Socket, ListenOptions } from "net";
import { createServer as createHttpServer } from "http";
import * as express from "express";
import * as Split from "stream-split";
import * as io from "socket.io";
import args from "./argparser";
import handleWatcherEvents from "./handleWatcherEvents";

const app = express();
const httpServer = createHttpServer(app);
app.use(express.static("../public"));
httpServer.listen(args["httpPort"]);
console.log("http server listens at " + args["httpPort"]);
const ws = io(httpServer);
//TODO: create a steerwheel websocket connection
const piws = io(httpServer, {
    path: "/" + args["piSecret"]
})

const NALSeparator = Buffer.from([0, 0, 0, 1]);
const splitter = new Split(NALSeparator);

let piConnected = 0;

handleWatcherEvents(ws);

//TODO: move the pi-ws events to the separate function
piws.on("connection", (socket: io.Socket) => {
    if (piConnected > 0) {
        console.log(`Robot connection refused, already have one`);
        return;
    }
    piConnected++;
    console.log(`Robot connected: ${socket.conn.remoteAddress}`);
    socket.on("tmp", (data: any) => {
        ws.emit("tmp", data);
    });
});

piws.on("disconnect", (socket: io.Socket) => {
    console.log(`Robot disconnected: ${socket.conn.remoteAddress}`);
    piConnected--;
});

const streamServer = createTcpServer((socket: Socket) => {
    socket.pipe(splitter).on("data", (data: any) => {
        const packet = Buffer.concat([NALSeparator, data]);
        console.log(packet);
        ws.emit("nalucast", packet);
    });
});
const listenOptions: ListenOptions = {
    // path: "/" + args["piSecret"], //TODO: find out how to secure a TCP connection
    port: args["tcpPort"]
}
streamServer.listen(listenOptions);