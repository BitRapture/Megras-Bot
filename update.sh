#!/bin/bash

git pull
pm2 restart 0
printf "Updated and restarted bot\n"
