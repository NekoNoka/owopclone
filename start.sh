#!/bin/bash

# Ensure a parameter is passed
if [[ $# -ne 1 ]]; then
    echo "Usage: $0 -r|--release or -d|--dev"
    exit 1
fi

# Determine the command for subfolder1
case "$1" in
    -r|--release)
        CMD1="npm run release"
        ;;
    -d|--dev)
        CMD1="npm start"
        ;;
    *)
        echo "Invalid option: $1"
        echo "Usage: $0 -r|--release or -d|--dev"
        exit 1
        ;;
esac

# Store PIDs of background processes
PIDS=()

# Trap SIGTERM and terminate background processes, then exit script
trap 'kill "${PIDS[@]}"; exit 1' SIGTERM

# Navigate to the first project and run the determined command
(cd client && $CMD1) &
PIDS+=($!)

# Navigate to the second project and start it
(cd server && npm start) &
PIDS+=($!)

# Wait for both background processes to finish
wait "${PIDS[@]}"