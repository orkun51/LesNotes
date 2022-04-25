#!/usr/bin/env bash

# exit on first error after this point to avoid redeploying with successful build

echo "export CONTRACT=dev<123 321>

set -e

echo
echo ---------------------------------------------------------
echo "Step 0: Check for environment variable with contract name"
echo ---------------------------------------------------------
echo


[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$CONTRACT" ] || echo "Found it! \$CONTRACT is set to [ $CONTRACT ]"

echo
echo
echo ---------------------------------------------------------
echo "Step 1: Call 'view' functions on the contract"
echo
echo 
echo ---------------------------------------------------------
echo

near view $CONTRACT latestSchoolarship '{"start": 0, "limit": 10}'

echo
echo
echo
echo "now run this script again to see changes made by this file"
exit 0
