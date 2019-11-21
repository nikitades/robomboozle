import { RaspividTransmitter, RaspividParams, TransmitterParams } from "./RaspividTransmitter";
import args from "./argparser"

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

//TODO: когда тут будет ws-клиент, нужно будет по команде запускать и тормозить пайп
wrapper
    .setDefaultSplitter()
    // .startFilePipe("/Users/ars/Downloads/15732390143540.mp4");
    // .startConsolePipe();
    .startCameraPipe();
