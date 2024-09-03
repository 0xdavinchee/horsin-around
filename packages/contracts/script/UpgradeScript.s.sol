// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.19;

// import {Script} from "forge-std/Script.sol";

// import {ContractA} from "../src/ContractA.sol";
// import {ContractB} from "../src/ContractB.sol";

// import {Options, Upgrades} from "openzeppelin-foundry-upgrades/Upgrades.sol";

// contract UpgradesScript is Script {
// function run() public {
//     uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
//     vm.startBroadcast(deployerPrivateKey);

//     // Specifying the address of the existing transparent proxy
//     address transparentProxy = "your-transparent-proxy-address";

//     // Setting options for validating the upgrade
//     Options memory opts;
//     opts.referenceContract = "ContractA.sol";

//     // Validating the compatibility of the upgrade
//     Upgrades.validateUpgrade("ContractB.sol", opts);

//     // Upgrading to ContractB and attempting to increase the value
//     Upgrades.upgradeProxy(transparentProxy, "ContractB.sol", abi.encodeCall(ContractB.increaseValue, ()));
// }
// }