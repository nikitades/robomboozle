#!/bin/bash
(export NODE_ENV=production && npm i --production)
(export NODE_ENV=production && npm run compile:prod)
