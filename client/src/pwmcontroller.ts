import { MoveCommand, BamboozleCommand, IRoboCommand, StopCommand } from "../../server/webclient/src/common/commands";
import Params from "../../server/webclient/src/common/params";
import { ICommandsRegistry, CommandsRegistry } from "./commandsRegistry";
import { BamboozleMaster } from "./bamboozleMaster";
import { Gpio } from "pigpio";
import SpeedWizard from "./SpeedWizard";
const L298N = require("pigpio-l298n");

export class PwmController {

    private static interval: NodeJS.Timeout;
    private static tick: number = Params.tickRate;

    private static registry: ICommandsRegistry = new CommandsRegistry();
    private static bambMaster: BamboozleMaster = new BamboozleMaster();

    private static motors: any = new L298N(17, 27, 22, 16, 20, 21); //Here I choose the GPIO pins
    private static prevDir: boolean;
    private static bamboozler: Gpio = new Gpio(12, { mode: Gpio.OUTPUT });

    private static bamboozle(cmd: BamboozleCommand): void {
        this.registry.setActive(cmd);
        const dutyVal = this.bambMaster.getNewDutyValue();
        console.log({
            dutyVal
        });
        this.bamboozler.servoWrite(dutyVal.valueOf());
        setTimeout(this.registry.clear.bind(this.registry, cmd.code), this.tick);
    }

    private static stopBamboozle(): void {
        console.log('finished bamb');
        //Bamboozling is a cycled process. Therefore there is no need to set bamboozling pin to zero at the end of the cycle.
    }

    private static move(cmd: MoveCommand): void {
        const nav = SpeedWizard.getSpeedAndDirection(cmd);
        if (nav.direction !== this.prevDir) {
            for (let i = 0; i < (250 / Params.tickRate); i++) {
                this.registry.purge(MoveCommand.code);
                this.registry.push(new StopCommand());
            }
            this.prevDir = nav.direction;
            return;
        }

        this.prevDir = nav.direction;

        this.registry.setActive(cmd);

        nav.direction === MoveCommand.DIR_F
            ? this.motors.forward(this.motors.NO1) || this.motors.forward(this.motors.NO2)
            : this.motors.backward(this.motors.NO1) || this.motors.backward(this.motors.NO2);

        this.motors.setSpeed(this.motors.NO1, nav.left);
        this.motors.setSpeed(this.motors.NO2, nav.right);

        setTimeout(this.registry.clear.bind(this.registry, cmd.code), this.tick);
    }

    private static stopMove(): void {
        console.log('finished move');
        this.motors.stop(this.motors.NO1);
        this.motors.stop(this.motors.NO2);
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

        if (!this.registry.getActive(StopCommand.code)) {
            const stopCmd = this.registry.pop<StopCommand>(StopCommand.code);
            if (stopCmd) this.stopMove();
        } else {
            console.log("Relaxing...");
        }
    }

    public static run(): void {
        const fuckdown = this.motors.stop.bind(this.motors, this.motors.NO1);
        const fuckdown2 = this.motors.stop.bind(this.motors, this.motors.NO2);
        process.on("SIGINT", function () {
            fuckdown();
            fuckdown2();
            process.exit(0);
        });
        this.interval = setInterval(this.serve.bind(this), this.tick);
    }

    public static stop(): void {
        clearInterval(this.interval);
    }
}