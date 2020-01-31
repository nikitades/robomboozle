#!/bin/sh
[ -z "$piSecret" ] && piSecret="abcdef"
[ -z "$steerSecret" ] && steerSecret="fedcba"
[ -z "$watchSecret" ] && watchSecret="aaaaaa"

cd server || (echo "No server folder found" && exit)
node ./dist/server/server.js --piSecret "${piSecret}" --steerSecret "${steerSecret}" --watchSecret "${watchSecret}"
