import { RaspividTransmitter, RaspividParams, TransmitterParams } from "./RaspividTransmitter";
import args from "./argparser"
import { PwmController } from "./PwmController";

const wrapper = new RaspividTransmitter(
    new TransmitterParams(
        args["tcpHost"],
        args["tcpPort"],
        args["wsHost"],
        args["wsPort"],
        args["secret"]
    ),
    new RaspividParams(
        args["width"],
        args["height"],
        args["rotation"],
        args["fps"],
        args["timeout"],
        args["splitOnSoc"]
    )
);

(async () => {
    await wrapper.ready;
    PwmController.run();
})()
