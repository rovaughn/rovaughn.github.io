#!/bin/bash -ue

redo-ifchange posts main.css

(
  cd posts
  ls *.md | sed -e 's|\.md$|\.html|g'
) | xargs redo-ifchange

redo-ifchange index.html

