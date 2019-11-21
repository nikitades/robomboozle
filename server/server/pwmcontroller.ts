import { MoveCommand, BamboozleCommand } from "../../common/commands";

export class PwmController {

    private static interval: NodeJS.Timeout;
    private static tick: number = 50;

    private static activeBamboozleCmd: BamboozleCommand;
    private static bamboozleCmdChangeTime: number;

    private static activeMoveCommand: MoveCommand;
    private static moveCmdChangeTime: number;

    private static bamboozle(cmd: BamboozleCommand): void {
        this.activeBamboozleCmd = cmd;
        this.bamboozleCmdChangeTime = Date.now();
        console.log('started bamb');
        setTimeout(() => {
            delete this.activeBamboozleCmd;
            this.bamboozleCmdChangeTime = Date.now();
        }, this.tick);
        //pigpio -> pwm 100
    }

    private static stopBamboozle(): void {
        console.log('finished bamb');
        //pigpio -> pwm 0 
    }

    private static move(cmd: MoveCommand): void {
        this.activeMoveCommand = cmd;
        this.moveCmdChangeTime = Date.now();
        console.log('started move');
        setTimeout(() => {
            delete this.activeMoveCommand;
            this.moveCmdChangeTime = Date.now();
        }, this.tick);
    }

    private static stopMove(): void {
        console.log('finished move');
        //gpio -> pwm low 2 all motor pins
    }

    public static serve(): void {
        if (!this.activeBamboozleCmd) {
            const bamboozleCmd = this.bamboozling.pop();
            if (bamboozleCmd) this.bamboozle(bamboozleCmd);
            else if ((Date.now() - this.bamboozleCmdChangeTime) < this.tick) this.stopBamboozle();
        } else {
            console.log("Bamb in progress...");
        }

        if (!this.activeMoveCommand) {
            const moveCmd = this.movements.pop();
            if (moveCmd) this.move(moveCmd);
            else if ((Date.now() - this.moveCmdChangeTime) < this.tick) this.stopMove();
        } else {
            console.log("Move in progress...");
        }
    }

    public static run(): void {
        this.interval = setInterval(this.serve.bind(this), this.tick);
    }

    public static stop(): void {
        clearInterval(this.interval);
    }

    public static movements: MoveCommand[] = [];
    public static bamboozling: BamboozleCommand[] = [];


}