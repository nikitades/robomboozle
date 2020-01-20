#!/bin/bash
[ -z "$piSecret" ] && piSecret="abcdef"
[ -z "$steerSecret" ] && steerSecret="fedcba"
[ -z "$watchSecret" ] && watchSecret="aaaaaa"
(cd ./server/webclient && npm i && npm run build)
(cd ./server/server && npm i && npm run build)
node ./server/server/dist/server/server.js --piSecret "${piSecret}" --steerSecret "${steerSecret}" --watchSecret "${watchSecret}"
