//TODO: Split the file...

import { Socket } from "socket.io";
import { PwmController } from "../server/server/pwmcontroller";

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

    public static createListeners(socket: Socket): void {
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

    public static createListeners(socket: Socket): void {
        socket.on(this.code, (cmd: MoveCommand) => {
            console.log("le movement");
            console.log(cmd.backward, cmd.forward, cmd.right, cmd.left);
            PwmController.movements.push(cmd);
        });
    }
}

export class BamboozleCommand extends RoboCommand {
    constructor(bamboozlePower: PwmValue) {
        super();
        this.bamboozlePower = bamboozlePower;
    }

    public static readonly code: string = MoveCommand.prefix + "_bamboozle";
    public code: string = BamboozleCommand.code;

    public readonly bamboozlePower: PwmValue;

    public static createListeners(socket: Socket): void {
        socket.on(this.code, (cmd: BamboozleCommand) => {
            console.log("le bamboozle");
            console.log(cmd);
            PwmController.bamboozling.push(cmd);
        });
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