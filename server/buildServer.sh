#!/bin/bash
(export NODE_ENV=production && cd ./webclient && npm i --production && npm run build)
(export NODE_ENV=production && cd ./server && npm i --production && npm run build)
