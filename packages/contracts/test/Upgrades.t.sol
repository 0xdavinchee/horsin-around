// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IBeacon} from "@openzeppelin/contracts/proxy/beacon/IBeacon.sol";
import {Options} from "openzeppelin-foundry-upgrades/Upgrades.sol";
import "forge-std/Test.sol";
import "openzeppelin-foundry-upgrades/Upgrades.sol";
import "../src/ContractA.sol";
import "../src/ContractB.sol";

contract UpgradesTest is Test {
    function testTransparent() public {
        // Deploy a transparent proxy with ContractA as the implementation and initialize it with 10
        address proxy =
            Upgrades.deployTransparentProxy("ContractA.sol", msg.sender, abi.encodeCall(ContractA.initialize, (10)));

        // Get the instance of the contract
        ContractA instance = ContractA(proxy);

        // Get the implementation address of the proxy
        address implAddrV1 = Upgrades.getImplementationAddress(proxy);

        // Get the admin address of the proxy
        address adminAddr = Upgrades.getAdminAddress(proxy);

        // Ensure the admin address is valid
        assertFalse(adminAddr == address(0));

        // Log the initial value
        console.log("----------------------------------");
        console.log("Value before upgrade --> ", instance.value());
        console.log("----------------------------------");

        // Verify initial value is as expected
        assertEq(instance.value(), 10);

        // Upgrade the proxy to ContractB
        Upgrades.upgradeProxy(proxy, "ContractB.sol", "", msg.sender);

        // Get the new implementation address after upgrade
        address implAddrV2 = Upgrades.getImplementationAddress(proxy);

        // Verify admin address remains unchanged
        assertEq(Upgrades.getAdminAddress(proxy), adminAddr);

        // Verify implementation address has changed
        assertFalse(implAddrV1 == implAddrV2);

        // Invoke the increaseValue function separately
        ContractB(address(instance)).increaseValue();

        // Log and verify the updated value
        console.log("----------------------------------");
        console.log("Value after upgrade --> ", instance.value());
        console.log("----------------------------------");
        assertEq(instance.value(), 20);
    }

    function testBeacon() public {
        // Deploy a beacon with ContractA as the initial implementation
        address beacon = Upgrades.deployBeacon("ContractA.sol", msg.sender);

        // Get the initial implementation address of the beacon
        address implAddrV1 = IBeacon(beacon).implementation();

        // Deploy the first beacon proxy and initialize it
        address proxy1 = Upgrades.deployBeaconProxy(beacon, abi.encodeCall(ContractA.initialize, 15));
        ContractA instance1 = ContractA(proxy1);

        // Deploy the second beacon proxy and initialize it
        address proxy2 = Upgrades.deployBeaconProxy(beacon, abi.encodeCall(ContractA.initialize, 20));
        ContractA instance2 = ContractA(proxy2);

        // Check if both proxies point to the same beacon
        assertEq(Upgrades.getBeaconAddress(proxy1), beacon);
        assertEq(Upgrades.getBeaconAddress(proxy2), beacon);

        console.log("----------------------------------");
        console.log("Value before upgrade in Proxy 1 --> ", instance1.value());
        console.log("Value before upgrade in Proxy 2 --> ", instance2.value());
        console.log("----------------------------------");

        // Validate the new implementation before upgrading
        Options memory opts;
        opts.referenceContract = "ContractA.sol";
        Upgrades.validateUpgrade("ContractB.sol", opts);

        // Upgrade the beacon to use ContractB
        Upgrades.upgradeBeacon(beacon, "ContractB.sol", msg.sender);

        // Get the new implementation address of the beacon after upgrade
        address implAddrV2 = IBeacon(beacon).implementation();

        // Activate the increaseValue function in both proxies
        ContractB(address(instance1)).increaseValue();
        ContractB(address(instance2)).increaseValue();

        console.log("----------------------------------");
        console.log("Value after upgrade in Proxy 1 --> ", instance1.value());
        console.log("Value after upgrade in Proxy 2 --> ", instance2.value());
        console.log("----------------------------------");

        // Check if the values have been correctly increased
        assertEq(instance1.value(), 25);
        assertEq(instance2.value(), 30);

        // Check if the implementation address has changed
        assertFalse(implAddrV1 == implAddrV2);
    }
}
