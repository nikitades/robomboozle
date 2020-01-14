import { MoveCommand } from "../../server/webclient/src/common/commands";

export default class SpeedWizard {
    public static getSpeed(cmd: MoveCommand): number[] {
        //TODO: тут
        const clearAngle = cmd.angle < 180 ? cmd.angle : (cmd.angle - (cmd.angle - 180) * 2);
        const leftSpeed = clearAngle <= 90 ? cmd.speed : ((180 - cmd.angle) / 90) * cmd.speed;
        const rightSpeed = clearAngle >= 90 ? cmd.speed : (cmd.angle / 90) * cmd.speed;

        console.log({
            leftSpeed,
            rightSpeed
        });

        return [leftSpeed, rightSpeed];
    }
}