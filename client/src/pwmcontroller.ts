import { MoveCommand, BamboozleCommand, IRoboCommand } from "../../common/commands";
import Params from "../../common/params";
import { ICommandsRegistry, CommandsRegistry } from "./commandsRegistry";
import { BamboozleMaster } from "./bamboozleMaster";

export class PwmController {

    private static interval: NodeJS.Timeout;
    private static tick: number = Params.tickRate;

    private static registry: ICommandsRegistry = new CommandsRegistry();
    private static bambMaster: BamboozleMaster = new BamboozleMaster();

    // private static bamboozleGpio: 

    private static bamboozle(cmd: BamboozleCommand): void {
        this.registry.setActive(cmd);
        console.log('started bamb');
        setTimeout(this.registry.clear.bind(this.registry, cmd.code), this.tick);
        //pigpio -> pwm 100
    }

    private static stopBamboozle(): void {
        console.log('finished bamb');
        //pigpio -> pwm 0 
    }

    private static move(cmd: MoveCommand): void {
        this.registry.setActive(cmd);
        //gpio -> pwm 0-100 to 2 of 4 motor pins
        console.log('started move');
        setTimeout(this.registry.clear.bind(this.registry, cmd.code), this.tick);
    }

    private static stopMove(): void {
        console.log('finished move');
        //gpio -> pwm low 2 all motor pins
    }

    public static push<TRoboCommand extends IRoboCommand>(cmd: TRoboCommand): void {
        this.registry.push<TRoboCommand>(cmd);
    }

    public static serve(): void {
        if (!this.registry.getActive(BamboozleCommand.code)) {
            const bamboozleCmd = this.registry.pop<BamboozleCommand>(BamboozleCommand.code);
            if (bamboozleCmd) this.bamboozle(bamboozleCmd);
            else if (this.registry.getDelay(BamboozleCommand.code) < this.tick) this.stopBamboozle();
        } else {
            console.log("Bamb in progress...");
        }

        if (!this.registry.getActive(MoveCommand.code)) {
            const moveCmd = this.registry.pop<MoveCommand>(MoveCommand.code);
            if (moveCmd) this.move(moveCmd);
            else if (this.registry.getDelay(MoveCommand.code) < this.tick) this.stopMove();
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
}