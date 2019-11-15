import { Server, Socket } from "socket.io";
import { MoveCommand, BamboozleCommand } from "../../common/commands";

export default (ws: Server) => {
    ws.on('connection', (socket: Socket) => {
        console.log(`Watcher connected: ${socket.conn.remoteAddress}`)
    });

    ws.on(MoveCommand.getCode(), (socket: Socket, data: any) => {
        console.log(MoveCommand.getCode(), data);
    });

    ws.on(BamboozleCommand.getCode(), (socket: Socket, data: any) => {
        console.log(BamboozleCommand.getCode(), data);
    });
};