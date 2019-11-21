import { IRoboCommand } from "../../common/commands";

export class MovementDriver {
    constructor() {
        this.startupCheck();
    }

    private commandsQueue: Array<IRoboCommand>;

    public order(cmd: IRoboCommand) {
        this.commandsQueue.push(cmd);
    }

    private do() {
        if (this.commandsQueue.length == 0) return;
        const cmd = this.commandsQueue.pop();
        cmd.apply();
    }

    private startupCheck() {

    }

}