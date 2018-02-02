const Web3 = require('web3')
const provider = new Web3.providers.HttpProvider('http://localhost:8545')
const web3 = new Web3(provider)
const eac = require('eac.js')(web3)

// For the kovan network
const main = () => {
    [web3.eth.defaultAccount] = web3.eth.accounts
    const abi = require('../build/contracts/Canary.json').abi
    const C = web3.eth.contract(abi)
    const c = C.at('0xde48dcc43196a0347269eb0684da16dcf7f3f788')
    const txHash = c.decomission()
    return eac.Util.waitForTransactionToBeMined(txHash)
}

main()
.then(console.log)

module.export = main