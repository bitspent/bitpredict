import abis from './abis';
import _Web3 from "web3";

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
            const web3NoAccount = new _Web3(web3.currentProvider);
            return new web3NoAccount.eth.Contract(BitPredict.abi, BitPredict.address, {});
        },

        instanceAt(address) {
            const web3NoAccount = new _Web3(web3.currentProvider);
            let contract = new web3NoAccount.eth.Contract(BitPredict.abi, address, {});
            return {
                callAsync: async function () {
                    let method = contract.methods[arguments[0]];
                    let args = Array.prototype.slice.apply(arguments).splice(1);
                    let func = args.length > 0 ? method.call(this, args[0]) : method.call();
                    return await func.call();
                }
            }
        },

        async callContractAsync() {
            let method = BitPredict.instance().methods[arguments[0]];
            let args = Array.prototype.slice.apply(arguments).splice(1);
            let func = args.length > 0 ? method.call(this, args[0]) : method.call();
            return await func.call();
        },

        placeBetAsync(address, userPrediction, ticketEth) {
            return new Promise((res, rej) => {
                let price = Number(userPrediction).toFixed(2) * 100;
                let wei = ticketEth * 1e18 + price;
                const OP_COST = 150000;
                web3.eth.sendTransaction({
                        from: address,
                        to: BitPredict.address,
                        value: wei,
                        gas: OP_COST
                    }, (e, r) => e && rej(e) || res(r)
                );
            });
        },

        async callAsync() {
            let method = BitPredict.instance().methods[arguments[0]];
            let args = Array.prototype.slice.apply(arguments).splice(1);
            let func = args.length > 0 ? method.call(this, args[0]) : method.call();
            return await func.call();
        },

        watchContractBets(cb) {
            BitPredict
                .instance()
                .events['PriceBet']({filter: {}, fromBlock: 0}, function (error, event) {
                if (error) {
                    console.log(`error while watching factory events: ${error}`);
                }
            }).on('data', function (event) {
                console.log(event);
                cb && cb(event)
            }).on('changed', function (event) {

            }).on('error', console.error);
        },

        watchContractWins(cb) {
            BitPredict
                .instance()
                .events['WinnerPayout']({filter: {}, fromBlock: 0}, function (error, event) {
                if (error) {
                    console.log(`error while watching factory events: ${error}`);
                }
            }).on('data', function (event) {
                console.log(event);
                cb && cb(event)
            }).on('changed', function (event) {

            }).on('error', console.error);
        }
    }
;

export default BitPredict;