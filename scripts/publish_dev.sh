#!/bin/bash

rm -fr ./dist

# npm version prerelease --no-git-tag-version
# npm version patch --no-git-tag-version
npm version major --no-git-tag-version

sed -i 's/getState()/getState/g' node_modules/@rematch/core/**/*.js
sed -i 's/getState()/getState/g' node_modules/@rematch/core/**/*.ts

npm run build

npm set registry http://127.0.0.1:4873/
npm publish

npm set registry http://10.8.89.243:4873/
npm publish

npm run doc
