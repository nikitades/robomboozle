import "../libs/broadway/Decoder";
import "../libs/broadway/YUVCanvas";
import * as Player from "../libs/broadway/Player";

export default class BroadwayFactory {
    static createPlayer(w = 640, h = 480) {
        return new Player({
            useWorker: false,
            workerFile: "/js/libs/Decoder.js",
            webgl: false,
            size: { width: w, height: h }
        });
    }

    static getPlayer(w = 640, h = 480) {
        if (JSON.stringify(params) === JSON.stringify([w, h])) {
            return player;
        }
        player = BroadwayFactory.createPlayer(w, h);
        params = [w, h];
        return player;
    }
}

let params = [640, 480];
let player = BroadwayFactory.createPlayer(640, 480);