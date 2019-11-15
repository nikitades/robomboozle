import { ArgumentParser } from "argparse";
const parser = new ArgumentParser({
    version: '0.0.1',
    addHelp: true,
    description: 'RBZL SERVER example'
});

parser.addArgument(
    ["--tcpPort", "-tp"],
    { help: "A TCP server port", defaultValue: "9000" }
)

parser.addArgument(
    ["--httpPort", "-hp"],
    { help: "An HTTP server port", defaultValue: "8000" }
)

parser.addArgument(
    ["--piSecret", "-s"],
    { help: "Raspberry PI server-server control secret", required: true }
);

parser.addArgument(
    ["--steerSecret", "-m"],
    { help: "A phrase or code allowing to control the pi robot", required: true }
)

parser.addArgument(
    ["--watchSecret", "-w"],
    { help: "A phrase or code allowing to watch the robot", required: false } //but you should better use itƒ
)

const args = parser.parseArgs();

export default args;