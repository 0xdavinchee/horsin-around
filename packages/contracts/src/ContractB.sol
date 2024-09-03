// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

/// @custom:oz-upgrades-from ContractA
contract ContractB is Initializable {
    uint256 public value;

    function initialize(uint256 _setValue) public initializer {
        value = _setValue;
    }

    function increaseValue() public {
        value += 10;
    }
}
