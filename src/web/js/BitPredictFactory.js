import abis from './abis';
import _Web3 from 'web3';

let BitPredictFactory = {

        abi: abis.bitPredictFactory,

        // test net: 0x0221bD8DC990512F7c7FF3417d5436BB52C32a56
        // main net: 0x4e8f1ccf050e59ec0939a34417ae9e175f862943
        address: '0x0221bD8DC990512F7c7FF3417d5436BB52C32a56',

        instance() {
            const web3NoAccount = new _Web3(web3.currentProvider);
            return new web3NoAccount.eth.Contract(BitPredictFactory.abi, BitPredictFactory.address, {});
        },

        createPredictionContractAsync(address, bytes9Ticker, uintWeiTicket, uintClosureDelay, uintExecutionDelay, uintFees) {
            return new Promise(async (resolve, reject) => {
                const PROVABLE_COST = 0.012e18;
                let contractPrice = await BitPredictFactory.callAsync('contractPrice');
                BitPredictFactory
                    .instance()
                    .methods
                    .createPredictionContract(bytes9Ticker, uintWeiTicket, uintClosureDelay, uintExecutionDelay, uintFees)
                    .send({
                        from: address,
                        value: PROVABLE_COST
                    }, (err, res) => err && reject(err) || resolve(res));
            });
        },

        async callAsync() {
            let method = BitPredictFactory.instance().methods[arguments[0]];
            let args = Array.prototype.slice.apply(arguments).splice(1);
            let func = method.call(args);
            return await func.call();
        },

        watchFactory(cb) {
            // noinspection JSUnresolvedFunction
            BitPredictFactory
                .instance()
                .events['PredictionContractCreated']({
                filter: {}, // Using an array means OR: e.g. 20 or 23
                fromBlock: 0
            }, function (error, event) {
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

export default BitPredictFactory;