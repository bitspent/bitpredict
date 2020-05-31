import abis from './abis';

/*
 * Predict Client
 */
let BitPredict = {

        abi: abis.bitPredict,

        address: '',

        setAddress: function (address) {
            BitPredict.address = address;
        },

        instance() {
            return web3.eth.contract(BitPredict.abi).at(BitPredict.address);
        },

        instanceAt(address) {
            let contract = web3.eth.contract(BitPredict.abi).at(address);
            return {
                callAsync: function () {
                    let args = Array.prototype.slice.apply(arguments).splice(1);
                    let method = contract[arguments[0]];
                    return new Promise((resolve, reject) => {
                        args.push((err, res) => err ? reject(err) : resolve(res));
                        method.call.apply(this, args);
                    });
                }
            }
        },

        async callContractAsync() {
            let args = Array.prototype.slice.apply(arguments).splice(1);
            let method = BitPredict.instance()[arguments[0]];
            return new Promise((resolve, reject) => {
                args.push((err, res) => err ? reject(err) : resolve(res));
                method.call.apply(this, args);
            });
        },

        placeBetAsync(address, userPrediction, ticketEth) {
            return new Promise((res, rej) => {
                let price = Number(userPrediction).toFixed(2) * 100;
                let wei = ticketEth * 1e18 + price;
                const GAS_COST = 20e9;
                const OP_COST = 150000;
                web3.eth.sendTransaction({
                        from: address,
                        to: BitPredict.address,
                        value: wei,
                        gasPrice: GAS_COST,
                        gas: OP_COST
                    }, (e, r) => e && rej(e) || res(r)
                );
            });
        },

        async callAsync() {
            let method = BitPredict.instance()[arguments[0]];
            let args = Array.prototype.slice.apply(arguments).splice(1);
            return new Promise((resolve, reject) => {
                args.push((err, res) => err ? reject(err) : resolve(res));
                method.call.apply(this, args);
            });
        },

        watchContractBets(cb) {
            BitPredict
                .instance()
                .PriceBet({}, {fromBlock: 0, toBlock: 'latest'})
                .watch(function (error, event) {
                    if (!error) {
                        cb && cb(event)
                    } else {
                        console.log(`error while watching factory events: ${error}`);
                    }
                });
        },

        watchContractWins(cb) {
            BitPredict
                .instance()
                .WinnerPayout({}, {fromBlock: 0, toBlock: 'latest'})
                .watch(function (error, event) {
                    if (!error) {
                        cb && cb(event)
                    } else {
                        console.log(`error while watching factory events: ${error}`);
                    }
                });
        }
    }
;

export default BitPredict;