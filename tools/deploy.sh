#!/bin/sh

git checkout deploy
make html
git add build
git commit -sm "Deploy: $(date)"
git push origin deploy
git checkout master
