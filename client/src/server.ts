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

/**
 * TODO:
 * 1. Сделать WS-клиент
 * 2. WS-клиентом принимать команды
 * 3. Слать команды в шину команд - ЧЕРЕЗ IRoboCommand -> createListeners!
    MoveCommand.createClientListeners(socket);
    BamboozleCommand.createClientListeners(socket);
 * 4. Запустить обработчик команд и смотреть, как они превращаются в GPIO-сигналы
 */

//TODO: когда тут будет ws-клиент, нужно будет по команде запускать и тормозить пайп
// wrapper
//     .setDefaultSplitter()
//     // .startFilePipe("/Users/ars/Downloads/15732390143540.mp4");
//     // .startConsolePipe();
//     .startCameraPipe();
