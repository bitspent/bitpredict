<div class="w3-col m6 l5 w3-padding">
    <div class="w3-border-blue w3-round w3-border w3-white">
        <div class="w3-container w3-blue" >
            <h6 class="w3-left"><b>Ticker Prediction</b></h6>
            <h6 class="w3-right w3-medium"><b> {userTicker} / {tickerPrice}</b></h6>
        </div>
        <div class="w3-container w3-margin-top w3-large">
            <label class="w3-text-black">
                <b class="w3-tooltip w3-large"> {userPredicted ? 'You Are Betting On:' : 'Enter Your Bet Price:' }
                    <span style="position:absolute;left:240px;z-index: 1"
                          class="w3-text w3-tag">On Execution Time</span>
                </b>
                <input type="number" bind:value={userPrediction} disabled={userPredicted}
                       style="height: 60px;" onfocus="this.select()"
                       class="w3-input w3-jumbo w3-border w3-light-grey slider w3-margin-top
                                   w3-center w3-margin-bottom">
            </label>
            <div class="w3-text-black w3-margin-top">
                <b class="w3-left w3-small">House Fees: {userFees}%</b>
                <b class="w3-right">Jackpot: {userJackpot.toFixed(2)} ETH</b>
            </div>
            <br>
            <div class="w3-center">
                <button class="w3-button w3-round w3-margin-top w3-margin-bottom w3-blue"
                        on:click={placeBet} disabled={!userOpen || userPredicted || userExecuted}>
                    {#if userExecuted}
                        <b>Executed</b>
                    {:else if userOpen}
                        <b>Place Bet {ticketPrice}  ETH</b>
                    {:else}
                        <b>{userStatus}</b>
                    {/if}
                </button>
                {#if qrURIData}
                    <br>
                    OR Just Scan
                    <br>
                    <img src="{qrURIData}" alt="QRCode">
                    <br>
                    For Supported Wallets
                    <br>
                {/if}
            </div>
        </div>
    </div>
</div>
<div class="w3-col m6 l7 w3-padding">
    <div class="w3-border-blue w3-round w3-border w3-white">
        <div class="w3-container w3-blue">
            <h6><b>Users Bets</b></h6>
        </div>
        <table class="w3-table w3-striped w3-small w3-hoverable">
            <tr>
                <th>Address</th>
                <th>Price Bet</th>
                <th>Time</th>
            </tr>
            {#each items as event}
                <BetRow event={event} user={userAddress}/>
            {/each}
        </table>
    </div>
</div>
<script>

    import BetRow from "./BetRow.svelte";
    import BitPredict from "../js/BitPredict";

    let QRCode = require('qrcode');

    export let userAddress;
    export let qrURIData;
    export let userExecuted;
    export let userOpen;
    export let userPredicted;
    export let ticketPrice;
    export let userStatus;
    export let events;
    export let userTicker;
    export let tickerPrice;
    export let userPrediction;
    export let userFees;
    export let userJackpot;
    export let queryContract;
    export let setLoading;

    let items = [];

    $ : update(userPredicted, userOpen, userPrediction, tickerPrice);

    function update() {
        let price = Number(userPrediction).toFixed(2) * 100;
        let wei = ticketPrice * 1e18 + price;
        const GAS_COST = 20e9;
        const OP_COST = 150000;
        let paymentURL = `ethereum:${queryContract}?value=${wei}&gas=${OP_COST}`;
        QRCode.toDataURL(paymentURL, [], (e, uriData) => {
            qrURIData = uriData;
        });

        if (events.length > 0) {
            items = [];
            setTimeout(() => {
                items = inverse(events);
            }, 1);
        }
    }

    async function placeBet() {
        let pendingTx = await BitPredict.placeBetAsync(userAddress, userPrediction, ticketPrice);
        setLoading(pendingTx);
    }

    function inverse(arr) {
        let _ = [];
        for (let i = arr.length - 1; i >= 0; i--) {
            _.push(arr[i]);
        }
        return _;
    }


</script>