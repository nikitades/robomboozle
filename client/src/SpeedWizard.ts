import { MoveCommand } from "../../server/webclient/src/common/commands";

/**
 * Keep in mind, that all these calculations are bound to the NippleJS plugin.
 * Which has 90 as the highest point on the angle circle:
 *      90
 * 180      360
 *      270
 */
export default class SpeedWizard {

    static leftMargin: number = 225;
    static rightMargin: number = 315;
    static maxForwardPower: number = SpeedWizard.leftMargin - 90;
    static maxBackwardPower: number = 270 - SpeedWizard.leftMargin;
    static easyAngle: number = 45;

    public static getSpeedAndDirection(cmd: MoveCommand): Navigation {

        //First we find the direction
        const [left, forward] = SpeedWizard.getDirection(cmd);

        //Then we decide how much is every motor loaded
        const leftSpeedBalance = SpeedWizard.getLeftSpeedBalance(left, forward, cmd);
        const rightSpeedBalance = SpeedWizard.getRightSpeedBalance(left, forward, cmd);

        //Then we normalize the input speed (which is max 100 from NippleJS as well).
        //We should normalize because the motors real speed line is very tricky.
        const normalizedSpeed = SpeedWizard.normalizeSpeed(forward, cmd);

        //And then we calculate the real speed of every motor.
        const leftSpeed = normalizedSpeed * (leftSpeedBalance / 100);
        const rightSpeed = normalizedSpeed * (rightSpeedBalance / 100);

        console.log({
            leftSpeed,
            rightSpeed,
            forward
        });

        return new Navigation(leftSpeed, rightSpeed, forward);
    }

    /**
     * How to interpret the output:
     * [true, true] = left-forward
     * [true, false] = left-backward
     * [false, true] = right-forward
     * [false, false] = right-backward
     * 
     * @param cmd 
     */
    private static getDirection(cmd: MoveCommand): boolean[] {
        console.log({cmd});
        if (cmd.angle <= SpeedWizard.leftMargin && cmd.angle > 90) {
            return [true, true];
        }
        if (cmd.angle > SpeedWizard.leftMargin && cmd.angle <= 270) {
            return [true, false];
        }
        if ((cmd.angle <= 90 && cmd.angle >= 0) || cmd.angle > SpeedWizard.rightMargin && cmd.angle <= 360) {
            return [false, true];
        }
        if (cmd.angle > 270 && cmd.angle <= SpeedWizard.rightMargin) {
            return [false, false];
        }
        throw new Error("UNCAUGHT ANGLE: " + cmd.angle);
    }

    private static getLeftSpeedBalance(left: boolean, forward: boolean, cmd: MoveCommand): number {
        if (forward) {
            if (!left) {
                return 100;
            } else {
                if (cmd.angle <= 360 && cmd.angle > SpeedWizard.rightMargin) {
                    const power = Math.abs(360 - cmd.angle) + 90;
                    if (power < SpeedWizard.easyAngle) return 100; //If it's close to 90* then it's exactly 90*. Yep, 45 degrees is close
                    return 90 + power;
                } else {
                    const power = Math.abs(90 - cmd.angle); //main line
                    if (power < SpeedWizard.easyAngle) return 100; //If it's close to 90* then it's exactly 90*. Yep, 45 degrees is close
                    return 100 * ((SpeedWizard.maxForwardPower - power) / SpeedWizard.maxForwardPower);
                }
            }
        } else {
            if (!left) {
                return 100;
            } else {
                const power = 270 - cmd.angle;
                if (power < 20) return 100;
                return 100 * ((SpeedWizard.maxBackwardPower - power) / SpeedWizard.maxBackwardPower);
            }
        }
    }

    private static getRightSpeedBalance(left: boolean, forward: boolean, cmd: MoveCommand): number {
        if (forward) {
            if (left) {
                return 100;
            } else {
                const power = Math.abs(90 - cmd.angle); //main line
                if (power < SpeedWizard.easyAngle) {
                    console.log("Easy angle: " + power);
                    return 100; //And again, we forgive the steerman for being slightly inaccurate
                } else {
                    console.log("Uneasy angle: " + power);
                }
                return 100 * ((SpeedWizard.maxForwardPower - power) / SpeedWizard.maxForwardPower);
            }
        } else {
            if (left) {
                return 100;
            } else {
                const power = Math.abs(270 - cmd.angle);
                if (power < 20) return 100;
                return 100 * ((SpeedWizard.maxBackwardPower - power) / SpeedWizard.maxBackwardPower);
            }
        }
    }

    /**
     * Here we receive values from 0 to 100.
     * But the motors do not feel the load below 32.
     * So...
     * 
     * @param forward 
     * @param cmd 
     */
    private static normalizeSpeed(forward: boolean, cmd: MoveCommand): number {
        let speed = cmd.speed;
        speed += 15;
        if (speed > 100) speed = 100;
        return speed;
    }
}

class Navigation {
    public left: number;
    public right: number;
    public direction: boolean;
    constructor(left: number, right: number, direction: boolean) {
        [this.left, this.right, this.direction] = [left, right, direction];
    }
}