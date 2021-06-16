<main>
    <NavigationBar/>
    {#if web3Warn}
        <Web3Warn/>
    {:else if (!queryUser && !queryContract)}
        <ModalFactoryContract {counter} {newContract} {pendingTx} {showClose} {showPending}/>
        <BitPredictHelper/>
        <div class="w3-row">
            <div class="w3-col m5 l4 w3-padding">
                <ContractFactory {tickerList} {setPending}/>
            </div>
            <div class="w3-col m7 l8 w3-padding">
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
    <footer class="w3-white w3-padding w3-card-4" style="position: fixed; bottom: 0; width: 100%">
        <a class="w3-left w3-text-black" href="https://github.com/bitspent/bitpredict/blob/master/README.md" target="_blank"
           rel="noopener" style="text-decoration: none">
            <b>Integrate</b>
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABb0lEQVQ4T5XTTYhPYRTH8c/kJRZEzYZJ2VjYkKI0ZaWwmBUSKbJiq0gWs7UyiyliITFKCtmR3ewoJFux8TLIy0xolJeafnX+9bhl/jl16z7nd873nnPueQb8bUuwDsvrWYbF+I6v+IYPeNVLG6iXFRjHPgTSz17iJO70ANdxoF9WR/+DLQGkzC9Y+J+AhI8HsBUPmuSH+IgRRP9d8E+YwPHyJ2UyATtwvwGkt7NYVcPLAFdXlT/wts5JeRLAXtxsAIdwbZ52HmFz6c8DOILL5ZjByj6zyAeuVsxUAMdwoRzvmvL+xdmN2yV+DuAwrjTRQ5iap4ozOF36mwD24FaTcA/7a/O6nG018KXtDHYhSbFz2IT1Ndi0F8v5EoY7xKepYAOelfATO7GxfJPlz32YxYIO4G4Acb7HYInT2fGqqm0t8EUdwKneXTiKix1xDCca36/Our/IPvQAiduOg1iLNbiB0QaQP5NKX+Mxzmc75wCbxUnLgSdS/AAAAABJRU5ErkJggg==" alt="github">
        </a>
        <a class="w3-right" href="https://www.instagram.com/p/CAu0kN-gd_u/" target="_blank" rel="noopener"
           style="text-decoration: none">
            <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABb0lEQVQ4T6XTv0uXURTH8ZcaYiaGg0NDS0vR1FCIS6CgQTSYg0tSELSGQiS09ANFEBF0cAklgkB06Q8QEgVBaWhqbioCDdJAsaw4cB54FL9fBS9cHh7uOe97Pud+To1TrppS/ln0ox2NFbi/8AFz2I+YAtCKJVzMgO0KgPPoxDpuY6cAvMmbb+J7FVWXUItlvMbzAMT+iQHMlpJDxg38xRrOYQNPM+cRLkdyHIS2KC30xbqLGbTk/1fcw4WUeh3v0ByAJoTmjjy8ik+YxkucwTh6cAXfcCcb2XQUYAzduFaSE5AvmMhdFfAWDeg71MwVrGLouAoG8SzL3UxIdP8z7mP+OED05CPqsg/1eJwS4pnDQAckRLk76MJi3hjGGsYt/MF7vMjXipDe4pUKI0WDwgOvTjgaU+mR9gIQuuPGMMcCflcAxbw8xCQehBcKQHxH8CStulsFsJeVjpaHqYgP7W3pzvKkxvk/bKWtfxQJ/wHc8VERNGxFkQAAAABJRU5ErkJggg==" alt="instagram">
        </a>
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

    import _Web3 from 'web3';

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

        closure = created * 1000 + closure * 1000;
        execution = created * 1000 + execution * 1000;

        let ticketPriceWei = await BitPredict.callAsync('ticketPriceWei');
        let ticker = await BitPredict.callAsync('ticker');
        let resolver = await BitPredict.callAsync('resolver');
        let winGuess = await BitPredict.callAsync('winGuess');
        let winReward = await BitPredict.callAsync('winReward');
        let winShare = await BitPredict.callAsync('winShare');
        let counters = await BitPredict.callAsync('counters');
        let usersCount = counters[0];
        let winnersCount = counters[1];

        let futures = await BitPredict.callAsync('futures', userAddress);

        userPrediction = (await BitPredict.callAsync('futures', userAddress)) / 100;
        userPredicted = userPrediction > 0;
        userTicker = cleanAscii(_Web3.utils.toAscii(ticker));
        userJackpot = ticketPriceWei * usersCount * 1e-18;
        userFees = 100 - winShare;
        ticketPrice = ticketPriceWei * 1e-18;
        userContract.contract = BitPredict.address;
        userContract.closure = closure;
        userContract.execution = execution;

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

            let winner = event.returnValues.winner;
            let solution = event.returnValues.solution;
            let guess = event.returnValues.guess;
            let reward = event.returnValues.reward;

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
            let user = event.returnValues.user;
            let bet = event.returnValues.bet;
            let time = event.returnValues.time;
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

            let creator = event.returnValues.creator;
            let contract = event.returnValues.bitPredict;
            let ticker = cleanAscii(_Web3.utils.toAscii(event.returnValues.ticker));
            let ticket = `${event.returnValues.weiTicket / 1e18} ETH`;
            let now = new Date().getTime();

            let created = event.returnValues.created * 1000;
            let closure = created + event.returnValues.closureDelay * 1000;
            let execution = created + event.returnValues.executionDelay * 1000;

            let evt = {
                creator: creator,
                contract: contract,
                ticker: ticker,
                ticket: ticket,
                closure: closure,
                execution: execution
            };
            if (event.transactionHash === pendingTx) {
                newContract = event.returnValues.bitPredict;
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
                tickerList = tickerList.map(ticker => cleanAscii(_Web3.utils.toAscii(ticker)));
                clearPending(true);
                watchFactory();
            }
        }
    });

</script>