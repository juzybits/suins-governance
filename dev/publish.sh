#!/usr/bin/env bash

set -o nounset      # Treat unset variables as an error when substituting
set -o errexit      # Exit immediately if any command returns a non-zero status
set -o pipefail     # Prevent errors in a pipeline from being masked
# set -o xtrace       # Print each command to the terminal before execution

SCRIPT_DIR="$( dirname "$(readlink -f "${BASH_SOURCE[0]}")" )"

### paths ###

APP_DIR="$SCRIPT_DIR/.."
ENV_FILE="$APP_DIR/.env.development.local"

CONTRACTS_DIR="$SCRIPT_DIR/../../suins-contracts/packages"
TOKEN_DIR="$CONTRACTS_DIR/token"
VOTING_DIR="$CONTRACTS_DIR/voting"

### variables ###

TOKEN_PACKAGE_ID=""
VOTING_PACKAGE_ID=""
GOVERNANCE_OBJ_ID=""
STAKING_CONFIG_OBJ_ID=""
STATS_OBJ_ID=""
ACTIVE_ENV=$(sui client active-env)

### functions ###

function publish() {
    local dir="$1"
    echo "================================================"
    echo "Publishing $dir"
    cd "$dir"
    local json=$(sui client publish --json)
    local package_id=$(get_package_id "$json")
    echo "Package ID: $package_id"

    if [ "$dir" == "$TOKEN_DIR" ]; then
        TOKEN_PACKAGE_ID=$package_id
    elif [ "$dir" == "$VOTING_DIR" ]; then
        VOTING_PACKAGE_ID=$package_id
        GOVERNANCE_OBJ_ID=$(get_object_id "$json" "$package_id" "governance::NSGovernance")
        STAKING_CONFIG_OBJ_ID=$(get_object_id "$json" "$package_id" "staking_config::StakingConfig")
        STATS_OBJ_ID=$(get_object_id "$json" "$package_id" "stats::Stats")

        echo "NSGovernance ID: $GOVERNANCE_OBJ_ID"
        echo "StakingConfig ID: $STAKING_CONFIG_OBJ_ID"
        echo "Stats ID: $STATS_OBJ_ID"
    fi
}

function get_package_id() {
    local json="$1"

    echo "$json" | jq -r '.objectChanges[] | select(.type == "published") | .packageId'
}

function get_object_id() {
    local json="$1"
    local package_id="$2"
    local object_type="$3"

    echo "$json" | jq -r ".objectChanges[] | select(.objectType == \"$package_id::$object_type\") | .objectId"
}

function print_env_config() {
    echo "NEXT_PUBLIC_VITE_NETWORK=$ACTIVE_ENV"
    echo "NEXT_PUBLIC_VITE_votingPkgId=$VOTING_PACKAGE_ID"
    echo "NEXT_PUBLIC_VITE_governanceObjId=$GOVERNANCE_OBJ_ID"
    echo "NEXT_PUBLIC_VITE_stakingConfigId=$STAKING_CONFIG_OBJ_ID"
    echo "NEXT_PUBLIC_VITE_statsId=$STATS_OBJ_ID"
    echo "NEXT_PUBLIC_VITE_coinType=$TOKEN_PACKAGE_ID::ns::NS"
}

### main ###

# prevent from running on mainnet
if [ "$ACTIVE_ENV" != "localnet" ]; then
    echo "The active environment is not localnet. Aborting."
    exit 1
fi

publish "$TOKEN_DIR"
publish "$VOTING_DIR"

print_env_config > "$ENV_FILE"
