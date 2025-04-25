#!/usr/bin/env bash

set -o nounset      # Treat unset variables as an error when substituting
set -o errexit      # Exit immediately if any command returns a non-zero status
set -o pipefail     # Prevent errors in a pipeline from being masked
# set -o xtrace       # Print each command to the terminal before execution

SCRIPT_DIR="$( dirname "$(readlink -f "${BASH_SOURCE[0]}")" )"

APP_DIR="$SCRIPT_DIR/.."

cd "$APP_DIR"

bun add @mysten/bcs@latest \
    @mysten/dapp-kit@latest \
    @mysten/kiosk@latest \
    @mysten/sui@latest \
    @mysten/suins@latest \
    @mysten/zksend@latest \
    @polymedia/suitcase-core@latest
