#!/bin/bash -ue
redo-ifchange main.go
go build -o "$3" main.go
