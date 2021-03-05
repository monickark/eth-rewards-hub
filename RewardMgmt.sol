// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.7.6;

/**
 * @title Ownable
 * @dev The Ownable contract has an owner address, and provides basic authorization control
 * functions, this simplifies the implementation of "user permissions".
 */
contract Ownable {
  address public owner;

  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner() {
    require(msg.sender == owner, 'You must be owner');
    _;
  }

  
}

contract RewardMgmt is Ownable {
    uint256 public maxDayToken;
    uint256 public maxTransToken;
    uint256 public conversionRatio;
    TOKEN erc20;
    
     constructor() {
        owner = msg.sender;
        erc20 = TOKEN(address(0x6C889c970AAb3ddc205A9D1863048C79286E5931));
     }
    struct UserRewards {
        address userAddr;
		uint256 dayWithdrawn;
		uint256 lastWithdrawn;
    }
    
    mapping (address => UserRewards) public rewards;
    mapping (address => uint256) public balancePoints;
    
    function redeemToken(uint256 tokenToRedeem) public returns(bool) {
       UserRewards memory user = rewards[msg.sender];
       uint256 diff = block.timestamp - user.lastWithdrawn;
       
       if(diff <= 86400){
           require(user.dayWithdrawn + tokenToRedeem <= maxDayToken, "You are crossing day limit");
       } 
       require(tokenToRedeem <= maxTransToken, 'You have exceeded max tokens per txions');
       erc20.transfer(msg.sender, tokenToRedeem);
       if(user.userAddr != address(0x0)) {
           rewards[msg.sender] = UserRewards(msg.sender, tokenToRedeem, block.timestamp);
       } else {
           if(diff <= 86400){
               rewards[msg.sender].dayWithdrawn = user.dayWithdrawn + tokenToRedeem;
           } else {
               rewards[msg.sender].dayWithdrawn = tokenToRedeem;
           }
           
               rewards[msg.sender].lastWithdrawn = block.timestamp;
           
       }
       
       return true;
    }
    
    /* Admin Set the day limit*/
    function setDayLimit(uint256 amount) onlyOwner public returns(bool success)  {
        maxDayToken = amount;
        return true;
    }

    /* Admin Set the transaction limit*/
    function setTranLimit(uint256 amount) onlyOwner public returns(bool success) {
        maxTransToken = amount;
        return true;
    }
    
    /* Admin Set points to token conversion ratio*/
    function setConversionRatio(uint256 ratio) onlyOwner public returns(bool success) {
        conversionRatio = ratio;
        return true;
    }
    
    
    function createPool(uint256 poolTokens) onlyOwner public {
       require(erc20.approve(address(this), poolTokens), 'You must be admin');
       erc20.transferFrom(msg.sender, address(this), poolTokens);
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
    function pointsBalance() public view returns(uint256) {
      return balancePoints[msg.sender];
    }
    


    /* Admin Set points to user */
    function setPointsToUser(uint256 points, address userAddress) onlyOwner public returns(bool success) {
        balancePoints[userAddress] += points;
        return true;
    }

    function deductPoints(uint256 points) public returns(bool success) {
        require(balancePoints[msg.sender] >= points, 'No points to deduct');
        balancePoints[msg.sender] -= points;
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