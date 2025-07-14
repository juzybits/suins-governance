#!/usr/bin/env bash

set -o nounset      # Treat unset variables as an error when substituting
set -o errexit      # Exit immediately if any command returns a non-zero status
set -o pipefail     # Prevent errors in a pipeline from being masked
# set -o xtrace       # Print each command to the terminal before execution

SCRIPT_DIR="$( dirname "$(readlink -f "${BASH_SOURCE[0]}")" )"

### paths ###

APP_DIR="$SCRIPT_DIR/.."
CONFIG_FILE="$APP_DIR/src/constants/endpoints.ts"

CONTRACTS_DIR="$SCRIPT_DIR/../../contracts/packages"
TOKEN_DIR="$CONTRACTS_DIR/token"
VOTING_DIR="$CONTRACTS_DIR/voting"

### variables ###

network=$(sui client active-env)
coinPkgId=""
votingPkgId=""
governanceObjId=""
stakingConfigObjId=""
statsObjId=""

### functions ###

function publish_package() {
    local dir="$1"
    echo "" >&2
    echo "================================================" >&2
    echo "Publishing $dir" >&2
    echo "" >&2
    cd "$dir"
    sui client publish --json
}

function get_package_id() {
    local json="$1"

    echo "$json" | jq -r '.objectChanges[] | select(.type == "published") | .packageId'
}

function get_object_id() {
    local json="$1"
    local object_type="$2"

    echo "$json" | jq -r ".objectChanges[] | select(.objectType == \"$object_type\") | .objectId"
}

### check active network ###

if [ "$network" == "devnet" ]; then
    read -p "You are about to publish to devnet. Are you sure? (y/n): " confirm
    if [ "$confirm" != "y" ]; then
        echo "Aborted by user."
        exit 1
    fi
elif [ "$network" != "localnet" ]; then
    echo "Error: The active environment is not localnet or devnet. Aborting."
    exit 1
fi

### publish NS coin package ###

json=$(publish_package "$TOKEN_DIR")
coinPkgId=$(get_package_id "$json")

### publish governance package ###

json=$(publish_package "$VOTING_DIR")
votingPkgId=$(get_package_id "$json")
governanceObjId=$(get_object_id "$json" "$votingPkgId::governance::NSGovernance")
stakingConfigObjId=$(get_object_id "$json" "$votingPkgId::staking_config::StakingConfig")
statsObjId=$(get_object_id "$json" "$votingPkgId::stats::Stats")

### update endpoints file ###

echo ""
echo "================================================"
echo "Updated config file: $CONFIG_FILE"

awk -v net="$network" \
    -v voting="$votingPkgId" \
    -v gov="$governanceObjId" \
    -v staking="$stakingConfigObjId" \
    -v stats="$statsObjId" \
    -v coin="$coinPkgId::ns::NS" '
BEGIN { in_block=0 }
{
    if ($0 ~ "^[[:space:]]*"net":[[:space:]]*{") {
        print "  "net": {"
        print "    votingPkgId:"
        print "      \"" voting "\","
        print "    governanceObjId:"
        print "      \"" gov "\","
        print "    stakingConfigObjId:"
        print "      \"" staking "\","
        print "    statsObjId:"
        print "      \"" stats "\","
        print "    coinType:"
        print "      \"" coin "\","
        print "  },"
        in_block=1
        next
    }
    if (in_block && $0 ~ /^[[:space:]]*},[[:space:]]*$/) {
        in_block=0
        next
    }
    if (!in_block) print $0
}' "$CONFIG_FILE" > "$CONFIG_FILE.tmp" && mv "$CONFIG_FILE.tmp" "$CONFIG_FILE"

echo ""
echo "  $network: {"
echo "    votingPkgId: \"$votingPkgId\","
echo "    governanceObjId: \"$governanceObjId\","
echo "    stakingConfigObjId: \"$stakingConfigObjId\","
echo "    statsObjId: \"$statsObjId\","
echo "    coinType: \"$coinPkgId::ns::NS\","
echo "  },"
echo ""

echo "================================================"
