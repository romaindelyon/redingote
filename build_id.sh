#!/bin/sh
BUILD_STRING="$(date '+%Y%m%d%H%M%S')"
BUILD_ID="1.0.0.$BUILD_STRING"
export BUILD_ID

echo "BUILD_ID=${BUILD_ID}"
