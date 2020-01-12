import { MoveCommand, BamboozleCommand, IRoboCommand } from "../../../../common/commands";
import Params from "../../../../common/params";
import * as io from 'socket.io-client';
import { create, EventData, JoystickOutputData } from 'nipplejs';
import BroadwayFactory from "./BroadwayFactory.js";

// const player = BroadwayFactory.createPlayer();
// player.canvas.id = "omegaCanvas";
// document.getElementById("content").appendChild(player.canvas);

// const socket = io("http://" + document.location.host, {
//     path: "/fedcba"
// });

// socket.on("nalucast", function (data) {
//     player.decode(new Uint8Array(data));
// });

// const apply = (cmd: IRoboCommand) => {
//     console.log({
//         "str": cmd.code,
//         "orig": cmd,
//         "conc": cmd + "",
//     });
//     socket.emit(cmd.code, cmd);
// };

// const nippleManager = create({
//     dataOnly: false,
//     zone: document.getElementById("joystick")
// });

// window['testBamboozle'] = () => {
//     apply(new BamboozleCommand());
// };

// let moveInterval;
// let curMoveCmd: MoveCommand;

// nippleManager.on("start", (event: EventData, data: JoystickOutputData) => {
//     moveInterval = setInterval(() => {
//         if (!curMoveCmd) return;
//         apply(curMoveCmd);
//     }, Params.tickRate);
// });

// nippleManager.on("move", (event: EventData, data: JoystickOutputData) => {
//     if (!curMoveCmd) {
//         curMoveCmd = new MoveCommand(data.angle.degree, data.distance * 2, data.angle.degree <= 180);
//     } else {
//         curMoveCmd.angle = data.angle.degree;
//         curMoveCmd.speed = data.distance * 2;
//         curMoveCmd.direction = data.angle.degree <= 180;
//     }
// });

// nippleManager.on("end", (event: EventData, data: JoystickOutputData) => {
//     clearInterval(moveInterval);
// });

// const bambutton = document.getElementById("bamboozle");
// let bambInterval;
// bambutton.onmousedown = event => {
//     bambInterval = setInterval(window["testBamboozle"], Params.tickRate)
// }
// bambutton.onmouseup = event => {
//     clearInterval(bambInterval);
// }

