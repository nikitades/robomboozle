//TODO: Split the file...

import { PwmController } from "../client/src/pwmcontroller";

export interface IRoboCommand {
    readonly code: string;
    apply(): void;
}

export abstract class RoboCommand implements IRoboCommand {
    public static readonly prefix: string = "rbcmd";

    public static readonly code: string = RoboCommand.prefix + "_error";
    public abstract readonly code: string = RoboCommand.code;

    public apply() {
        throw new Error("Not implemented");
    }

    public static createClientListeners(socket: any): void {
        throw new Error("Not impelemnted");
    };
}

export class MoveCommand extends RoboCommand {
    constructor(
        left: PwmValue,
        right: PwmValue,
        forward: PwmValue,
        backward: PwmValue
    ) {
        super();
        this.left = left;
        this.right = right;
        this.forward = forward;
        this.backward = backward;
    }

    public static readonly code = MoveCommand.prefix + "_move";
    public readonly code: string = MoveCommand.code;

    public readonly left: PwmValue;
    public readonly right: PwmValue;
    public readonly forward: PwmValue;
    public readonly backward: PwmValue;

    public static createClientListeners(socket: any): void {
        socket.on(this.code, PwmController.push.bind(PwmController));
    }
}

export class BamboozleCommand extends RoboCommand {
    constructor(bamboozlePower: PwmValue) {
        super();
        this.bamboozlePower = bamboozlePower;
    }

    public static readonly code: string = MoveCommand.prefix + "_bamboozle";
    public code: string = BamboozleCommand.code;

    public readonly bamboozlePower: PwmValue = 100;

    /**
     * Takes the web socket and binds the SoC-related actions on its commands
     * 
     * @param socket 
     */
    public static createClientListeners(socket: any): void {
        socket.on(this.code, PwmController.push.bind(PwmController));
    }
}

export class PwmValue extends Number {
    constructor(value: number) {
        if (value > 100) {
            throw new Error("The PWM value is too big! (" + value + ")");
        }
        super(value);
    }
}