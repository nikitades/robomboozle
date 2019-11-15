//TODO: Split the file...

export interface IRoboCommand {
    toString(): string;
    apply(): void;
}

class RoboCommand implements IRoboCommand {
    constructor(code: string) {
        this.code = code;
    }
    private code: string;

    public toString(): string {
        return this.code;
    }

    public apply() {
        throw new Error("Not implemented");
    }
}

export class MoveCommand extends RoboCommand {
    constructor(
        code: string,
        left: PwmValue,
        right: PwmValue,
        forward: PwmValue,
        backward: PwmValue
    ) {
        super(code);
        this.left = left;
        this.right = right;
        this.forward = forward;
        this.backward = backward;
    }

    public readonly left: PwmValue;
    public readonly right: PwmValue;
    public readonly forward: PwmValue;
    public readonly backward: PwmValue;
}

export class BamboozleCommand extends RoboCommand {
    constructor(code: string, bamboozlePower: PwmValue) {
        super(code);
        this.bamboozlePower = bamboozlePower;
    }

    public readonly bamboozlePower: PwmValue;
}

export class PwmValue extends Number { }