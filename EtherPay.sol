pragma solidity >=0.4.22 <0.7.0;

contract EtherPay{
    uint256 bal =0;

    function payMe() payable public returns(bool success)  {
        bal = bal + msg.value;
        return true;
    }

    function fundtransfer(address payable addr1, uint256 amount) public {
        bal = bal - amount;
       addr1.transfer(amount);
    }
    
    function balance() external view returns(uint256) {
        return bal;
    }
}