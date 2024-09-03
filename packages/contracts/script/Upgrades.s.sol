// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Script} from "forge-std/Script.sol";

import {ContractA} from "../src/ContractA.sol";
import {ContractB} from "../src/ContractB.sol";

import {Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";

// forge clean && forge script script/Upgrades.s.sol --rpc-url sepolia --private-key $PRIVATE_KEY --broadcast --verify
contract UpgradesScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy `ContractA` as a transparent proxy using the Upgrades Plugin
        address transparentProxy =
            Upgrades.deployTransparentProxy("ContractA.sol", msg.sender, abi.encodeCall(ContractA.initialize, 10));
    }
}
