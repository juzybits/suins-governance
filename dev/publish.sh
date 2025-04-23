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

ACTIVE_ENV=$(sui client active-env)
coinPkgId=""
votingPkgId=""
governanceObjId=""
stakingConfigObjId=""
statsObjId=""

### functions ###

function publish() {
    local dir="$1"
    echo "================================================"
    echo "Publishing $dir"
    cd "$dir"
    local json=$(sui client publish --json)
    local package_id=$(get_package_id "$json")

    if [ "$dir" == "$TOKEN_DIR" ]; then
        coinPkgId=$package_id
    elif [ "$dir" == "$VOTING_DIR" ]; then
        votingPkgId=$package_id
        governanceObjId=$(get_object_id "$json" "$package_id" "governance::NSGovernance")
        stakingConfigObjId=$(get_object_id "$json" "$package_id" "staking_config::StakingConfig")
        statsObjId=$(get_object_id "$json" "$package_id" "stats::Stats")
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
    echo "NEXT_PUBLIC_VITE_votingPkgId=$votingPkgId"
    echo "NEXT_PUBLIC_VITE_governanceObjId=$governanceObjId"
    echo "NEXT_PUBLIC_VITE_stakingConfigObjId=$stakingConfigObjId"
    echo "NEXT_PUBLIC_VITE_statsObjId=$statsObjId"
    echo "NEXT_PUBLIC_VITE_coinType=$coinPkgId::ns::NS"
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

echo "================================================"
echo "Updated environment file: $ENV_FILE":
print_env_config
echo "================================================"
