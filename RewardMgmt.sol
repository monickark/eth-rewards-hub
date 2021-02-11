// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.7.6;

contract RewardMgmt {
    address owner;
    uint256 public maxDayToken;
    uint256 public maxTransToken;
    uint256 public conversionRatio;
    TOKEN erc20;
    
     constructor() {
        owner = msg.sender;
        erc20 = TOKEN(address(0x190c67b37DF42B4235A39E7c3c3000C3764D8770));
     }
    struct UserRewards {
		uint256 points;
		address redeemed_token;
		uint256 dayWithdrawn;
		uint256 lastWithdrawn;
    }
    
    mapping (address => UserRewards) internal rewards;
    
    /* Admin Set the day limit*/
    function setDayLimit(uint256 amount) public returns(bool success)  {
        // Only the contract owner can call this function
        require(msg.sender == owner, "You are not the owner.");
        maxDayToken = amount;
        return true;
    }

    /* Admin Set the transaction limit*/
    function setTranLimit(uint256 amount) public returns(bool success) {
        // Only the contract owner can call this function
        require(msg.sender == owner, "You are not the owner.");
        maxTransToken = amount;
        return true;
    }
    
    /* Admin Set points to token conversion ratio*/
    function setConversionRatio(uint256 ratio) public returns(bool success) {
        // Only the contract owner can call this function
        require(msg.sender == owner, "You are not the owner.");
        conversionRatio = ratio;
        return true;
    }
    
    
    function createPool(uint256 poolTokens) public {
       // require(msg.sender == admin, 'You must be admin');
       require(erc20.approve(address(this), poolTokens), 'You must be admin');
       erc20.transferFrom(msg.sender, address(this), poolTokens);
      // return true;
    }
    
      function poolBalance() public view returns(uint256) {
      return erc20.balanceOf(address(this));
     }
     
     function ownerBalance() public view returns(uint256) {
      return erc20.balanceOf(owner);
     }
      function userBalance() public view returns(uint256) {
      return erc20.balanceOf(msg.sender);
     }
    
    function redeemToken(uint256 tokenToRedeem) public returns(bool) {
       // require(diff >= 86400, 'You are already withdrawn today');
       require(tokenToRedeem <= maxTransToken);
       erc20.transfer(msg.sender, tokenToRedeem);
       return true;
    }
    
}

abstract contract TOKEN {
     function totalSupply() external view virtual returns(uint256);
     function balanceOf(address account) external view virtual returns(uint256);
     function transfer(address recipient, uint256 amount) external virtual returns(bool);
     function allowance(address owner, address spender) external view virtual returns(uint256);
     function approve(address spender, uint256 amount) external virtual returns(bool);
     function transferFrom(address sender, address recipient, uint256 amount) external virtual returns(bool);
}