enum BamboozleDirection {
    up,
    down
}

export class BamboozleMaster {
    private prevDutyValue: number = 0;
    private direction: BamboozleDirection = BamboozleDirection.up;
    private maxDutyValue: number = 15;

    public getNewDutyValue(): number {
        if (this.prevDutyValue == 0) {
            this.direction = BamboozleDirection.up - this.direction;
            return this.prevDutyValue = 1;
        }
        if (this.prevDutyValue == this.maxDutyValue) {
            this.direction = BamboozleDirection.up - this.direction;
            return this.prevDutyValue = this.maxDutyValue - 1;
        }
        return this.direction == BamboozleDirection.up ? this.prevDutyValue = ++this.prevDutyValue : this.prevDutyValue = --this.prevDutyValue;
    }
}