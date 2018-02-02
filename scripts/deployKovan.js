const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://localhost:8545')
const web3 = new Web3(provider)
const eac = require('eac.js')

const main = () => {
    web3.eth.defaultAccount = web3.eth.accounts[0]

    const eacScheduler = new eac.Scheduler(web3, 'kovan')
    const timestampScheduler = eacScheduler.timestampScheduler

    const canaryABI = require('../build/contracts/Canary.json').abi
    const bytecode = require('../build/contracts/Canary.json').bytecode
    const Canary = web3.eth.contract(canaryABI)
    
    Canary.new(timestampScheduler.address, {
        from: web3.eth.defaultAccount,
        data: bytecode,
        gas: 3000000
    }, (err, c) => {
        if (!err) {
            if (c.address) {
                console.log(
                    `Canary deployed at ${c.address}`
                )
            }
        } else {
            console.error('Could not deploy...\n')
            console.error(err)
        }
    })
}

main()