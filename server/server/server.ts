import { createServer as createTcpServer, Socket, ListenOptions, Server } from "net";
import { createServer as createHttpServer } from "http";
import * as express from "express";
import * as Split from "stream-split";
import * as io from "socket.io";
import args from "./argparser";
import { MoveCommand, BamboozleCommand, StartStreamCommand, StopStreamCommand, RestartStreamCommand } from "../webclient/src/common/commands";

const app = express();
const httpServer = createHttpServer(app);

app.use(express.static("../webclient/build"));
httpServer.listen(args["httpPort"]);
console.log("http server listens at " + args["httpPort"]);

const ws = io(httpServer, {
    path: "/watcher/" + args["watchSecret"]
});
const streemanWs = io(httpServer, {
    path: "/steerman/" + args["steerSecret"]
});

const piws = io(httpServer, {
    path: "/robot/" + args["piSecret"]
})

let piConnected = 0;
let watchersConnected = 0;

const broadcast = (event: string, msg: any) => {
    ws.emit(event, msg);
    streemanWs.emit(event, msg); ``
};

const onClientConnection = (socket: io.Socket, role: string) => {
    watchersConnected++;
    if (watchersConnected === 1) {
        console.log("first client - starting stream...");
        piws.emit(StartStreamCommand.code, new StartStreamCommand());
    } else {
        console.log("one more client - restarting stream...");
        piws.emit(RestartStreamCommand.code, new RestartStreamCommand());
    }
    console.log(`${role} connected: ${socket.conn.remoteAddress}`);
    socket.on("disconnect", () => {
        watchersConnected--;
        console.log(`${role} left: ${socket.conn.remoteAddress}`);
        if (watchersConnected < 1) {
            console.log("no one left - stopping stream...");
            piws.emit(StopStreamCommand.code, new StopStreamCommand());
        }
    });
    socket.on("connected", (name: string) => {
        broadcast("new_client", {
            role,
            name
        });
    })
};

const onSteermanConnection = (socket: io.Socket) => {
    socket.on(BamboozleCommand.code, (cmd: BamboozleCommand) => {
        piws.emit(BamboozleCommand.code, cmd);
    });
    socket.on(MoveCommand.code, (cmd: MoveCommand) => {
        piws.emit(MoveCommand.code, cmd);
    });
};

ws.on('connection', (socket: io.Socket) => {
    onClientConnection(socket, "Watcher");
});

streemanWs.on('connection', (socket: io.Socket) => {
    onClientConnection(socket, "Steerman");
    onSteermanConnection(socket);
});

piws.on("connection", (socket: io.Socket) => {
    if (piConnected > 0) {
        console.log(`Robot connection refused, already have one`);
        return;
    }
    piConnected++;
    console.log(`Robot connected: ${socket.conn.remoteAddress}`);

    if (watchersConnected) {
        piws.emit(StartStreamCommand.code, new StartStreamCommand());
    }

    socket.on("disconnect", () => {
        console.log(`Robot disconnected: ${socket.conn.remoteAddress}`);
        piConnected--;
    });
});

const streamServer = createTcpServer((socket: Socket) => {
    console.log("Camera connected: " + socket.remoteAddress);
    const NALSeparator = Buffer.from([0, 0, 0, 1]);
    const splitter = new Split(NALSeparator);
    socket.pipe(splitter).on("data", (data: any) => {
        const packet = Buffer.concat([NALSeparator, data]);
        broadcast("nalucast", packet);
    });
});
const listenOptions: ListenOptions = {
    // path: "/" + args["piSecret"], //TODO: find out how to secure a TCP connection
    port: args["tcpPort"]
}
streamServer.listen(listenOptions);