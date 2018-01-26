pragma solidity ^0.4.18;

import "./EAC/Interface/SchedulerInterface.sol";
import "./EAC/Interface/TransactionRequestInterface.sol";

/**
 * @title Ethereum Alarm Clock Canary 0.9.0
 * @dev Based on the original canary code by Piper Merriam:
 * http://blog.ethereum-alarm-clock.com/blog/2015/12/25/say-hello-to-the-reliability-canary
 */
contract Canary {
    uint public initializedAt;
    uint public lastHeartbeat;
    uint public heartbeatCount;
    SchedulerInterface public scheduler;
    TransactionRequestInterface public txRequest;

    address public owner;

    function Canary(address _scheduler) public {
        owner = msg.sender;
        scheduler = SchedulerInterface(_scheduler);
    }

    function ()
        public payable
    {
        require(isAlive());
        // Thanks for funding the canary!
    }

    function initialize()
        public payable
    {
        require(msg.sender == owner);
        require(initializedAt == 0);
        require(msg.value >= 1 ether);
        initializedAt = block.timestamp;
        lastHeartbeat = block.timestamp;
        require( this.scheduleHeartbeat(32 finney) );
        // The endowment is roughly 32 finney.
    }

    /**
     * This function must be external because we recontextualize the calls
     * so that msg.sender is the address of this contract and not the address of
     * the calling address (owner in initialize, txRequest in heartbeat)
     */
    function scheduleHeartbeat(uint _value)
        external returns (bool)
    {
        require(msg.sender == address(this));

        address newTxRequest = scheduler.schedule.value(_value)(
            address(this),
            hex"3defb962",                  // bytes4(sha3("heartbeat()"))
            [
                3000000,
                0,
                1 hours,
                block.timestamp + 2 hours,
                10000000000 wei,            // 10 gwei
                0,
                300 wei,
                1 wei
            ]
        );
        txRequest = TransactionRequestInterface(newTxRequest);
        return true;
    }

    function heartbeat()
        public payable
    {
        // Only the scheduled tranasaction is allowed to be called.
        require(msg.sender == address(txRequest));
        require(isAlive());
        require( this.scheduleHeartbeat(32 finney) );

        lastHeartbeat = block.timestamp;
        heartbeatCount++;
    }

    function isAlive()
        public view returns (bool)
    {
        require(initializedAt > 0);
        return lastHeartbeat + 3 hours >= block.timestamp;
    }

    function decomission()
        public returns (bool)
    {
        require(msg.sender == owner);
        initializedAt = 0;  // isAlive() will return false
        owner.transfer(this.balance);
    }
}