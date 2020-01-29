#!/bin/bash
[ -z "$tcpHost" ] && tcpHost="192.168.1.111"
[ -z "$tcpPort" ] && tcpPort="9000"
[ -z "$wsHost" ] && wsHost="192.168.1.111"
[ -z "$wsPort" ] && wsPort="8000"
[ -z "$secret" ] && secret="abcdef"
[ -z "$rotation" ] && rotation="180"
node ./dist/client/src/server.js --tcpHost "${tcpHost}" --tcpPort "${tcpPort}" --wsHost "${wsHost}" --wsPort ${wsPort} --secret "${secret}" --rotation "${rotation}"
