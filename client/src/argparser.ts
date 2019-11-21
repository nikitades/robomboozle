import { ArgumentParser } from "argparse";
const parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'RBZL CLIENT example'
});

parser.addArgument(
    ["--tcpHost", "-th"],
    { help: "TCP host to send chunks to", required: true }
);

parser.addArgument(
    ["--tcpPort", "-tp"],
    { help: "TCP host's port", required: true }
);

parser.addArgument(
    ["--wsHost", "-wh"],
    { help: "WS host to receive commands from", required: true }
);

parser.addArgument(
    ["--wsPort", "-wp"],
    { help: "WS host's port", required: true }
);

parser.addArgument(
    ["--secret", "-s"],
    { help: "A secret phrase to ensure PI and its controlling server are mutually trusted", required: true }
);

parser.addArgument(
    ["--width", "-w"],
    { help: "Image width", defaultValue: 640 }
);

parser.addArgument(
    ["--height", "-e"],
    { help: "Image hEight", defaultValue: 480 }
);

parser.addArgument(
    ["--rotation", "-r"],
    { help: "Image rotation", defaultValue: 0 }
);

parser.addArgument(
    ["--fps", "-fps"],
    { help: "Framerate", defaultValue: 30 }
);

parser.addArgument(
    ["--timeout", "-t"],
    { help: "Timeout (do not use)", defaultValue: 0 }
);

parser.addArgument(
    ["--splitOnSoc", "-sos"],
    { help: "Should the SoC split and reassemble by-frame the stream before it is send to the relay", defaultValue: false }
)

const args = parser.parseArgs();

export default args;