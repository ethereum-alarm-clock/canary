import React from "react"
import ReactDOM from "react-dom"
import Web3 from 'web3'

class App extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            ropstenStatus: false,
            rCanary: {},
            rWeb3: {},
            rLastHeartbeat: '0',
            kovanStatus: false,
            kCanary: {},
            kWeb3: {},
            kLastHeartbeat: '0',
        }
        this.getData = this.getData.bind(this)
    }


    componentDidMount () {
        const rWeb3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io'))
        const kWeb3 = new Web3(new Web3.providers.HttpProvider('https://kovan.infura.io'))
        const canaryABI = require('./abi.json')
        const rCanary = rWeb3.eth.contract(canaryABI).at('0x0e6ed6ab9da0117e15bce9bc35270daeee8257cd')
        const kCanary = kWeb3.eth.contract(canaryABI).at('0xde48dcc43196a0347269eb0684da16dcf7f3f788')
        // console.log(rCanary)
        rCanary.isAlive((err, initStatus) => {
            if (!err) {
                this.setState({
                    ropstenStatus: initStatus,
                    rCanary: rCanary,
                    rWeb3: rWeb3,
                })
            } else {
                console.log(err)
            }
        })
        rCanary.lastHeartbeat((err, time) => {
            if (!err) {
                this.setState({
                    rLastHeartbeat: time.toNumber(),
                })
            } else {
                console.log(err)
            }
        })
        kCanary.isAlive((err, initStatus) => {
            if (!err) {
                this.setState({
                    kovanStatus: initStatus,
                    kCanary: kCanary,
                    kWeb3: kWeb3,
                })
            }
        })
        kCanary.lastHeartbeat((err, time) => {
            if (!err) {
                this.setState({
                    kLastHeartbeat: time.toNumber(),
                })
            } else {
                console.log(err)
            }
        })
    }

    getData () {
        this.state.rCanary.isAlive((err, status) => {
            if (!err) {
                console.log(status)
                this.setState({
                    ropstenStatus: status
                })
            } else {
                console.log(err)
            }
        })
        this.state.kCanary.isAlive((err, status) => {
            if (!err) {
                this.setState({
                    kovanStatus: status
                })
            } else {
                console.log(err)
            }
        })
        this.state.rCanary.lastHeartbeat((err, time) => {
            if (!err) {
                this.setState({
                    rLastHeartbeat: time.toNumber(),
                })
            } else {
                console.log(err)
            }
        })
        this.state.kCanary.lastHeartbeat((err, time) => {
            if (!err) {
                this.setState({
                    kLastHeartbeat: time.toNumber(),
                })
            } else {
                console.log(err)
            }
        })
    }

    render() {
        return (
        <div>
            <h1>Canary Status</h1>
            <button onClick={this.getData}>Refresh</button>
            <h3>
                <a href="https://kovan.etherscan.io/address/0xde48dcc43196a0347269eb0684da16dcf7f3f788">
                    Kovan
                </a> - {this.state.kovanStatus ? 'alive' : 'dead'} 
                <br />
                Last heartbeat: {new Date(this.state.kLastHeartbeat * 1000).toLocaleString()}
                <br />
                <br />
                <br />
                <a href="https://ropsten.etherscan.io/address/0x0e6ed6ab9da0117e15bce9bc35270daeee8257cd">
                    Ropsten
                </a> - {this.state.ropstenStatus ? 'alive' : 'dead'}
                <br />
                Last heartbeat: {new Date(this.state.rLastHeartbeat * 1000).toLocaleString()}
            </h3>
        </div>
        )
    }
}

const mountNode = document.getElementById("app")
ReactDOM.render(
    <App/>, 
    mountNode
)