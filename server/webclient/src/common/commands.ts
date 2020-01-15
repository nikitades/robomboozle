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
        angle: number,
        speed: number,
        direction: boolean
    ) {
        super();
        this.angle = angle;
        this.speed = speed;
        this.direction = direction;
    }

    public static readonly DIR_F = true;
    public static readonly DIR_B = false;

    public static readonly code = MoveCommand.prefix + "_move";
    public readonly code: string = MoveCommand.code;

    public angle: number = 90; //0-360
    public speed: number = 0; //0-50
    public direction: boolean = MoveCommand.DIR_F;
}

export class StopCommand extends RoboCommand {
    public static readonly code: string = StopCommand.prefix + "_stop";
    public code: string = StopCommand.code;
}

export class BamboozleCommand extends RoboCommand {
    public static readonly code: string = MoveCommand.prefix + "_bamboozle";
    public code: string = BamboozleCommand.code;
}

export class StartStreamCommand extends RoboCommand {
    public static readonly code: string = StartStreamCommand.prefix + "_start_stream";
    public code: string = StartStreamCommand.code;
}

export class StopStreamCommand extends RoboCommand {
    public static readonly code: string = StopStreamCommand.prefix + "_stop_stream";
    public code: string = StopStreamCommand.code;
}

export class RestartStreamCommand extends RoboCommand {
    public static readonly code: string = RestartStreamCommand.prefix + "_restart_stream";
    public code: string = RestartStreamCommand.code;
}