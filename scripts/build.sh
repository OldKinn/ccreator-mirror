#!/bin/bash

rm -fr ./dist

sed -i 's/getState()/getState/g' node_modules/@rematch/core/**/*.js
sed -i 's/getState()/getState/g' node_modules/@rematch/core/**/*.ts

npm run build
