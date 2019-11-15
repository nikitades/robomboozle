//TODO: Split the file...

export interface IRoboCommand {
    toString(): string;
    apply(): void;
}

abstract class RoboCommand implements IRoboCommand {
    public readonly code: string;

    public toString(): string {
        return this.code;
    }

    public apply() {
        throw new Error("Not implemented");
    }
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

    public readonly code: string = "move";
    public readonly left: PwmValue;
    public readonly right: PwmValue;
    public readonly forward: PwmValue;
    public readonly backward: PwmValue;
}

export class BamboozleCommand extends RoboCommand {
    constructor(bamboozlePower: PwmValue) {
        super();
        this.bamboozlePower = bamboozlePower;
    }

    public readonly code: string = "bamboozle";
    public readonly bamboozlePower: PwmValue;
}

export class PwmValue extends Number { }