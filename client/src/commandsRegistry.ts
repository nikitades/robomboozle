import { IRoboCommand } from "../../server/webclient/src/common/commands";

export interface ICommandsRegistry {
    getActive(code: string): IRoboCommand;
    getPrev(code: string): IRoboCommand;
    setActive(cmd: IRoboCommand): void;
    getTime(code: string): number;
    getDelay(code: string): number;
    clear(code: string): void;
    push<TRoboCommand extends IRoboCommand>(cmd: TRoboCommand): void;
    unshift<TRoboCommand extends IRoboCommand>(cmd: TRoboCommand): void;
    pop<TRoboCommand extends IRoboCommand>(code: string): TRoboCommand;
    purge(code: string): void;
}

export class CommandsRegistry implements ICommandsRegistry {
    getActive(code: string): IRoboCommand {
        return this.registry[code];
    }
    getPrev(code: string): IRoboCommand {
        return this.pastRegistry[code];
    }
    getTime(code: string): number {
        return this.chronometer[code];
    }
    getDelay(code: string): number {
        return Date.now() - this.getTime(code);
    }
    setActive(cmd: IRoboCommand): void {
        this.pastRegistry[cmd.code] = this.registry[cmd.code];
        this.registry[cmd.code] = cmd;
        this.setCurTime(cmd.code);
    }
    clear(code: string): void {
        this.pastRegistry[code] = this.registry[code];
        delete this.registry[code];
        this.setCurTime(code);
    }
    push<TRoboCommand extends IRoboCommand>(cmd: TRoboCommand): void {
        this.queue[cmd.code] = this.queue[cmd.code] || [];
        this.queue[cmd.code].push(cmd);
    }
    unshift<TRoboCommand extends IRoboCommand>(cmd: TRoboCommand): void {
        this.queue[cmd.code] = this.queue[cmd.code] || [];
        this.queue[cmd.code].unshift(cmd);
    }
    pop<TRoboCommand extends IRoboCommand>(code: string): TRoboCommand {
        return this.queue[code]?.pop() as TRoboCommand;
    }
    purge(code: string): void {
        this.queue[code] = this.queue[code] || [];
        this.queue[code] = [];
    }
    private setCurTime(code: string): void {
        this.chronometer[code] = Date.now();
    }
    private registry: {
        [code: string]: IRoboCommand
    } = {};
    private pastRegistry: {
        [code: string]: IRoboCommand
    } = {};
    private chronometer: {
        [code: string]: number
    } = {};
    private queue: {
        [code: string]: IRoboCommand[]
    } = {};
}