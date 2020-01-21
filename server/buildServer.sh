#!/bin/bash
(cd ./webclient && npm i && npm run build)
(cd ./server && npm i && npm run build)
