import abis from './abis';

let BitPredictFactory = {

    abi: abis.bitPredictFactory,

    address: '0x4e8f1ccf050e59ec0939a34417ae9e175f862943',

    instance() {
        return web3.eth.contract(BitPredictFactory.abi).at(BitPredictFactory.address);
    },

    createPredictionContractAsync(address, bytes9Ticker, uintWeiTicket, uintClosureDelay, uintExecutionDelay, uintFees) {
        return new Promise(async (resolve, reject) => {
            const PROVABLE_COST = 0.012e18;
            const GAS_PRICE = 20e9;

            let contractPrice = await BitPredictFactory.callAsync('contractPrice');

            BitPredictFactory
                .instance()
                .createPredictionContract(bytes9Ticker, uintWeiTicket, uintClosureDelay, uintExecutionDelay, uintFees, {
                    from: address,
                    value: PROVABLE_COST,
                    gasPrice: GAS_PRICE
                }, (err, res) => err && reject(err) || resolve(res));
        });
    },

    async callAsync() {
        let method = BitPredictFactory.instance()[arguments[0]];
        let args = Array.prototype.slice.apply(arguments).splice(1);
        return new Promise((resolve, reject) => {
            args.push((err, res) => err ? reject(err) : resolve(res));
            method.call.apply(this, args);
        });
    },

    watchFactory(cb) {
        // noinspection JSUnresolvedFunction
        BitPredictFactory
            .instance()
            .PredictionContractCreated({}, {fromBlock: 0, toBlock: 'latest'})
            .watch(function (error, event) {
                if (!error) {
                    cb && cb(event)
                } else {
                    console.log(`error while watching factory events: ${error}`);
                }
            });
    }
};

export default BitPredictFactory;