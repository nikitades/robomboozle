import "../libs/broadway/Decoder";
import "../libs/broadway/YUVCanvas";
import * as Player from "../libs/broadway/Player";

export default class BroadwayFactory {
    static createPlayer() {
        const player = new Player({
            useWorker: false,
            workerFile: "/js/libs/Decoder.js",
            webgl: true,
            size: { width: 640, height: 480 }
        });
        return player;
    }
}