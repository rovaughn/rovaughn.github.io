#!/bin/bash -ue
files=$(find css -name '*.css')
redo-ifchange $files
python3 -mcsscompressor $files
