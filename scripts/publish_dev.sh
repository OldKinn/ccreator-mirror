#!/bin/bash

rm -fr ./dist

# update version
npm version prerelease --no-git-tag-version
# npm version patch

npm run build

sed -i 's/getState()/getState/g' dist/mirror.es.js
sed -i 's/getState()/getState/g' dist/mirror.umd.js

npm set registry http://127.0.0.1:4873/
npm publish

npm set registry http://10.8.89.243:4873/
npm publish
