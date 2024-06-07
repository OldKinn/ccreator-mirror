#!/bin/bash

# 发布到NPM官网仓库

rm -fr ./dist

# build libs
npm run build

# update version prerelease
npm version prerelease --no-git-tag-version

# publish 01
npm set registry http://127.0.0.1:4873/
npm publish

# publish 02
npm set registry http://10.8.89.243:4873/
npm publish

