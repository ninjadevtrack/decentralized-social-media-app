// SPDX-License-Identifier: AGPL-3.0

pragma solidity ^0.8.23;

import '@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol';
import '@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol';

struct CreateProfileParams {
  address to;
  address followModule;
  bytes followModuleInitData;
}

interface IPermissonlessCreator {
  function createProfileWithHandleUsingCredits(
    CreateProfileParams calldata createProfileParams,
    string calldata handle,
    address[] calldata delegatedExecutors
  ) external returns (uint256, uint256);
}

contract HeyLensSignup is Initializable, OwnableUpgradeable {
  IPermissonlessCreator public lensPermissionlessCreator;
  uint256 public signupPrice;
  uint256 public profilesCreated;

  error InvalidFunds();
  error NotAllowed();
  error WithdrawalFailed();

  // Initializer instead of constructor for upgradeable contracts
  function initialize(
    address owner,
    address _lensPermissionlessCreator,
    uint256 _signupPrice
  ) public initializer {
    __Ownable_init(owner);
    lensPermissionlessCreator = IPermissonlessCreator(
      _lensPermissionlessCreator
    );
    signupPrice = _signupPrice;
    profilesCreated = 0;
  }

  function setSignupPrice(uint256 _signupPrice) external onlyOwner {
    signupPrice = _signupPrice;
  }

  function createProfileWithHandleUsingCredits(
    CreateProfileParams calldata createProfileParams,
    string calldata handle,
    address[] calldata delegatedExecutors
  ) external payable returns (uint256 profileId, uint256 handleId) {
    if (msg.value != signupPrice) {
      revert InvalidFunds();
    }

    if (delegatedExecutors.length > 0 && createProfileParams.to != msg.sender) {
      revert NotAllowed();
    }

    // Call the lensPermissionlessCreator to create a profile
    (profileId, handleId) = lensPermissionlessCreator
      .createProfileWithHandleUsingCredits(
        createProfileParams,
        handle,
        delegatedExecutors
      );

    // Increment the number of profiles created
    profilesCreated += 1;

    return (profileId, handleId);
  }

  function getProfilesCreated() external view returns (uint256) {
    return profilesCreated;
  }

  function withdrawFunds() external onlyOwner {
    (bool sent, ) = payable(owner()).call{ value: address(this).balance }('');
    if (!sent) {
      revert WithdrawalFailed();
    }
  }
}
