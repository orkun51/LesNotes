#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build
[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable"
[ -z "$OWNER" ] && echo "Missing \$OWNER environment variable"

echo "deleting $CONTRACT and setting $OWNER as beneficiary"
near delete $CONTRACT $OWNER

set -e

echo
echo ---------------------------------------------------------
echo "Step 1: Build the contract (may take a few seconds)"
echo ---------------------------------------------------------
echo
yarn 



echo
echo
echo ---------------------------------------------------------
echo "Step 2: Deploy the contract"
near login
echo
echo "(edit scripts/1.dev-deploy.sh to deploy other contract)"
echo ---------------------------------------------------------
echo
yarn build:release
# uncomment out the line below to deploy the other example contract
# near dev-deploy ./build/debug/simple.wasm

# comment the line below to deploy the other example contract
near dev-deploy ./build/debug/simple.wasm

echo
echo
echo ---------------------------------------------------------
echo 
echo
echo 
echo "redeploying the contract"
echo
echo 
near dev-deploy ./build/release/simple.wasm
echo
echo ---------------------------------------------------------
echo 'export CONTRACT=<dev-123-456>'
echo 'export OWNER=<your account'
echo 'near call \$CONTRACT init '{\"owner\":\"'\$OWNER'\"}' --accountId \$CONTRACT'
# uncomment this line for a useful hint when using the simple style
# echo "near call \$CONTRACT init --accountId \$CONTRACT"
echo ---------------------------------------------------------
echo

exit 0
