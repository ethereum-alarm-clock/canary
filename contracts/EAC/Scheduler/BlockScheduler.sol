pragma solidity ^0.4.18;

import "../Library/RequestScheduleLib.sol";
import "../Scheduler/BaseScheduler.sol";

/**
 * @title BlockScheduler
 * @dev Top-level contract that exposes the API to the Ethereum Alarm Clock service and passes in blocks as temporal unit.
 */
contract BlockScheduler is BaseScheduler {

    /**
     * @dev Constructor
     * @param _factoryAddress Address of the RequestFactory which creates requests for this scheduler.
     */
    function BlockScheduler(address _factoryAddress) public {
        // Default temporal unit is block number.
        temporalUnit = RequestScheduleLib.TemporalUnit(1);

        // Sets the factoryAddress variable found in SchedulerInterface contract.
        factoryAddress = _factoryAddress;
    }
}
