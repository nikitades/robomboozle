import "./styles/main.css";
import "./styles/reset.css";
import "./libs/broadway/Decoder";
import "./libs/broadway/YUVCanvas";
import { MoveCommand, BamboozleCommand, IRoboCommand } from "../../../common/commands";
import Params from "../../../common/params";
import * as Player from "./libs/broadway/Player";
import * as io from 'socket.io-client';
import { create, EventData, JoystickOutputData } from 'nipplejs';

const player = new Player({
    useWorker: false,
    workerFile: "/js/libs/Decoder.js",
    webgl: true,
    size: { width: 640, height: 480 }
});

var container = document.getElementById("content");
player.canvas.id = "omegaCanvas";
container.appendChild(player.canvas);

const socket = io("http://" + document.location.host, {
    path: "/fedcba"
});

socket.on("nalucast", function (data) {
    player.decode(new Uint8Array(data));
});

const apply = (cmd: IRoboCommand) => {
    console.log({
        "str": cmd.code,
        "orig": cmd,
        "conc": cmd + ""
    });
    socket.emit(cmd.code, cmd);
};

const nippleManager = create({
    dataOnly: false,
    zone: document.getElementById("joystick")
});

// nippleManager.on("added", (event: EventData, nipple: JoystickOutputData) => {
//     console.log(nipple);
//     nipple.on("move", (data: JoystickOutputData) => {
//         console.log("Zhopa");
//     });
// });

window['testForward'] = () => {
    apply(new MoveCommand(10, 90, 70, 0));
};

window['testBamboozle'] = () => {
    apply(new BamboozleCommand(100));
};

nippleManager.on("move", (event: EventData, data: JoystickOutputData) => {
    console.log("Zhopa", data, event);
});

const tick: number = Params.tickRate;

const bambutton = document.getElementById("bamboozle");
let bambInterval;
bambutton.onmousedown = event => {
    bambInterval = setInterval(window["testBamboozle"], tick)
}
bambutton.onmouseup = event => {
    clearInterval(bambInterval);
}