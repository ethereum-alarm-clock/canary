const Canary = artifacts.require('Canary.sol')

/// EAC Contracts
const RequestFactory = artifacts.require('./RequestFactory.sol')
const RequestTracker = artifacts.require('./RequestTracker.sol')
const TimestampScheduler = artifacts.require('./TimestampScheduler.sol')
const TransactionRequest = artifacts.require('./TransactionRequest.sol')

const expect = require('chai').expect
const { RequestData } = require('../lib/ethereum-alarm-clock/test/dataHelpers')
const { wait } = require('@digix/tempo')(web3)

contract('Canary', accounts => {

    const MINUTE = 60 // Seconds
    const HOUR = 60 * MINUTE
    const masterAcct = accounts[0]
    
    let canary

    it('Should deploy', async () => {
        // Request tracker
        const requestTracker = await RequestTracker.new()
        assert(!!requestTracker.address)

        // Request factory
        const requestFactory = await RequestFactory.new(requestTracker.address)
        assert(!!requestFactory.address) 

        // Timestamp scheduler
        const timestampScheduler = await TimestampScheduler.new(requestFactory.address)
        assert(!!timestampScheduler.address)

        // Canary
        canary  = await Canary.new(timestampScheduler.address)
        assert(!!canary.address)
    })


    it('Should initialize', async () => {
        const owner = await canary.owner()
        assert(owner == masterAcct)

        assert(
            (await canary.initializedAt()).toNumber() === 0,
            'The initializedAt variable of the canary should be set at zero before intitialization'
        )

        const receipt = await canary.initialize({
            gas: 5000000,
            value: web3.toWei('3')
        })

        assert(!!receipt, 'The receipt object should exist.')

        assert(
            (await canary.initializedAt()).toNumber() !== 0,
            'After initialization, the initializedAt variable should no longer be set to zero'
        )

        assert(
            await canary.isAlive() === true,
            'The canary should be alive.'
        )
    })

    it('Should trigger via EAC executor in 2 hours time', async () => {
        await wait(2 * HOUR)

        txRequest = await TransactionRequest.at(await canary.txRequest())
        const requestData = await RequestData.from(txRequest)
        // console.log(web3.fromWei(requestData.calcEndowment()))
        const callGas = requestData.txData.callGas
        const gasPrice = requestData.txData.gasPrice

        const balBeforeExecution = web3.eth.getBalance(canary.address)

        const receipt = await txRequest.execute({
            gas: callGas + 180000,
            gasPrice: gasPrice
        })
        expect(receipt)
        .to.exist

        const balAfterExecution = web3.eth.getBalance(canary.address)

        const now = web3.eth.getBlock('latest').timestamp 
        const lastHeartbeat = await canary.lastHeartbeat()

        expect(now)
        .to.equal(lastHeartbeat.toNumber())
        expect((await canary.heartbeatCount()).toNumber())
        .to.equal(1)

        // Should have a new txRequest that is not equal to the old one
        expect(await canary.txRequest())
        .to.not.equal(txRequest.address)

        expect(balBeforeExecution.toNumber())
        .to.be.above(balAfterExecution.toNumber())

        await wait(2 * HOUR)

        txRequest = await TransactionRequest.at(await canary.txRequest())
        const requestData2 = await RequestData.from(txRequest)
        const callGas2 = requestData.txData.callGas
        const gasPrice2 = requestData.txData.gasPrice

        const balBeforeExecution2 = web3.eth.getBalance(canary.address)

        const receipt2 = await txRequest.execute({
            gas: callGas2 + 180000,
            gasPrice: gasPrice2
        })
        expect(receipt2)
        .to.exist

        const balAfterExecution2 = web3.eth.getBalance(canary.address)

        const now2 = web3.eth.getBlock('latest').timestamp 
        const lastHeartbeat2 = await canary.lastHeartbeat()

        expect(now2)
        .to.equal(lastHeartbeat2.toNumber())
        expect((await canary.heartbeatCount()).toNumber())
        .to.equal(2)

        expect(balBeforeExecution2.toNumber())
        .to.be.above(balAfterExecution2.toNumber())

        expect(await canary.txRequest())
        .to.not.equal(txRequest.address)
    })
})