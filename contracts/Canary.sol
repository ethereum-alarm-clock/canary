pragma solidity ^0.4.18;

import "../lib/ethereum-alarm-clock/contracts/Interface/SchedulerInterface.sol";
import "../lib/ethereum-alarm-clock/contracts/Interface/TransactionRequestInterface.sol";
/**
 * @title Ethereum Alarm Clock Canary 0.9.0
 * @dev Based on the original canary code 
 * http://blog.ethereum-alarm-clock.com/blog/2015/12/25/say-hello-to-the-reliability-canary
 */
contract Canary {
    uint public initializedAt;
    uint public lastHeartbeat;
    uint public heartbeatCount;
    SchedulerInterface public scheduler;
    TransactionRequestInterface public txRequest;

    address public owner;

    function Canary(address _scheduler) {
        owner = msg.sender;
        scheduler = SchedulerInterface(_scheduler);
    }

    function ()
        public payable
    {
        //thanks for funding the canary!
    }

    function initialize()
        public
    {
        require(msg.sender == owner);
        require(initializedAt == 0);
        require(this.balance >= 1 ether);
        initializedAt = block.timestamp;
        scheduleHeartbeat();
    }

    function scheduleHeartbeat()
        internal
    {
        address newTxRequest = scheduler.schedule.value(1 ether)(
            address(this),
            bytes4(keccak256("heartbeat()")),
            [
                2000000,
                0,
                1 hours,
                block.timestamp + 2 hours,
                30000000000 wei,            // 30 gwei
                0,
                300 wei,
                1 wei
            ]
        );
        txRequest = TransactionRequestInterface(nexTxRequest);
    }

    function heartbeat()
        public 
    {
        // Only the scheduled tranasaction is allowed to be called.
        require(msg.sender == address(txRequest));
        require(isAlive());
        scheduleHeartbeat();

        lastHeartbeat = block.timestamp;
        heartbeatCount++;
    }

    function isAlive()
        view returns (bool)
    {
        require(initializedAt > 0);
        return lastHeartbeat + 3 hours < block.timestamp;
    }

}