import { createServer as createTcpServer, Socket, ListenOptions } from "net";
import { createServer as createHttpServer } from "http";
import * as express from "express";
import * as Split from "stream-split";
import * as io from "socket.io";
import args from "./argparser";
import { MoveCommand, BamboozleCommand } from "../../common/commands";

const app = express();
const httpServer = createHttpServer(app);

app.use(express.static("../public"));
httpServer.listen(args["httpPort"]);
console.log("http server listens at " + args["httpPort"]);

const ws = io(httpServer);
const streemanWs = io(httpServer, {
    path: "/" + args["steerSecret"]
});
const piws = io(httpServer, {
    path: "/" + args["piSecret"]
})

const NALSeparator = Buffer.from([0, 0, 0, 1]);
const splitter = new Split(NALSeparator);

let piConnected = 0;

ws.on('connection', (socket: io.Socket) => {
    socket.on(BamboozleCommand.code, (cmd: BamboozleCommand) => {
        piws.emit(BamboozleCommand.code, cmd);
    });
    socket.on(MoveCommand.code, (cmd: MoveCommand) => {
        piws.emit(MoveCommand.code, cmd);
    })
    console.log(`Watcher connected: ${socket.conn.remoteAddress}`)
});

//TODO: перенести команды управления в steerman
streemanWs.on('connection', (socket: io.Socket) => {
    console.log(`Steerman connected: ${socket.conn.remoteAddress}`);
});

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

    socket.on("disconnect", () => {
        console.log(`Robot disconnected: ${socket.conn.remoteAddress}`);
        piConnected--;
    });
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