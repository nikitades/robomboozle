const Split = require("stream-split");
import { ChildProcess, spawn, execSync } from "child_process";
import { createReadStream } from "fs";
import { Readable } from "stream";
import * as SocketIOClient from "socket.io-client";
import { Socket as TcpSocket } from "net";
import { MoveCommand, BamboozleCommand } from "../../common/commands";

/**
 * It's the class for duplex network interaction.
 * This app sends the video stream to some server.
 * And then listens for the websocket commands from this (or another) server.
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
        this.raspividParams = raspividParams;
        this.transmitterParams = transmitterParams;

        if (this.raspividParams.timeout > 0) {
            console.log("WARNING! Non-zero timeout has been set. This may cause a severe lagging.");
        }

        this.wsClient = SocketIOClient(`http://${this.transmitterParams.wsHost}:${this.transmitterParams.wsPort}`, {
            path: "/" + this.transmitterParams.secret
        });
        this.tcpClient = new TcpSocket().connect({
            port: Number(this.transmitterParams.tcpPort),
            host: this.transmitterParams.tcpHost
        });
        this.listenForWsCommands();
    }

    private wsClient: SocketIOClient.Socket;
    private tcpClient: TcpSocket;
    private raspividParams: RaspividParams;
    private transmitterParams: TransmitterParams;
    private source: Readable;
    private process: ChildProcess;
    private splitter: any; //TODO: create types for the Splitter
    private NALSeparator: Buffer = Buffer.from([0, 0, 0, 1]);

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
    public startCameraPipe(): this {

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
            '-pf', "baseline"//'baseline'
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
        return this;
    }

    public stopCameraPipe(): this {
        this.source.unpipe(this.splitter);
        delete this.source;
        delete this.process;
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
     * We provide the server with the plain chunks instead. The server pipes the stream to the NAL-splitter itself.
     * 
     * @param chunk 
     */
    private stream(chunk: any): void {
        console.log(chunk); //TODO: remove
        this.tcpClient.write(chunk);
    }

    /**
     * Let's implement the commands pipeline!
     * Here the server tells the robot what it has to do.
     */
    private listenForWsCommands(): void {
        MoveCommand.createClientListeners(this.wsClient);
        BamboozleCommand.createClientListeners(this.wsClient); //TODO тут
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