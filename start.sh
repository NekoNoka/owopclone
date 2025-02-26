#!/bin/bash

# Store PIDs of background processes
PIDS=()

# Trap SIGTERM and terminate background processes, then exit script
trap 'kill "${PIDS[@]}"; exit 1' SIGTERM

# Navigate to the first project and start it
(cd client && npm start) &
PIDS+=($!)

# Navigate to the second project and start it
(cd server && npm start) &
PIDS+=($!)

# Wait for both background processes to finish
wait "${PIDS[@]}"
