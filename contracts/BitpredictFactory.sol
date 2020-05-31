pragma solidity >= 0.5.0 < 0.6.0;

/**f.aro*/

import "Ownable.sol";
import "provableAPI.sol";
import "BitPredict.sol";
import "SafeMath.sol";

contract BitPredictFactory is Ownable, usingProvable {

    using SafeMath for uint256;

    // default contractPrice in wei
    uint public contractPrice = 12e15 wei;

    // registered tickers
    bytes9[] public tickers;
    mapping(bytes9 => string) public tickersResolvers;

    // all bet contracts
    address[] public bitPredicts;

    // provable callbacks
    mapping(bytes32 => address payable) callbax;

    event PredictionContractCreated(address indexed creator, address bitPredict, bytes9 ticker, uint weiTicket, uint closureDelay, uint executionDelay, uint fees, uint created);

    constructor () public {
        // beneficiary owner
        owner = msg.sender;
        // initial supported tickers
        // bitcoin USD ticker
        tickers.push('BTC-USD');
        tickersResolvers['BTC-USD'] = "json(https://api.pro.coinbase.com/products/BTC-USD/ticker).price";
        // ethereum USD ticker
        tickers.push('ETH-USD');
        tickersResolvers['ETH-USD'] = "json(https://api.pro.coinbase.com/products/ETH-USD/ticker).price";
    }

    function createPredictionContract(bytes9 ticker, uint weiTicket, uint closureDelay, uint executionDelay, uint fees) public payable {

        // should cover provable
        require(msg.value >= contractPrice, 'low price');
        require(address(this).balance > provable_getPrice("URL"), 'provable off');

        // mandatory ticker is registered
        string memory resolver = tickersResolvers[ticker];
        require(bytes(resolver).length > 0);

        // create and log the smart contract
        require(fees >= 0 && fees <= 100, 'fees error');
        BitPredict bitPredict = new BitPredict(msg.sender, 100 - fees, weiTicket, closureDelay, executionDelay, ticker, resolver);
        bitPredicts.push(address(bitPredict));
        emit PredictionContractCreated(msg.sender, address(bitPredict), ticker, weiTicket, closureDelay, executionDelay, fees, now);

        // provable covered in contractPrice
        bytes32 uid = provable_query(closureDelay, "URL", "");
        callbax[uid] = address(bitPredict);
    }

    function counter() public view returns (uint) {
        return bitPredicts.length;
    }

    function tickersList() public view returns (bytes9[] memory) {
        return tickers;
    }

    function setContractPrice(uint priceWei) public onlyOwner {
        // provable defaulting at 200 000 gas
        // at default price or 20 GWei
        // => 2e5*20e9 = 4e15
        require(priceWei > 4e15, 'should cover provable');
        contractPrice = priceWei;
    }

    function setTickerResolver(bytes9 ticker, string memory resolver) public onlyOwner {
        // existing ticker
        for (uint i = 0; i < tickers.length; i++) {
            if (tickers[i] == ticker) {
                tickersResolvers[ticker] = resolver;
                return;
            }
        }
        // new ticker
        tickers.push(ticker);
        tickersResolvers[ticker] = resolver;
    }

    function removeTicker(bytes9 ticker) public onlyOwner {
        // delete ticker
        // remove resolver
        for (uint i = 0; i < tickers.length; i++) {
            if (tickers[i] == ticker) {
                delete tickersResolvers[ticker];
                for (; i < tickers.length - 1; i++) {
                    tickers[i] = tickers[i + 1];
                }
                tickers.length--;
                break;
            }
        }
    }

    // BitPredictFactory payable fallback
    function() payable external {

    }

    // BitPredictFactory fees withdraw
    function withdraw() public onlyOwner {
        owner.transfer(address(this).balance);
    }

    function __callback(bytes32 _myid, string memory _result, bytes memory _proof) public {
        // only provable callback
        require(msg.sender == provable_cbAddress());

        address payable callback = callbax[_myid];
        require(callback != address(0), 'invalid callback');

        // get the predictor instance
        BitPredict predictor = BitPredict(callbax[_myid]);

        // get the predictor status
        uint status = predictor.status();

        // when status is executed await the distribution
        if(status == 2)
            predictor.distributeRewards();

        // when status is closed checkout the result
        else if(status == 1) {
            uint solution = parseInt(_result, 6);
            // get paid, check gas limit and schedule
            uint gasLimit = predictor.executeResult(solution);
            bytes32 uid = provable_query(1, "URL", "", gasLimit);
            // update the callback
            callbax[uid] = callback;
        }
        // when status is open close subscription => status = 1
        else if (status == 0) {
            predictor.closeSubscriptions();
            // when no subscribers than status will switch to 3
            if (predictor.status() < 3) {
                uint delay = predictor.executionDelay().sub(predictor.closureDelay());
                bytes32 uid = provable_query(delay, "URL", predictor.resolver());
                callbax[uid] = callback;
            }
        }
        _proof;
    }

}