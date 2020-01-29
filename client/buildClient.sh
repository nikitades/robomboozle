#!/bin/bash
(export NODE_ENV=production && npm i --production --target_arch=arm --target-platform=linux)
(export NODE_ENV=production && npm run compile)
