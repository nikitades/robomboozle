import { BamboozleCommand } from "../../server/webclient/src/common/commands";

enum BamboozleDirection {
    down,
    up
}

//Class to calculate PWM degree over the time
export class BamboozleMaster {
    private direction: BamboozleDirection = BamboozleDirection.up;
    private BASE: number = 500;
    private STEP: number = 500;
    private MAX: number = 2500;
    private prevDutyValue: number = this.BASE;

    /**
     * Calculates the new bamboozling stick position. It should go 500-2500-500-2500-500-2500...
     * 
     * @returns number
     */
    public getNewDutyValue(): number {
        if (this.prevDutyValue == this.BASE) {
            this.direction = BamboozleDirection.up - this.direction;
            return this.prevDutyValue = this.BASE + this.STEP;
        }
        if (this.prevDutyValue == this.MAX) {
            this.direction = BamboozleDirection.up - this.direction;
            return this.prevDutyValue = this.MAX - this.STEP;
        }
        return this.direction == BamboozleDirection.up
            ? this.prevDutyValue = this.prevDutyValue + this.STEP
            : this.prevDutyValue = this.prevDutyValue - this.STEP;
    }
}