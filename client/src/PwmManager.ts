import { Gpio } from "onoff";

export class PwmManager {
    constructor(config: PwmConfig) {
        this.config = config;
    }

    public static SLOT_1: MotorNumber = 1;
    public static SLOT_2: MotorNumber = 2;
    public static SLOT_3: MotorNumber = 3;
    public static SLOT_4: MotorNumber = 4;

    public static setPins(config: PwmConfig) {
        /**
         * V. Инициировать порты
         * 2. Понять, как настройка шифта происходит
         * 3. Попробовать погонять вращение колёс через ноду
         */
    }

    private readonly config: PwmConfig;
    private ports: {
        [name: number]: Gpio
    } = {
            0: new Gpio(this.config.motorPins.motor1, "out"),
            1: new Gpio(this.config.motorPins.motor2, "out"),
            2: new Gpio(this.config.motorPins.motor3, "out"),
            3: new Gpio(this.config.motorPins.motor4, "out")
        }
}

export class PwmConfig {
    public shiftPins: ShiftPins;
    public motorPins: MotorPins;
}

export class ShiftPins {
    public latch: number;
    public clock: number;
    public serial: number;
}

export class MotorPins {
    public motor1: number;
    public motor2: number;
    public motor3: number;
    public motor4: number;
}

class PortNumber extends Number { }
class MotorNumber extends Number { } 