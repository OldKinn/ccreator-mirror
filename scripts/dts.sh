#!/bin/bash

npm run build

file=dist/mirror.es.js

echo "module file: $file"

if [ -e $file ]
then
    cp $file dist/mirror.es.ts
    tsc --declaration dist/mirror.es.ts
    mv dist/mirror.es.d.ts index.d.ts
else
    echo "file not exist"
fi