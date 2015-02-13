#!/bin/bash -ue

src="posts/$2.md"
template="template.html"

redo-ifchange compiler "$src" "$template"

./compiler "$2" <"$src"

