#!/bin/bash -ue
file="2015-2-9.html"
redo-ifchange "$file"
cat "$file"
