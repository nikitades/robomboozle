import { RaspividTransmitter, RaspividParams, TransmitterParams } from "./RaspividTransmitter";
import args from "./argparser"
import { PwmController } from "./pwmcontroller";

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

PwmController.run();

// wrapper
//     .setDefaultSplitter()
//     // .startFilePipe("/Users/ars/Downloads/15732390143540.mp4");
//     // .startConsolePipe();
//     .startCameraPipe();
