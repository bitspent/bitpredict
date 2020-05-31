<main>
    <NavigationBar/>
    {#if web3Warn}
        <Web3Warn/>
    {:else if (!queryUser && !queryContract)}
        <ModalFactoryContract {counter} {newContract} {pendingTx} {showClose} {showPending}/>
        <BitPredictHelper/>
        <div class="w3-row">
            <div class="w3-col m6 l5 w3-padding">
                <ContractFactory {tickerList} {setPending}/>
            </div>
            <div class="w3-col m6 l7 w3-padding">
                <ContractsFactory {userAddress} events="{events}"/>
            </div>
        </div>
    {:else if (queryUser)}
        <ModalUserContract {counter} {pendingTx} {showPending}/>
        <div class="w3-container w3-center w3-margin-top">
            <br>
            <b class="w3-tag w3-round">Contracts Created by Wallet {BitEth.cutAddress(queryUser)}</b>
            <br>
            <br>
        </div>
        <div class="w3-row w3-margin-top">
            <div class="w3-col w3-padding">
                <UserContracts {events} {queryUser}/>
            </div>
        </div>
    {:else if (queryContract)}
        <ModalBetTransaction {counter} {pendingTx} {showClose} {showPending} {userPrediction} {userTicker}/>
        <div class="w3-container w3-center w3-margin-top">
            <br>
            <b class="w3-tag w3-round">Contract: {BitEth.cutAddress(queryContract)}</b>
            <br><br>
            <div class="w3-xlarge">
                <ContractCountdown event={userContract}/>
            </div>
        </div>
        <div class="w3-row w3-content w3-margin-top">
            {#if userOpen}
                <UserContractBet {userAddress} {userExecuted} {userOpen} {userPredicted} {ticketPrice}
                                 {userStatus} {userTicker} {tickerPrice} {userPrediction} {userFees} {userJackpot}
                                 {queryContract} {events} {setLoading}/>
            {:else if userExecuted}
                <div class="w3-col m12 l12 w3-padding">
                    <ContractWinners {winners}/>
                </div>
                <div class="w3-col m12 l12 w3-padding">
                    <ContractSubscribers {events} {userAddress}/>
                </div>
            {:else}
                <div class="w3-col m12 l12 w3-padding">
                    <ContractSubscribers {events} {userAddress}/>
                </div>
            {/if}
        </div>
    {/if}
    <br><br>
    <footer class="w3-blue w3-padding w3-card-4" style="position: fixed; bottom: 0; width: 100%">
        <a class="w3-left" href="." style="text-decoration: none"><b>Integrate</b></a>
        <a class="w3-right" href="." style="text-decoration: none"><b>Github</b></a>
    </footer>
</main>
<script>

    import BitPredict from '../js/BitPredict';
    import BitPredictFactory from '../js/BitPredictFactory';
    import BitEth from '../js/BitEth';

    import {onMount} from 'svelte';
    import ContractCountdown from './ContractCountdown.svelte'

    import BitPredictHelper from "./BitPredictHelper.svelte";
    import Web3Warn from "./Web3Warn.svelte";
    import NavigationBar from "./NavigationBar.svelte";
    import ModalFactoryContract from "./ModalFactoryContract.svelte";
    import ContractFactory from "./ContractFactory.svelte";
    import ContractsFactory from "./ContractsFactory.svelte";
    import ModalUserContract from "./ModalUserContract.svelte";
    import UserContracts from "./UserContracts.svelte";
    import ModalBetTransaction from "./ModalBetTransaction.svelte";
    import UserContractBet from "./UserContractBet.svelte";
    import ContractWinners from "./ContractWinners.svelte";
    import ContractSubscribers from "./ContractSubscribers.svelte";

    let web3 = window['web3'];

    let tickerList = [];
    let web3Warn = false;
    let helperHidden = true;
    let userAddress;
    let contractAddress;
    let queryUser;
    let queryContract;
    let counterInterval;
    let showPending = false;
    let showClose = false;
    let newContract = null;
    let pendingTx = null;
    let counter = 0;
    let events = [];
    let winners = [];
    let userPrediction = 0;
    let userPredicted = false;
    let userTicker = '';
    let userJackpot = 0;
    let userFees = 0;
    let tickerPrice = 0;
    let ticketPrice = 0;
    let userOpen = false;
    let userStatus = false;
    let userExecuted = false;
    let userContract = {
        notifyStatus: (open, status, executed) => {
            userOpen = open;
            userStatus = status;
            userExecuted = executed;
        }
    };

    let txCache = {};

    async function loadContract() {
        let created = await BitPredict.callAsync('created');
        let closure = await BitPredict.callAsync('closureDelay');
        let execution = await BitPredict.callAsync('executionDelay');
        let ticketPriceWei = await BitPredict.callAsync('ticketPriceWei');
        let ticker = await BitPredict.callAsync('ticker');
        let resolver = await BitPredict.callAsync('resolver');
        let winGuess = await BitPredict.callAsync('winGuess');
        let winReward = await BitPredict.callAsync('winReward');
        let winShare = await BitPredict.callAsync('winShare');
        let [usersCount, winnersCount] = await BitPredict.callAsync('counters');
        userPrediction = (await BitPredict.callAsync('futures', userAddress)).toNumber() / 100;
        userPredicted = userPrediction > 0;
        userTicker = cleanAscii(web3.toAscii(ticker));
        userJackpot = ticketPriceWei.toNumber() * usersCount * 1e-18;
        userFees = 100 - winShare;
        ticketPrice = ticketPriceWei.toNumber() * 1e-18;
        userContract.contract = BitPredict.address;
        userContract.closure = (created.toNumber() + closure.toNumber()) * 1000;
        userContract.execution = (created.toNumber() + execution.toNumber()) * 1000;

        tickerPrice = await resolveTickerPriceAsync(resolver);

        if (!userPredicted) {
            userPrediction = tickerPrice;
        }
    }

    async function resolveTickerPriceAsync(resolver) {
        const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        const url = resolver.match(urlRegex, function (url) {
            return url
        });
        let priceText = await fetch(url).then(r => r.text());
        let pricePath = resolver.lastIndexOf(').') + 1;
        return eval(`JSON.parse('${priceText}')${resolver.substring(pricePath)}`)
    }

    function watchWinners() {
        BitPredict.watchContractWins((event) => {

            if (txCache[event.transactionHash] === 1) {
                return;
            } else {
                txCache[event.transactionHash] = 1;
            }

            let winner = event.args.winner;
            let solution = event.args.solution;
            let guess = event.args.guess;
            let reward = event.args.reward;

            let evt = {
                winner: winner,
                solution: solution,
                guess: guess,
                reward: reward
            };

            winners = addItem(winners, evt, 100);
        });
    }

    function watchBets() {
        BitPredict.watchContractBets((event) => {
            if (txCache[event.transactionHash] === 1) {
                return;
            } else {
                txCache[event.transactionHash] = 1;
            }
            if (event.transactionHash === pendingTx) {
                clearLoading();
                loadContract();
            }
            let user = event.args.user;
            let bet = event.args.bet;
            let time = event.args.time;
            let now = new Date().getTime();

            let evt = {
                user: user,
                bet: bet,
                time: time
            };

            events = addItem(events, evt, 100);
        });
    }

    function watchFactory() {
        BitPredictFactory.watchFactory((event) => {
            if (txCache[event.transactionHash] === 1)
                return;
            txCache[event.transactionHash] = 1;
            let creator = event.args.creator;
            let contract = event.args.bitPredict;
            let ticker = cleanAscii(web3.toAscii(event.args.ticker));
            let ticket = `${event.args.weiTicket / 1e18} ETH`;
            let now = new Date().getTime();
            let created = event.args.created;
            let closure = 1000 * (created.toNumber() + event.args.closureDelay.toNumber());
            let execution = 1000 * (created.toNumber() + event.args.executionDelay.toNumber());
            let evt = {
                creator: creator,
                contract: contract,
                ticker: ticker,
                ticket: ticket,
                closure: closure,
                execution: execution
            };
            if (event.transactionHash === pendingTx) {
                newContract = event.args.bitPredict;
                clearPending();
            }
            events = addItem(events, evt, 9);
        });
    }

    function addItem(items, item, pageSize) {
        if (items.length === pageSize) {
            for (let i = 0; i < pageSize - 1; i++)
                items[i] = items[i + 1];
            items[pageSize - 1] = item;
        } else {
            items.push(item);
        }
        return items;
    }

    function cleanAscii(str) {
        return str.replace(/[^\x20-\x7E]/g, '');
    }

    function setPending(tx) {
        counter = 0;
        pendingTx = tx;
        showPending = true;
        showClose = false;
        counterInterval = setInterval(() => ++counter, 1000);
    }

    function clearPending(close) {
        pendingTx = null;
        if (close) {
            showPending = false;
        } else {
            showClose = true;
        }
        clearInterval(counterInterval);
    }

    function setLoading(tx) {
        counter = 0;
        showPending = true;
        pendingTx = tx;
        counterInterval = setInterval(() => ++counter, 1000);
    }

    function clearLoading() {
        if (userPredicted) {
            showClose = true;
        } else {
            showPending = false;
        }
        clearInterval(counterInterval);
    }

    onMount(async () => {
        web3Warn = !web3;
        if (!web3Warn) {
            let query = new URLSearchParams(window.location.search);
            queryUser = query.get('address');
            queryContract = query.get('contract');
            userAddress = await BitEth.getAddressAsync();
            if (queryContract) {
                setLoading();
                BitPredict.setAddress(queryContract);
                await loadContract();
                clearLoading();
                watchBets();
                watchWinners();
            } else {
                setPending(null);
                tickerList = await BitPredictFactory.callAsync('tickersList');
                tickerList = tickerList.map(ticker => cleanAscii(web3.toAscii(ticker)));
                clearPending(true);
                watchFactory();
            }
        }
    });

</script>