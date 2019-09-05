#!/usr/bin/env bash

args=("$@")

LIST=()

len=${#args[@]}
for (( n=1; n<=len; n++ ))
do
    LIST+=(${args[$n]})
done

FILE=./$1.js
if [ -f "$FILE" ]; then
    node $FILE ${LIST[@]}
else
    echo command \"$1\" is not exist
fi
