pragma solidity ^0.4.18;

contract TransactionRecorder {
    address owner;

    bool public wasCalled;
    uint public lastCallValue;
    address public lastCaller;
    bytes public lastCallData = "";
    uint public lastCallGas;

    function TransactionRecorder() {
        owner = msg.sender;
    }

    function() payable {
        lastCallGas = msg.gas;
        lastCallData = msg.data;
        lastCaller = msg.sender;
        lastCallValue = msg.value;
        wasCalled = true;
    }

    function __reset__() public {
        lastCallGas = 0;
        lastCallData = "";
        lastCaller = 0x0;
        lastCallValue = 0;
        wasCalled = false;
    }

    function kill() public {
        require(msg.sender == owner);
        selfdestruct(owner);
    }
}
