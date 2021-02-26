// SPDX-License-Identifier: UNLICENSED

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
    mapping (address => uint256) public balancePoints;
    
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
    
    function redeemToken(uint256 tokenToRedeem) public returns(bool) {
       // require(diff >= 86400, 'You are already withdrawn today');
       require(tokenToRedeem <= maxTransToken);
       erc20.transfer(msg.sender, tokenToRedeem);
       return true;
    }

    /* Admin Set points to user */
    function setPointsToUser(uint256 points, address userAddress) onlyOwner public returns(bool success) {
        balancePoints[userAddress] += points;
        return true;
    }

    function deductPoints(uint256 points, address userAddress) public returns(bool success) {
        if(balancePoints[userAddress] >= points){
            balancePoints[userAddress] -= points;
            return true;
        }
        else{
            return false;
        }
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