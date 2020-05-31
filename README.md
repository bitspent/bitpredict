# BitPredict
**Crypto Currency Betting Platform**
```bash
Powered By Ethereum Smart Contracts!
```
## What is BitPredict?
It is about Crypto Price Betting.
- Participants competes to predict upcoming crypto price.
- The winner(s) are who predicted the nearest future price.
- The Reward is the Contract Jackpot minus the beneficiary fees.

## Who can create the contract?
BitPredict a Smart Contract Betting Factory.
- The protocol is living on the blockchain
- Anyone can freely interact 
- You can create your own flavor Betting Contract
- Share the participation link with your friends/connections.

## BitPredict Contract?
Creating the contract consists of 4 inputs / options:
- **Contract Ticker:** the bet prediction target e.g. BTC-USD
- **Ticket Price:** the participation price
- **Closure Delay:** until when people can still participate
- **Execution Delay:** the execution time, winner(s) pick and rewards
- **Beneficiary Fees:** your % fees on the jackpot total

## How It Works?
Let us Say your Created a **BitPredict** contract as follows:

Input|Value
-------|--------
Ticker|BTC-USD
Price|0.2 ETH
Closure|2 days
Execution|3 days
Beneficiary Fees| 5%

Your beneficiary is your wallet address:
***0xd04d90aC0E87ad156A5De6Faaa5595f9b4E45386***

**So the happy flow is**

1. Within 2 days having 5 participants:

Address|Prediction|
-------|--------|
0x369fF36DeF150A8fB4C1623142aba6DBc26C0D39|9580|
0xFb8E981d0DF292382541cc18db7421AdE58A0cDe|7500|
0xF3A6EE2c5CA4450071E4Cba69075a313b00f2dC1|10125|
0xcD7f213f001E982E4d6244B4186809014fE116CE|10500|
0xe0742a310cBB73c6348B2d27dB4C4c8c22cf23E9|9100|

2. Jackpot is 5*0.2 = 1 ETH
3. After 3 days the bitcoin price is got from CoinBase api
4. Let us say the BTC-USD ticker is 10210 USD
5. The closest participant prediction is 10125
7. The beneficiary fees 5%: 0.05 ETH are deduced
6. The participant reward: 1.9 ETH is automatically distributed to its wallet address 0xF3A6EE2c5CA4450071E4Cba69075a313b00f2dC1

## ON-CHAIN Integration
You can integrate our **BitPredictFactory** and create programmatically your **BitPredict**
Here you can find BitPredict solidity interfaces, compile generate and use their ABI as well!
e.g.
````solidity
import 'IBitPredictFactory.sol';

contract Test {

    constructor() public {
        IBitPredictFactory factory = IBitPredict(0x4e8f1ccf050e59ec0939a34417ae9e175f862943);
        uint  contractPriceWei = factory.contractPrice();
        // ...
    }
}
````
**IBitPredictFactory.sol:**
````solidity
pragma solidity ^0.5.17;

/// @dev use this interface to integrate with BitPredictFactory
interface IBitPredictFactory {
    
    /// @dev returns the BitPredict contract price in Wei
    function contractPrice() external returns (uint);

    /// @dev returns the supported tickers e.g. ['BTC-USD', 'ETH-USD']
    function tickersList() external view returns (bytes9[] memory);

    /// @dev event fired on BitPredict contract creation
    /// @notice you can watch this event on your pending transaction
    event PredictionContractCreated(
		address indexed creator,    // beneficiary address
		address bitPredict,         // BitPredict smarct contract address
		bytes9 ticker,              // BitPredict Ticker e.g. BTC-USD
		uint weiTicket,             // 2e17 WEI  : 0.2 ETH ticket price
		uint closureDelay,          // 2*24*3600 : 2 days  closure delay
		uint executionDelay,        // 3*24*3600 : 3 days  execution delay
		uint fees,                  // 5         : beneficiary fees 5%
		uint created                // creation time (now) in solidity
    );
	
    /// @dev create your BitPredict Contract
    /// @notice payable send contractPrice in wei with the arguments
    function createPredictionContract (
        bytes9 ticker,              // BTC-USD
        uint weiTicket,             // 2e17 WEI  : 0.2 ETH ticket price
        uint closureDelay,          // 2*24*3600 : 2 days  closure delay
        uint executionDelay,        // 3*24*3600 : 3 days  execution delay
        uint fees                   // 5         : beneficiary fees 5%
    ) external payable;
}
````

If you want to interact with your BitPredict Contract you can do it via the IBitPredict Interface:
e.g.
````solidity
import 'IBitPredict.sol';

contract Test {

    constructor() public {
        IBitPredict mContract = IBitPredict(0x70Ee5F70C3eECc4d951Ac87b7107fCcc33713469);
        uint  subscriptionPriceWei = mContract.ticketPriceWei();
    }
}
````
**IBitPredict.sol:**
````solidity
pragma solidity >= 0.5.0 < 0.6.0;


interface IBitPredict {

	/// @dev returns (now) contract deployment time
    function created() external returns (uint);
    
	/// @dev subscription available until (created + closureDelay)
    function closureDelay() external returns (uint);
	
	/// @dev price calculation and winners pick at (created + executionDelay)
	function executionDelay() external returns (uint);

    /// @dev ticket price in wei to subscribe
	function ticketPriceWei() external returns (uint);
	
	/// @dev contract ticker e.g. 'BTC-USD'
    function ticker() external returns (bytes9);

	/// @dev contract status: 0 open, 1 closed, 2 executed, 3 reward distributed
	function status() external returns (uint);
	
	/// @dev return the count of subscribers and winners
    function counters() external view returns (uint subs, uint wins);

	/// @dev execution actual ticker price e.g. 10400 for 'BTC-USD'
    function winSolution() external returns (uint);

	/// @dev winner closest prediction e.g. 10350 for 'BTC-USD'
    function winGuess() external returns(uint);

	/// @dev winner reward in WEI
    function winReward() external returns (uint);
	
	/// @dev emited on a new bet pariticipant
    event PriceBet(address user, uint bet, uint time);

	/// @dev emited on price execution
    event RoundExecuted(uint solution);
	
	/// @dev emited foreach winner reward
    event WinnerPayout(address winner, uint solution, uint guess, uint reward);

    // accept ether subscription payments
    // only one time per address
    // msg.value = ticketPriceWei + expected future price format in wei
    // Example 
    // 1. ticketPrice is 0.01 Ether 
    // 2. Your future price prediction is 9588.25
    // 3. You send 0.1 + 0.0000000000958825
    // 4. The contract registers your prediction of 958825
    // 5. The contract pays you back  get back 0.0000000000958825 Ether 
    function() payable external;
	
    /// @dev rollback subscribers ether if the execution did not happen after 24 hours
    /// @notice only the beneficiary msg.sender can withdraw total amount same share equally with the subscribers
    function rollback() external;
}
````