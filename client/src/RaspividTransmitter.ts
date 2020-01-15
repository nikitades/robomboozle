const Split = require("stream-split");
import { ChildProcess, spawn, execSync } from "child_process";
import { createReadStream } from "fs";
import { Readable } from "stream";
import * as SocketIOClient from "socket.io-client";
import { Socket as TcpSocket } from "net";
import { MoveCommand, BamboozleCommand, StartStreamCommand, StopStreamCommand, RestartStreamCommand, StopCommand } from "../../server/webclient/src/common/commands";
import { PwmController } from "./PwmController";
import Params from "../../server/webclient/src/common/params";

/**
 * It's a class for two-way network interaction.
 * This app sends the video stream to some server.
 * And then listens for websocket commands from this (or another) server.
 * 
 * In the real world it is the robot with video camera.
 * It streams what it sees, and it does what it receives from the websockets.
 * 
 * We use TCP for video streaming and WebSockets (socket.io) for simple commands pipeline.
 * 
 * IMPORTANT: I personally don't think it's a good idea to pre-process the stream on the Raspberry Pi (or whatever small PC you use).
 * Instead let it just throw away some bytes to achieve the least possible latency.
 * The bytes are gonna be reassembled in stream and split by frames (via the NAL separator) on some remote server (with obviously higher CPU rate).
 */
export class RaspividTransmitter {
    constructor(transmitterParams: TransmitterParams, raspividParams: RaspividParams) {
        this.startPreparation();
        this.raspividParams = raspividParams;
        this.transmitterParams = transmitterParams;

        if (this.raspividParams.timeout > 0) {
            console.log("WARNING! Non-zero timeout has been set. This may cause a severe lagging.");
        }

        this.connectTcpClient();
        this.connectWsClient();
        this.listenForWsCommands();
        this.setDefaultSplitter(); //Could be reassigned at the runtime
        this.prepared("general");
    }

    private readiness: { [key: string]: boolean } = {};
    public ready: Promise<void> = new Promise(res => {
        this.getReady = res;
    });
    private getReady: Function;

    private reconnectTcpInterval: NodeJS.Timeout;

    private wsClient: SocketIOClient.Socket;
    private tcpClient: TcpSocket;
    private raspividParams: RaspividParams;
    private transmitterParams: TransmitterParams;
    private source: Readable;
    private process: ChildProcess;
    private splitter: any; //TODO: create types for the Splitter
    private NALSeparator: Buffer = Buffer.from([0, 0, 0, 1]);

    private isCameraPipeRunning: boolean = false;

    /** BELOW PREPARATION METHODS ARE COMING */

    /**
     * Prepares the system parts for the work.
     * All the items are to be consequently initialized.
     */
    private startPreparation() {
        this.readiness = {
            "ws_connection": false,
            "tcp_connection": false,
            "general": false
        };
    }

    /**
     * Marks the system part as ready.
     * If all the parts are ready, resolves the readiness promise.
     * 
     * @param key 
     */
    private prepared(key: string) {
        this.readiness[key] = true;
        if (Object.values(this.readiness).every(item => !!item)) {
            console.log("system is up");
            this.getReady();
        }
    }

    /**
     * Creates the TCP connection. In case of disconnect is called by interval.
     */
    private connectTcpClient() {
        console.log("trying to establish the tcp connection");
        try {
            if (!this.tcpClient) {
                console.log('creating new tcp client');
                this.tcpClient = new TcpSocket();
                this.tcpClient.on("connect", () => {
                    console.log("tcp connection established");
                    clearInterval(this.reconnectTcpInterval);
                    if (this.tcpClient.isPaused()) this.tcpClient.resume();
                    this.prepared("tcp_connection");
                });
                this.tcpClient.on("error", (err: Error) => {
                    console.log("Failed: " + err.message);
                    clearInterval(this.reconnectTcpInterval);
                    this.stopCameraPipe();
                    this.tcpClient.pause();
                    this.tcpClient.destroy();
                    this.reconnectTcpInterval = setInterval(this.connectTcpClient.bind(this), 5000);
                });
            }
            this.tcpClient.connect({
                port: Number(this.transmitterParams.tcpPort),
                host: this.transmitterParams.tcpHost
            });
        } catch (e) {
            console.log("oh: " + e.message);
        }
    }

    /**
     * Creates the WS connection.
     */
    private connectWsClient() {
        if (!this.wsClient) {
            this.wsClient = SocketIOClient(`http://${this.transmitterParams.wsHost}:${this.transmitterParams.wsPort}`, {
                path: "/robot/" + this.transmitterParams.secret
            });
        }
        this.wsClient.on("connect", () => {
            console.log("ws connection established");
            this.prepared("ws_connection");
        });
    }

    /** BELOW STREAMING METHODS ARE COMING */

    /**
     * Sets the default h264 split token
     */
    public setDefaultSplitter(): this {
        this.splitter = new Split(this.NALSeparator);
        return this;
    }

    /**
     * Sets some custom stream split token (use if standard h264 split token [0,0,0,1] does not work)
     * @param delim Bytes sequence to split by
     */
    public setSplitter(delim: Buffer): this {
        this.NALSeparator = delim;
        this.splitter = new Split(delim);
        return this;
    }

    /**
     * Starts the camera stream process polling.
     * The point is that this program can either manage the stream right on SoC (Raspbery or whatever), or can leave it to the server.
     * This makes some additional CPU load and hence some ms of lag. It's up to you. By default it's disabled.
     * Pass --splitOnSoc true among the CLI arguments to turn it on, and don't forget to make your backend ready for the stream already split.
     * (Robomboozle Backend is ready btw. It will just reassemble the stream once againg)
     */
    public async startCameraPipe(): Promise<this> {
        if (this.isCameraPipeRunning) return;
        await this.ready;

        if (!this.checkIfRaspividExists()) {
            throw new Error("No raspivid seems to be installed!");
        }

        const args = [
            '-t', this.raspividParams.timeout.toString(),
            '-o', '-',
            "-n",
            "-rot", this.raspividParams.rotation.toString(),
            '-w', this.raspividParams.width.toString(),
            '-h', this.raspividParams.height.toString(),
            '-fps', this.raspividParams.fps.toString(),
            '-pf', "baseline"
        ];

        console.log("raspivid " + args.join(" "));

        this.process = spawn('raspivid', args);
        this.source = this.process.stdout;
        if (this.raspividParams.splitOnSoc) {
            console.log("I assume you know what you are doing");
            console.log("https://cdn-images.threadless.com/threadless-media/artist_shops/shops/nathanwpyle/products/1013079/shirt-1557671493-e06ae1890509b370a63a78faa4528738.png?v=3&d=eyJvbmx5X21ldGEiOiBmYWxzZSwgImZvcmNlIjogZmFsc2UsICJvcHMiOiBbWyJ0cmltIiwgW2ZhbHNlLCBmYWxzZV0sIHt9XSwgWyJyZXNpemUiLCBbXSwgeyJ3aWR0aCI6IDk5Ni4wLCAiYWxsb3dfdXAiOiBmYWxzZSwgImhlaWdodCI6IDk5Ni4wfV0sIFsiY2FudmFzX2NlbnRlcmVkIiwgWzEyMDAsIDEyMDBdLCB7ImJhY2tncm91bmQiOiAiZjk4NWFhIn1dLCBbInJlc2l6ZSIsIFs4MDBdLCB7fV0sIFsiY2FudmFzX2NlbnRlcmVkIiwgWzgwMCwgODAwLCAiI2ZmZmZmZiJdLCB7fV0sIFsiZW5jb2RlIiwgWyJqcGciLCA4NV0sIHt9XV19");
            this.source.pipe(this.splitter).on("data", this.stream.bind(this));
        } else {
            this.source.on("data", this.stream.bind(this));
        }
        this.isCameraPipeRunning = true;
        console.log("started camera pipe");
        return this;
    }

    public stopCameraPipe(): this {
        if (!this.isCameraPipeRunning) return;
        if (this.source) {
            this.source.unpipe(this.splitter);
            delete this.source;
        }
        if (this.process) {
            this.process.kill();
            delete this.process;
        }
        this.isCameraPipeRunning = false;
        console.log("stopped camera pipe");
        return this;
    }

    /**
     * Some debug methods. 
     * This one pipes the console input to the remote TCP server.
     * For debug purposes only.
     */
    public startConsolePipe(): this {
        this.source = process.stdin; //cafeful, this is the global process instance
        process.stdin.on("data", (dataPiece: any) => this.stream(dataPiece));
        return this;
    }

    public stopConsolePipe(): this {
        this.source.unpipe(this.splitter);
        delete this.source;
        return this;
    }

    /**
     * Some debug methods. 
     * This one pipes some provided file by frames to the remote TCP server.
     * The splitter mode is intentionally turned on this time.
     * For debug purposes only.
     * @param path 
     */
    public startFilePipe(path: string): this {
        this.source = createReadStream(path);
        this.source.pipe(this.splitter).on("data", (dataPiece: any) => {
            this.stream(dataPiece)
        });
        return this;
    }

    public stopFilePipe(): this {
        this.source.unpipe(this.splitter);
        delete this.source;
        return this;
    }

    /**
     * Here we don't transform the stream to re-split it again via the NAL-splitter.
     * We provide the server with the plain chunks instead. The server pipes the stream to the NAL-splitter itself. (see server.ts in the server folder, "NALSeparator")
     * 
     * @param chunk 
     */
    private stream(chunk: Buffer): void {
        this.tcpClient.write(chunk);
    }

    /**
     * Let's implement the commands pipeline!
     * Here the server tells the robot what it has to do.
     */
    private listenForWsCommands(): void {
        let prevDir = null;
        this.wsClient.on(MoveCommand.code, (cmd: MoveCommand) => {
            if (prevDir === null) prevDir = cmd.direction;
            //We should not switch the motor direction immediately. 250 ms pause
            else if (prevDir !== cmd.direction) {
                for (let i = 0; i < (250 / Params.tickRate); i++) {
                    PwmController.push(new StopCommand());
                }
                prevDir = cmd.direction;
            }
            PwmController.push(cmd);
        });
        // this.wsClient.on(BamboozleCommand.code, PwmController.push.bind(PwmController));
        this.wsClient.on(BamboozleCommand.code, () => {
            PwmController.push(new MoveCommand(90, 0, true));
        });
        this.wsClient.on(StartStreamCommand.code, () => this.startCameraPipe());
        this.wsClient.on(StopStreamCommand.code, () => this.stopCameraPipe());
        this.wsClient.on(RestartStreamCommand.code, () => this.stopCameraPipe() && this.startCameraPipe());
    }

    /**
     * A strict checking method.
     * Since this program was made raspivid-compatible only,
     * it requires the correct raspivid installation.
     * Throws some exception if no raspivid found.
     */
    private checkIfRaspividExists(): boolean {
        try {
            const buf = execSync("raspivid -t 0 -o -");
            return true;
        } catch (e) {
            if (e.code == "ENOBUFS") return true; //It's okay and working. We've found out that by the overflown buffer
            console.log(`Failed: because: ${e.message}`);
            return false;
        }
    }
}

export class TransmitterParams {
    constructor(
        tcpHost: string,
        tcpPort: string,
        wsHost: string,
        wsPort: string,
        secret: string
    ) {
        this.tcpHost = tcpHost;
        this.tcpPort = tcpPort;
        this.wsHost = wsHost;
        this.wsPort = wsPort;
        this.secret = secret;
    }

    tcpHost: string;
    tcpPort: string;
    wsHost: string;
    wsPort: string;
    secret: string;
}

export class RaspividParams {
    constructor(
        width: number = 640,
        height: number = 480,
        rotation: number = 0,
        fps: number = 30,
        timeout: number = 0,
        splitOnSoc: boolean = false
    ) {
        this.width = width;
        this.height = height;
        this.rotation = rotation;
        this.fps = fps;
        this.timeout = timeout;
        this.splitOnSoc = splitOnSoc;
    }

    width: number;
    height: number;
    rotation: number;
    fps: number;
    timeout: number; //do not use it!
    splitOnSoc: boolean;
}