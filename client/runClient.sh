#!/bin/bash
[ -z "$tcpHost" ] && tcpHost="abcdef"
[ -z "$tcpPort" ] && tcpPort="9000"
[ -z "$wsHost" ] && wsHost="192.168.1.111"
[ -z "$wsPort" ] && wsPort="8000"
[ -z "$secret" ] && secret="abcdef"
[ -z "$rotation" ] && rotation="270"         
node ./dist/client/src/server.js --tcpHost "${tcpHost}" --tcpPort "${9000}" --wsHost "${wsHost}" --wsPort 8000 --secret "${secret}" --rotation "${rotation}"
