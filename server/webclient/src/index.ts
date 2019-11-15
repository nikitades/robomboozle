import "./styles/main.css";
import "./styles/reset.css";
import "./libs/broadway/Decoder";
import "./libs/broadway/YUVCanvas";
import * as Player from "./libs/broadway/Player";
import * as io from 'socket.io-client';
import { create, EventData, JoystickOutputData } from 'nipplejs';

const player = new Player({
    useWorker: true,
    workerFile: "/js/libs/Decoder.js",
    webgl: true,
    size: { width: 640, height: 480 }
});

var container = document.getElementById("content");
player.canvas.id = "omegaCanvas";
container.appendChild(player.canvas);

const socket = io("http://" + document.location.host);

socket.on("nalucast", function (data) {
    player.decode(new Uint8Array(data));
});

const nippleManager = create({
    dataOnly: false
});

console.log({nippleManager});

// nippleManager.on("added", (event: EventData, nipple: JoystickOutputData) => {
//     console.log(nipple);
//     nipple.on("move", (data: JoystickOutputData) => {
//         console.log("Zhopa");
//     });
// });

nippleManager.on("move", (event: EventData, data: JoystickOutputData) => {
    console.log("Zhopa", data, event);
});