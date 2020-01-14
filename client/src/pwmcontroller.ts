import { MoveCommand, BamboozleCommand, IRoboCommand } from "../../server/webclient/src/common/commands";
import Params from "../../server/webclient/src/common/params";
import { ICommandsRegistry, CommandsRegistry } from "./commandsRegistry";
import { BamboozleMaster } from "./bamboozleMaster";
import { Gpio } from "pigpio";
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
        this.registry.setActive(cmd);
        console.log('started move'); 

        const clearAngle = cmd.angle < 180 ? cmd.angle : (cmd.angle - (cmd.angle - 180) * 2);
        const leftSpeed = clearAngle <= 90 ? cmd.speed : ((180 - cmd.angle) / 90) * cmd.speed;
        const rightSpeed = clearAngle >= 90 ? cmd.speed : (cmd.angle / 90) * cmd.speed;

        console.log({
            leftSpeed,
            rightSpeed
        });

        cmd.direction === MoveCommand.DIR_F
            ? this.motors.forward(this.motors.NO1) || this.motors.forward(this.motors.NO2)
            : this.motors.backward(this.motors.NO1) || this.motors.backward(this.motors.NO2);

        this.motors.setSpeed(this.motors.NO1, leftSpeed);
        this.motors.setSpeed(this.motors.NO2, rightSpeed);

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

/**
 *
 * const readline = require('readline');
const L298N = require("pigpio-l298n");
//bcm code
let l298n = new L298N(17,27,22,null,null,null);
l298n.setSpeed(l298n.NO1,20);

const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
});
rl.on('line', function (input) {
    if (input === 'quit()') {
        rl.close();
    } else if (input === 'f') {
        l298n.forward(l298n.NO1);
    } else if (input === 'b') {
        l298n.backward(l298n.NO1)
    } else if (input === 't') {
        l298n.stop(l298n.NO1);
    } else {
        l298n.setSpeed(l298n.NO1,parseInt(input));
    }
});

process.on("SIGINT", function(){
    l298n.stop(l298n.NO1);
    console.log('shutdown!');
    process.exit(0);
});

 */