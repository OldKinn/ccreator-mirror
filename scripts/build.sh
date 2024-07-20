#!/bin/bash

npm run build

sed -i 's/getState()/getState/g' dist/mirror.es.js
sed -i 's/getState()/getState/g' dist/mirror.umd.js