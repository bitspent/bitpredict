pragma solidity >= 0.5.0 < 0.6.0;

/**f.aro*/

import "SafeMath.sol";

contract BitPredict {

    using SafeMath for uint256;

    uint public created;
    uint public executionDelay;
    uint public closureDelay;
    uint public ticketPriceWei;

    bytes9 public ticker;
    string public resolver;

    uint public status = 0;

    address payable [] public subscribers;
    mapping(address => uint) public futures;

    uint public winSolution;
    uint public winGuess;
    uint public winReward;
    uint public winShare;

    address[] public winners;
    address payable beneficiary;

    event RoundClose();

    event PriceBet(address user, uint bet, uint time);

    event RoundExecuted(uint solution);

    event WinnerPayout(address winner, uint solution, uint guess, uint reward);

    address payable factory;

    // deploy and schedule the contract
    // payable to cover provable oracle fees
    // After <delayClose> seconds no one can subscribe
    // After <delayExecute> seconds contract gets the bitcoin price and announce the winner(s)
    // winPer is the percentage on total jackpot remaing beneficiary fees
    constructor(address payable creator, uint winPer, uint weiTicket, uint closeDelay, uint executeDelay, bytes9 pair, string memory apiResolver) public payable {
        require(closeDelay < executeDelay, 'timing errors');
        require(winPer <= 100 && winPer > 0, 'profit error');

        created = now;
        ticker = pair;
        resolver = apiResolver;
        beneficiary = creator;
        executionDelay = executeDelay;
        closureDelay = closeDelay;
        ticketPriceWei = weiTicket;
        winShare = winPer;

        factory = msg.sender;
    }

    // accept ether subscription payments
    // only one time per address
    // msg.value = ticketPriceWei + expected future price format in wei
    // Example
    // 1. ticketPrice is 0.01 Ether
    // 2. Your future price prediction is 9588.25
    // 3. You send 0.1 + 0.0000000000958825
    // 4. The contract registers your prediction of 958825
    // 5. The contract pays you back  get back 0.0000000000958825 Ether
    function() payable external {
        require(status == 0, 'closed');
        require(msg.value > ticketPriceWei && msg.value < ticketPriceWei + 10000000, 'invalid ticket price');
        require(futures[msg.sender] == 0, 'already in');
        uint future = msg.value - ticketPriceWei;
        futures[msg.sender] = future;
        subscribers.push(msg.sender);
        msg.sender.transfer(future);
        emit PriceBet(msg.sender, future, now);
    }

    // return the count of subscribers and winners
    function counters() public view returns (uint subs, uint wins) {
        return (subscribers.length, winners.length);
    }

    // return absolute value:  | x - y |
    function priceDistance(uint x, uint y) private pure returns (uint) {
        return (x > y ? x.sub(y) : y.sub(x));
    }

    // close subscription doors
    function closeSubscriptions() public {
        require(msg.sender == factory, 'only factory');
        require(status == 0, 'wrong transition');
        status = 1;
        // in case of one+ subscribers
        // lunch the next solution timer
        if(subscribers.length == 0) {
            status = 2;
            distributeRewards();
        }
        emit RoundClose();
    }

    // if the execution did not happen after 24 hours
    // the beneficiary can withdraw total amount same share
    // equally with the subscribers
    function rollback() public {

        // should be not distributed
        require(status < 3, 'already distributed');

        // only the beneficiary can do it
        require(msg.sender == beneficiary, 'only beneficiary');

        // at least 24H passed without execution
        uint unlockTime = created.add(executionDelay).add(24*3600);
        require(now >= unlockTime, 'still early');

        // the balance is normally distributed
        uint perShareWei = address(this).balance.div(subscribers.length);
        for(uint i = 0; i < subscribers.length; i++) {
            subscribers[i].transfer(perShareWei);
        }
    }

    // set the solution and alarm the distribution
    // pay the factory and tell about the gas Limit
    function executeResult(uint solution) public returns (uint gasLimit) {
        require(msg.sender == factory, 'only factory');
        require(status == 1, 'wrong transition');
        status = 2;
        winSolution = solution;
        emit RoundExecuted(winSolution);

        // default provable 20 GWei per Gas and 200 000 GAS
        uint PROVABLE_GAS_PRICE = 20e9 wei;

        // estimation for the factory
        uint estGas = subscribers.length*7000 + 300000;
        uint estWei = estGas.mul(PROVABLE_GAS_PRICE);

        // check up the available cost
        if(address(this).balance >= estWei) {
            // defaulting extras back to factory
            factory.transfer((estGas.sub(200000)).mul(PROVABLE_GAS_PRICE));
            return estGas;
        } else {
            // The factory covers DEFAULT PROVABLE GAS COST: 20GWEI * 200 000 GAS
            return 200000;
        }
    }

    // calculate winners and distribution
    function distributeRewards() public {
        require(status == 2, 'wrong transition');
        require(msg.sender == beneficiary || msg.sender == factory, 'not authorized');
        status = 3;
        if (subscribers.length > 0) {
            uint distance;
            uint minDistance = 10 ** 11;
            uint windex = 0;
            address payable[] memory wins = new address payable[](subscribers.length);
            uint i;
            // GetWinners
            for (i = 0; i < subscribers.length; i++) {
                distance = priceDistance(futures[subscribers[i]] * 10000, winSolution);
                if (distance < minDistance) {
                    windex = 0;
                    wins[windex] = subscribers[i];
                    minDistance = distance;
                    winGuess = futures[subscribers[i]];
                } else if (distance == minDistance) {
                    wins[++windex] = subscribers[i];
                }
            }
            // WinnerPayout
            windex++;

            // total balance adjust
            uint total = ticketPriceWei * subscribers.length;
            if(address(this).balance < total)
                total = address(this).balance;

            winReward = (total.mul(winShare)).div(windex.mul(100));
            for (i = 0; i < windex; i++) {
                winners.push(wins[i]);
                wins[i].transfer(winReward);
                emit WinnerPayout(wins[i], winSolution, futures[wins[i]], winReward);
            }

            // BeneficiaryPayout
            uint ONE_HUNDRED = 100;
            beneficiary.transfer((total.mul(ONE_HUNDRED.sub(winShare))).div(100));
        }

        // Factory mint back
        if(address(this).balance > 0) {
            factory.transfer(address(this).balance);
        }
    }
}
