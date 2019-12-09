import { IRoboCommand, MoveCommand } from "../../common/commands";

export class MoveMaster {

    apply(cmd: MoveCommand): void {
        const directionBalance = this.calcDirection(cmd);
        const speedBalance = this.calcSpeed(cmd);
        //TODO: превратить цифры баланса в сигналы PWM. Озвучить в консоли
    }
    
    /**
     * Returns the number 0-100 assuming 50 is an ideal wheel balance and strict forward direction. 0 is left, 100 is right.
     * 
     * @returns number
     */
    calcDirection(cmd: MoveCommand): number {
        return 0;
    }

    /**
     * Returns the number 0-100 assuming 50 is a stopped engine. 0 is full backwards, 100 is full forward.
     * 
     * @returns number
     */
    calcSpeed(cmd: MoveCommand): number {
        return 0;
    }
}