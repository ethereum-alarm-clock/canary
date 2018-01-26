import React from "react"
import ReactDOM from "react-dom"
import Web3 from 'web3'

class App extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            ropstenStatus: false,
            rCanary: {},
            rWeb3: {}
        }
        this.getData = this.getData.bind(this)
    }


    componentDidMount () {
        const rWeb3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io'))
        const canaryABI = require('./abi.json')
        const rCanary = rWeb3.eth.contract(canaryABI).at('0x0e6ed6ab9da0117e15bce9bc35270daeee8257cd')
        // console.log(rCanary)
        rCanary.isAlive((err, initStatus) => {
            if (!err) {
                this.setState({
                    ropstenStatus: initStatus,
                    rCanary: rCanary,
                    rWeb3: rWeb3
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
    }

    render() {
        return (
        <div>
            <h1>Canary Status</h1>
            <button onClick={this.getData}>Refresh</button>
            <h3>
                <a href="https://ropsten.etherscan.io/address/0x0e6ed6ab9da0117e15bce9bc35270daeee8257cd">
                    Ropsten
                </a> - {this.state.ropstenStatus ? 'alive' : 'dead'}</h3>
        </div>
        )
    }
}

var mountNode = document.getElementById("app")
ReactDOM.render(
    <App/>, 
    mountNode
)