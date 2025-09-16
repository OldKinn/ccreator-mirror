#!/bin/bash

# publish 01
npm set registry http://127.0.0.1:4873/
npm unpublish -f

# publish 02
npm set registry http://10.8.89.243:4873/
npm unpublish -f
